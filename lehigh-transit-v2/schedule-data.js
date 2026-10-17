/* Published service hours, not live vehicle availability.
 * Source: https://auxiliaryservices.lehigh.edu/transit-route-information
 * Checked 2026-10-17. All service-day boundaries use America/New_York.
 */
(function () {
  'use strict';

  const TIME_ZONE = 'America/New_York';
  const windowOf = (start, end, headway, extra = {}) => ({
    start, end, endDayOffset: end <= start ? 1 : 0, headway, ...extra
  });
  const week = (weekday, weekend) => [weekend, weekday, weekday, weekday, weekday, weekday, weekend];
  const packerWeekday = [windowOf('06:45', '02:30', 20)];
  const packerWeekend = [windowOf('10:00', '02:30', 18)];
  const goodmanWeekday = [windowOf('06:50', '20:20', 30)];
  const mountaintopWeekday = [
    windowOf('06:45', '20:15', 30, { vehicle: 1 }),
    windowOf('07:00', '19:30', 30, { vehicle: 2 })
  ];
  const campusWeekday = [windowOf('19:30', '00:00', null, {
    headwayPeriods: [{ start: '19:30', end: '23:00', headway: 30 }],
    noteKey: 'lateHeadwayUnspecified',
    vehicles: [
      { start: '19:30', end: '00:00', endDayOffset: 1 },
      { start: '19:30', end: '23:00', endDayOffset: 0 }
    ]
  })];
  const campusWeekend = [windowOf('10:00', '00:00', 60)];

  const routes = {
    'packer-express': {
      weekly: week(packerWeekday, packerWeekend),
      limitedWeekly: week([], [])
    },
    'mountaintop-connector': {
      weekly: week(mountaintopWeekday, []),
      limitedWeekly: week([windowOf('06:45', '20:15', 30)], []),
      noteKey: 'weekendNotListed'
    },
    'goodman-connector': {
      weekly: week(goodmanWeekday, []),
      limitedWeekly: week(goodmanWeekday, []),
      noteKey: 'weekendNotListed'
    },
    'campus-connector': {
      weekly: week(campusWeekday, campusWeekend),
      limitedWeekly: week([windowOf('19:30', '23:00', 60)], [windowOf('10:00', '23:00', 60)])
    }
  };

  const limitedRanges = [
    ['2026-10-12', '2026-10-12'],
    ['2026-11-25', '2026-11-25'],
    ['2026-11-28', '2026-11-29'],
    ['2026-12-17', '2026-12-23'],
    ['2026-12-26', '2026-12-30'],
    ['2027-01-02', '2027-01-24'],
    ['2027-03-13', '2027-03-21']
  ];
  const noServiceDates = [
    '2026-07-03', '2026-11-26', '2026-11-27', '2026-12-31',
    '2027-01-01', '2027-03-28', '2027-05-31'
  ];

  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  function easternParts(value = new Date()) {
    const pieces = {};
    dateFormatter.formatToParts(value).forEach(part => { pieces[part.type] = part.value; });
    return {
      dateKey: `${pieces.year}-${pieces.month}-${pieces.day}`,
      minuteOfDay: Number(pieces.hour) * 60 + Number(pieces.minute)
    };
  }
  function shiftDate(dateKey, amount) {
    const date = new Date(`${dateKey}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + amount);
    return date.toISOString().slice(0, 10);
  }
  function weekdayOf(dateKey) {
    return new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  }
  function getDaySchedule(routeId, dateKey = easternParts().dateKey) {
    const route = routes[routeId];
    if (!route) return { dateKey, weekday: weekdayOf(dateKey), windows: [], kind: 'unknown' };
    const weekday = weekdayOf(dateKey);
    const kind = noServiceDates.includes(dateKey) ? 'no-service'
      : limitedRanges.some(([start, end]) => dateKey >= start && dateKey <= end) ? 'limited' : 'regular';
    return {
      dateKey, weekday, kind,
      windows: kind === 'no-service' ? []
        : (kind === 'limited' ? route.limitedWeekly : route.weekly)[weekday]
    };
  }
  function getEasternDate(value = new Date()) {
    return easternParts(value).dateKey;
  }

  window.LEHIGH_SCHEDULES = {
    timeZone: TIME_ZONE,
    sourceUrl: 'https://auxiliaryservices.lehigh.edu/transit-route-information',
    effectiveLabel: 'Fall 2026',
    verifiedOn: '2026-10-17',
    routes, limitedRanges, noServiceDates,
    notes: {
      lateHeadwayUnspecified: {
        en: 'Every 30 minutes until 11 PM; later departures are not specified.',
        zh: '晚 11 点前每 30 分钟一班；之后的班次间隔官网未注明。'
      },
      weekendNotListed: {
        en: 'No weekend service is listed in the published Fall 2026 schedule.',
        zh: '官网秋季时刻表未列出该线路的周末班次。'
      },
      overnight: {
        en: 'After-midnight hours belong to the service day on which the route starts.',
        zh: '跨午夜班次归属于开始运营的当天。'
      },
      sourceAmbiguities: [
        'Christmas row says December 24–25, 2025 but names weekdays matching 2026; excluded pending clarification.',
        'May 20–June 30, 2027 limited-service row labels June 30 as Tuesday, but it is Wednesday; excluded pending clarification.',
        'No transition-specific rule is published for overnight service entering a no-service date; scheduled overnight windows retain their start service date.'
      ]
    },
    easternParts, shiftDate, weekdayOf, getDaySchedule, getEasternDate
  };
})();
