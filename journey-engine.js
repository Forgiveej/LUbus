/* Campus journey planning. No DOM dependencies and no credentials.
 * Bus geometry/stops: the local, published Passio GO snapshot.
 * Walking/driving routes: FOSSGIS OSRM, https://routing.openstreetmap.de/about.html
 * Request syntax: https://project-osrm.org/docs/v5.24.0/api/#route-service
 * Shared provider policy: at most one request per second; no automatic retries.
 */
(function (root) {
  'use strict';

  const EARTH_METERS = 6371008.8;
  const RAD = Math.PI / 180;
  const geometryCache = new WeakMap();
  const routeCache = new Map();
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const MAX_CACHE = 100;
  const REQUEST_GAP_MS = 1050;
  const REQUEST_TIMEOUT_MS = 18000;
  let requestTail = Promise.resolve();
  let lastRequestAt = 0;

  function coordinate(value) {
    if (!value || typeof value !== 'object') return null;
    const rawLat = Array.isArray(value) ? value[0] : value.lat;
    const rawLng = Array.isArray(value) ? value[1] : (value.lng ?? value.lon);
    if ([rawLat, rawLng].some(number => number === null || number === undefined || number === '' || typeof number === 'boolean')) return null;
    const lat = Number(rawLat), lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return [lat, lng];
  }
  function distanceMeters(a, b) {
    const p = coordinate(a), q = coordinate(b);
    if (!p || !q) return Infinity;
    const dLat = (q[0] - p[0]) * RAD, dLng = (q[1] - p[1]) * RAD;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(p[0] * RAD) * Math.cos(q[0] * RAD) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_METERS * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  function pathLength(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) total += distanceMeters(points[i - 1], points[i]);
    return total;
  }
  function stopData() { return root.LEHIGH_TRANSIT_DATA?.stops || {}; }

  function project(point, a, b, arcStart, length, index) {
    const cos = Math.cos(point[0] * RAD);
    const scale = EARTH_METERS * RAD;
    const ax = (a[1] - point[1]) * cos * scale, ay = (a[0] - point[0]) * scale;
    const bx = (b[1] - point[1]) * cos * scale, by = (b[0] - point[0]) * scale;
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
    return { arc: arcStart + length * t, point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
      error: Math.hypot(ax + dx * t, ay + dy * t), segment: index };
  }
  function projectionCandidates(point, points, cumulative) {
    const all = [];
    for (let i = 1; i < points.length; i++) {
      all.push(project(point, points[i - 1], points[i], cumulative[i - 1], cumulative[i] - cumulative[i - 1], i - 1));
    }
    all.sort((a, b) => a.error - b.error);
    const nearest = all[0]?.error ?? Infinity;
    // Keep alternative passes of the same road: directional stops often share a coordinate.
    const maxError = Math.max(80, nearest + 25);
    const chosen = [];
    for (const item of all) {
      if (item.error > maxError || chosen.length >= 100) break;
      if (!chosen.some(other => Math.abs(other.arc - item.arc) < 2)) chosen.push(item);
    }
    return chosen;
  }

  function routeGeometryIndex(route) {
    if (!route || typeof route !== 'object') return null;
    if (geometryCache.has(route)) return geometryCache.get(route);
    const parts = Array.isArray(route.path?.[0]?.[0]) ? route.path : [route.path || []];
    const points = [];
    for (const part of parts) {
      const valid = part.map(coordinate).filter(Boolean);
      if (!valid.length) continue;
      // Never invent a connection across a missing portion of a multipart track.
      if (points.length && distanceMeters(points.at(-1), valid[0]) > 30) {
        geometryCache.set(route, null); return null;
      }
      for (const point of valid) if (!points.length || distanceMeters(points.at(-1), point) > 0.01) points.push(point);
    }
    if (points.length < 2) { geometryCache.set(route, null); return null; }
    const loop = route.loop !== false;
    if (loop && distanceMeters(points[0], points.at(-1)) > 0.01) {
      if (distanceMeters(points[0], points.at(-1)) > 100) { geometryCache.set(route, null); return null; }
      points.push(points[0]);
    }
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) cumulative.push(cumulative.at(-1) + distanceMeters(points[i - 1], points[i]));
    const length = cumulative.at(-1);
    const stops = stopData();
    const ids = (route.stops || []).map(String);
    if (ids.length < 2 || ids.some(id => !coordinate(stops[id]))) { geometryCache.set(route, null); return null; }
    const candidates = ids.map(id => projectionCandidates(coordinate(stops[id]), points, cumulative));

    // Solve all stop positions together, in published stop order, around at most
    // one loop. Independent nearest-point matching chooses the wrong direction
    // at Taylor College and on shared northbound/southbound road segments.
    let best = null;
    const anchors = candidates[0].slice(0, 40);
    for (const anchor of anchors) {
      let prior = [{ ...anchor, arc: anchor.arc, cost: anchor.error ** 2, prev: null }];
      for (let stopIndex = 1; stopIndex < ids.length && prior.length; stopIndex++) {
        const eligible = [];
        for (const candidate of candidates[stopIndex]) {
          for (let turn = 0; turn <= (loop ? 1 : 0); turn++) {
            const arc = candidate.arc + turn * length;
            if (arc >= anchor.arc - 0.01 && arc <= anchor.arc + length + 0.01) eligible.push({ ...candidate, arc });
          }
        }
        eligible.sort((a, b) => a.arc - b.arc);
        prior.sort((a, b) => a.arc - b.arc);
        let cursor = 0, cheapest = null;
        const next = [];
        for (const candidate of eligible) {
          while (cursor < prior.length && prior[cursor].arc <= candidate.arc + 0.01) {
            if (!cheapest || prior[cursor].cost < cheapest.cost) cheapest = prior[cursor];
            cursor++;
          }
          if (cheapest) next.push({ ...candidate, cost: cheapest.cost + candidate.error ** 2, prev: cheapest });
        }
        prior = next;
      }
      for (const end of prior) {
        if (!best || end.cost < best.cost) best = end;
      }
    }
    if (!best) { geometryCache.set(route, null); return null; }
    const projections = [];
    for (let item = best; item; item = item.prev) projections.unshift(item);
    if (projections.length !== ids.length) { geometryCache.set(route, null); return null; }
    const result = { points, cumulative, length, loop, ids, projections };
    geometryCache.set(route, result);
    return result;
  }

  function rideInfo(route, boardId, alightId) {
    const index = routeGeometryIndex(route);
    if (!index) return null;
    const boardIndex = index.ids.indexOf(String(boardId)), alightIndex = index.ids.indexOf(String(alightId));
    if (boardIndex < 0 || alightIndex < 0 || boardIndex === alightIndex) return null;
    if (!index.loop && alightIndex < boardIndex) return null;
    const start = index.projections[boardIndex], finish = index.projections[alightIndex];
    let endArc = finish.arc;
    if (alightIndex < boardIndex) endArc += index.length;
    const geometry = [start.point.slice()];
    const firstTurn = Math.floor(start.arc / index.length), lastTurn = Math.floor(endArc / index.length);
    for (let turn = firstTurn; turn <= lastTurn; turn++) {
      for (let i = 1; i < index.points.length; i++) {
        const arc = index.cumulative[i] + turn * index.length;
        if (arc > start.arc + 0.01 && arc < endArc - 0.01) geometry.push(index.points[i].slice());
      }
    }
    geometry.push(finish.point.slice());
    const stopCount = (alightIndex - boardIndex + index.ids.length) % index.ids.length;
    const stopIds = Array.from({ length: stopCount + 1 }, (_, offset) => index.ids[(boardIndex + offset) % index.ids.length]);
    return { geometry, distance: endArc - start.arc, stopIds,
      projectionErrorMeters: Math.max(start.error, finish.error) };
  }
  function rideGeometry(route, boardId, alightId) {
    return rideInfo(route, boardId, alightId)?.geometry || [];
  }

  function busCandidates(origin, destination, options = {}) {
    const a = coordinate(origin), b = coordinate(destination);
    if (!a || !b || distanceMeters(a, b) < 75) return [];
    const stops = stopData(), routes = root.LEHIGH_TRANSIT_DATA?.routes || [];
    const maxWalk = options.maxWalkMeters ?? 1400;
    const dayKey = options.dateKey || root.LEHIGH_SCHEDULES?.getEasternDate?.();
    const compareCandidates = (a, b) => options.preferNearestStops
      ? a.approachDistanceMeters - b.approachDistanceMeters || a.egressDistanceMeters - b.egressDistanceMeters
        || a.estimatedDurationSeconds - b.estimatedDurationSeconds
      : a.estimatedDurationSeconds - b.estimatedDurationSeconds;
    const result = [];
    for (const route of routes) {
      const schedule = root.LEHIGH_SCHEDULES?.getDaySchedule?.(route.id, dayKey) || null;
      const serviceAvailable = !schedule || schedule.windows.length > 0;
      if (!serviceAvailable && !options.includeInactive) continue;
      const ids = (route.stops || []).map(String);
      const nearStart = ids.map(id => ({ id, distance: distanceMeters(a, stops[id]) })).filter(item => item.distance <= maxWalk && (!options.fixedBoardId || item.id === String(options.fixedBoardId)));
      const nearEnd = ids.map(id => ({ id, distance: distanceMeters(b, stops[id]) })).filter(item => item.distance <= maxWalk && (!options.fixedAlightId || item.id === String(options.fixedAlightId)));
      let best = null;
      for (const board of nearStart) for (const alight of nearEnd) {
        const ride = rideInfo(route, board.id, alight.id);
        if (!ride || ride.distance < 100 || ride.projectionErrorMeters > 220) continue;
        // A transit option must actually replace part of the journey, rather
        // than add a token bus ride followed by virtually the entire walk.
        if (board.distance + alight.distance > distanceMeters(a, b) - 100) continue;
        // Ranking estimates only. Actual walking legs are fetched separately;
        // no straight line is exposed as a navigable walking path.
        const rideDuration = ride.distance / 6.0 + Math.max(0, ride.stopIds.length - 2) * 20;
        const approachDuration = board.distance; // 1.25 detour factor / 1.25 m/s
        const egressDuration = alight.distance;
        const estimatedDuration = approachDuration + egressDuration + rideDuration;
        const candidate = {
          id: `${route.id}:${board.id}:${alight.id}`,
          mode: 'transit', route, boardId: board.id, alightId: alight.id,
          board: stops[board.id], alight: stops[alight.id],
          stops: ride.stopIds.map(id => stops[id]), stopCount: ride.stopIds.length - 1,
          rideGeometry: ride.geometry, rideDistanceMeters: ride.distance,
          rideDurationSeconds: rideDuration,
          approachDistanceMeters: board.distance, egressDistanceMeters: alight.distance,
          estimatedDurationSeconds: estimatedDuration,
          schedule, serviceAvailable, estimationOnly: true,
          walkingDistanceIsStraightLine: true,
          excludesWaitingTime: true,
          estimateModel: { busMetersPerSecond: 6, intermediateStopSeconds: 20,
            walkingDetourFactor: 1.25, walkingMetersPerSecond: 1.25 },
          projectionErrorMeters: ride.projectionErrorMeters
        };
        if (!best || compareCandidates(candidate, best) < 0) best = candidate;
      }
      if (best) result.push(best);
    }
    return result.sort((a, b) => Number(b.serviceAvailable) - Number(a.serviceAvailable) || compareCandidates(a, b))
      .slice(0, options.limit ?? 4);
  }

  function abortError() {
    return typeof DOMException !== 'undefined' ? new DOMException('Journey request canceled', 'AbortError')
      : Object.assign(new Error('Journey request canceled'), { name: 'AbortError' });
  }
  function throwIfAborted(signal) { if (signal?.aborted) throw abortError(); }
  function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      throwIfAborted(signal);
      const done = () => { signal?.removeEventListener('abort', cancel); resolve(); };
      const timer = setTimeout(done, ms);
      const cancel = () => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(abortError()); };
      signal?.addEventListener('abort', cancel, { once: true });
    });
  }
  function instructionFor(step) {
    const maneuver = step.maneuver || {};
    const road = step.name ? ` onto ${step.name}` : '';
    const turn = maneuver.modifier || 'straight';
    if (maneuver.type === 'depart') return step.name ? `Start on ${step.name}` : 'Start along the route';
    if (maneuver.type === 'arrive') return 'Arrive at your destination';
    if (maneuver.type === 'roundabout' || maneuver.type === 'rotary') return `Take the roundabout${maneuver.exit ? `, exit ${maneuver.exit}` : ''}${road}`;
    if (maneuver.type === 'turn' || maneuver.type === 'end of road') return `Turn ${turn}${road}`;
    if (maneuver.type === 'fork') return `Keep ${turn}${road}`;
    if (maneuver.type === 'merge') return `Merge${road}`;
    return `Continue${road}`;
  }
  function normalizeRoute(json, mode, a, b) {
    if (json?.code !== 'Ok' || !json.routes?.length) return { available: false, mode, reason: 'no-route', providerCode: json?.code || 'InvalidResponse' };
    const route = json.routes[0];
    const geometry = route.geometry?.coordinates?.map(point => coordinate([point[1], point[0]]));
    if (!geometry || geometry.length < 2 || geometry.some(point => !point) || !Number.isFinite(route.distance) || !Number.isFinite(route.duration)) {
      return { available: false, mode, reason: 'invalid-response' };
    }
    const steps = (route.legs || []).flatMap(leg => (leg.steps || []).map(step => ({
      instruction: instructionFor(step), name: step.name || '', ref: step.ref || '',
      destinations: step.destinations || '', distanceMeters: step.distance || 0,
      durationSeconds: step.duration || 0, maneuver: { ...(step.maneuver || {}) },
      location: step.maneuver?.location ? [step.maneuver.location[1], step.maneuver.location[0]] : null,
      geometry: step.geometry?.coordinates?.map(point => [point[1], point[0]]) || []
    })));
    const waypoints = (json.waypoints || []).map(point => ({
      name: point.name || '', distanceMeters: point.distance || 0,
      location: point.location ? [point.location[1], point.location[0]] : null
    }));
    return { available: true, mode, distanceMeters: route.distance, durationSeconds: route.duration,
      geometry, steps, waypoints, origin: a, destination: b,
      source: 'https://routing.openstreetmap.de/', provider: 'FOSSGIS OSRM / OpenStreetMap',
      estimated: true, excludesTraffic: mode === 'drive',
      attributionUrl: 'https://www.openstreetmap.org/copyright',
      fixMapUrl: 'https://www.openstreetmap.org/fixthemap',
      snapDistanceMeters: waypoints.map(point => point.distanceMeters) };
  }
  function cacheKey(mode, a, b) { return `${mode}:${a.map(n => n.toFixed(6)).join(',')}:${b.map(n => n.toFixed(6)).join(',')}`; }
  function cacheGet(key) {
    const found = routeCache.get(key);
    if (!found) return null;
    if (Date.now() - found.at > CACHE_TTL_MS) { routeCache.delete(key); return null; }
    return found.value;
  }
  function cachePut(key, value) {
    if (!value.available && value.reason !== 'no-route') return;
    routeCache.set(key, { at: Date.now(), value });
    while (routeCache.size > MAX_CACHE) routeCache.delete(routeCache.keys().next().value);
  }
  function networkRoute(mode, origin, destination, signal) {
    const a = coordinate(origin), b = coordinate(destination);
    throwIfAborted(signal);
    if (!a || !b) return Promise.resolve({ available: false, mode, reason: 'invalid-coordinates' });
    const key = cacheKey(mode, a, b), cached = cacheGet(key);
    if (cached) return Promise.resolve(cached);
    const operation = async () => {
      throwIfAborted(signal);
      const anotherCached = cacheGet(key);
      if (anotherCached) return anotherCached;
      await sleep(Math.max(0, REQUEST_GAP_MS - (Date.now() - lastRequestAt)), signal);
      throwIfAborted(signal);
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal?.addEventListener('abort', cancel, { once: true });
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
      const service = mode === 'drive' ? 'routed-car/route/v1/driving' : 'routed-foot/route/v1/foot';
      const url = `https://routing.openstreetmap.de/${service}/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson&steps=true`;
      try {
        lastRequestAt = Date.now();
        const response = await root.fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
        throwIfAborted(signal);
        if (!response.ok) {
          // OSRM uses HTTP 400 for NoRoute/NoSegment as well as query errors.
          let errorJson;
          try { errorJson = await response.json(); } catch (_) { /* Report HTTP failure below. */ }
          if (errorJson && ['NoRoute', 'NoSegment'].includes(errorJson.code)) {
            const value = { available: false, mode, reason: 'no-route', providerCode: errorJson.code };
            cachePut(key, value); return value;
          }
          return { available: false, mode, reason: response.status === 429 ? 'rate-limited' : 'network', status: response.status };
        }
        const value = normalizeRoute(await response.json(), mode, a, b);
        cachePut(key, value);
        return value;
      } catch (error) {
        throwIfAborted(signal);
        return { available: false, mode, reason: timedOut ? 'timeout' : 'network' };
      } finally {
        clearTimeout(timer); signal?.removeEventListener('abort', cancel);
      }
    };
    const result = requestTail.then(operation);
    requestTail = result.catch(() => undefined);
    return result;
  }
  function walkRoute(a, b, signal) { return networkRoute('walk', a, b, signal); }
  function driveRoute(a, b, signal) { return networkRoute('drive', a, b, signal); }

  root.JourneyEngine = { distanceMeters, busCandidates, rideGeometry, walkRoute, driveRoute,
    attribution: { label: 'Routing © OpenStreetMap contributors · FOSSGIS OSRM',
      url: 'https://routing.openstreetmap.de/about.html', fixMapUrl: 'https://www.openstreetmap.org/fixthemap' } };
})(typeof window !== 'undefined' ? window : globalThis);
