/* Typed place search, browser geolocation, and coordinate-to-coordinate directions.
 * Campus places: official Lehigh map. Search: Photon. Walking: FOSSGIS OSRM.
 * Device coordinates stay in memory; routing requests are sent only on a route search.
 */
'use strict';
const navigationCopy={
 en:{
  modeTransit:'Campus bus',modeWalk:'Walk',searchPowered:'Place search:',fixMap:'Fix the map',
  scopeNote:'Bethlehem + all Lehigh campuses',chooseStart:'My location, or enter a starting point',chooseEnd:'Where do you want to go?',myLocation:'My location',currentLocation:'Your location',locating:'Finding your location…',locationReady:'Your location is shown as a blue dot.',locationDenied:'Location is blocked. Allow location for this site in your browser, or enter your starting point.',locationFailed:'Your device could not determine a location. Try again or enter an address.',locationUnsupported:'This browser does not support location. Enter an address instead.',locationSecure:'Location requires localhost or a secure HTTPS site.',locationStartNeeded:'Allow location access, or enter a starting point.',accuracy:'Accuracy about {n} m',
  campusPlace:'Lehigh campus',stopPlace:'Campus bus stop',otherPlace:'Place or address',popularPlaces:'POPULAR AT LEHIGH',suggestedPlaces:'SUGGESTED PLACES',searchingPlaces:'Searching addresses…',noPlaces:'No local matches. Try a Lehigh building, residence hall or Bethlehem address.',searchUnavailable:'Address search is unavailable. Campus places and map selection still work.',selectSuggestion:'Select a suggested place to confirm its location.',pickMap:'Choose a point on the map',pickPrompt:'Click anywhere on the map to set {field}.',mapPoint:'Map point',originWord:'the starting point',destinationWord:'the destination',
  findingRoute:'Finding a route…',loadingConnections:'Calculating walking connections…',routeUnavailable:'A route could not be calculated. Try another mode or open Google Maps.',noTransit:'No scheduled campus bus connects these locations today. Showing a walking route.',sameLocation:'The starting point and destination are the same.',
  directionsTitle:'DIRECTIONS',journeyBack:'Back to campus routes',walkOnly:'Walking route',busOption:'Walk + {route}',walkTo:'Walk to {place}',rideTo:'Take {route} to {place}',walkFinish:'Walk to {place}',boardAt:'Board at',alightAt:'Get off at',minutes:'{n} min',hours:'{n} hr',distanceKm:'{n} km',distanceM:'{n} m',estimated:'Estimated',noWait:'Travel estimate only · bus waiting time excluded',busEstimate:'Bus duration is estimated from route distance; not a live arrival prediction.',connectionsUnavailable:'Walking connections could not be verified. No walking path is drawn for unavailable segments.',walkDistance:'Walking',rideDistance:'On the bus',routeDetails:'Route details',steps:'Directions',openGoogle:'Open in Google Maps ↗',routeSources:'Routes: © OpenStreetMap contributors · FOSSGIS OSRM',originLabel:'Start',destinationLabel:'Destination',startFrom:'Depart from {place}',arriveAt:'Arrive at {place}',continueOn:'Continue on {road}',turnOn:'{turn} onto {road}',road:'the path',left:'Turn left',right:'Turn right',straight:'Continue straight',slightLeft:'Bear left',slightRight:'Bear right',sharpLeft:'Turn sharply left',sharpRight:'Turn sharply right',uturn:'Make a U-turn',roundabout:'At the roundabout, follow {road}',north:'north',stepDistance:'{distance}',noLive:'Published schedule · check live buses before leaving',useLocationHint:'Use your location or type an address',locationPrivacy:'Location stays on this page until you search a route. A route search sends its endpoints to the routing service.',
 },
 zh:{
  modeTransit:'校园公交',modeWalk:'步行',searchPowered:'地点搜索：',fixMap:'纠正地图',
  scopeNote:'搜索限 Bethlehem 与理海全部校区',chooseStart:'我的位置，或输入其他出发地',chooseEnd:'想去哪里？输入地点或地址',myLocation:'我的位置',currentLocation:'我的位置',locating:'正在获取你的位置…',locationReady:'蓝色圆点已显示你的位置。',locationDenied:'定位权限被关闭。请在浏览器中允许此网站定位，或手动输入起点。',locationFailed:'设备暂时无法确定位置，请重试或手动输入地址。',locationUnsupported:'当前浏览器不支持定位，请手动输入地址。',locationSecure:'定位需要本机预览地址或 HTTPS 网站。',locationStartNeeded:'请允许定位，或手动输入出发地。',accuracy:'定位精度约 {n} 米',
  campusPlace:'理海校园地点',stopPlace:'校园公交站',otherPlace:'地点或地址',popularPlaces:'理海常用地点',suggestedPlaces:'可能想找的地点',searchingPlaces:'正在搜索地址…',noPlaces:'本地范围内没有匹配结果，请尝试理海建筑、宿舍名或 Bethlehem 地址。',searchUnavailable:'地址搜索暂不可用，仍可搜索校园地点或在地图上选点。',selectSuggestion:'请从搜索建议中选定地点，确认具体位置。',pickMap:'在地图上选择位置',pickPrompt:'请在地图上点击，设置{field}。',mapPoint:'地图选点',originWord:'出发地',destinationWord:'目的地',
  findingRoute:'正在规划路线…',loadingConnections:'正在计算步行接驳…',routeUnavailable:'暂时无法计算路线，可切换出行方式，或在 Google Maps 中打开。',noTransit:'今天没有覆盖这两个地点的计划校园公交，先展示步行路线。',sameLocation:'起点与终点是同一位置，请选择不同地点。',
  directionsTitle:'出行方案',journeyBack:'返回校园线路',walkOnly:'全程步行',busOption:'步行 + {route}',walkTo:'步行至 {place}',rideTo:'乘坐 {route} 至 {place}',walkFinish:'步行至 {place}',boardAt:'上车站',alightAt:'下车站',minutes:'{n} 分钟',hours:'{n} 小时',distanceKm:'{n} 公里',distanceM:'{n} 米',estimated:'预计',noWait:'仅估算路程用时 · 不含公交等车时间',busEstimate:'公交乘车用时按线路距离估算，不是实时到站预测。',connectionsUnavailable:'部分步行接驳暂时无法验证，对应路段未绘制步行路径。',walkDistance:'步行',rideDistance:'乘车',routeDetails:'路线详情',steps:'分步路线',openGoogle:'在 Google Maps 中打开 ↗',routeSources:'路线：© OpenStreetMap contributors · FOSSGIS OSRM',originLabel:'起点',destinationLabel:'终点',startFrom:'从 {place} 出发',arriveAt:'到达 {place}',continueOn:'沿 {road} 继续前行',turnOn:'{turn}，进入 {road}',road:'当前道路',left:'左转',right:'右转',straight:'直行',slightLeft:'向左前方',slightRight:'向右前方',sharpLeft:'向左急转',sharpRight:'向右急转',uturn:'掉头',roundabout:'在环岛沿 {road} 行驶',north:'北',stepDistance:'{distance}',noLive:'按公布时刻表规划 · 出发前请查看实时车辆',useLocationHint:'使用我的位置，或输入出发地址',locationPrivacy:'定位会先保留在当前页面；查询路线时会将起终点发送至路线服务。',
 }
};
Object.assign(copy.en,navigationCopy.en);Object.assign(copy.zh,navigationCopy.zh);
Object.assign(copy.en,{locationPermissionDenied:'Location access is disabled for this site. Enable it in browser site settings, or enter a starting point.',locationBrowserBlocked:'Your browser did not grant location access. Try the location button, or enter a starting point.',locationPolicyBlocked:'This page’s permissions policy does not allow location. Open the website directly, or enter a starting point.',locationTimeout:'Location took too long. Try again, or enter a starting point.',routeAlternatives:'Other routes',approxDuration:'Approximate travel time'});
Object.assign(copy.zh,{locationPermissionDenied:'此网站目前没有定位权限。可在浏览器网站设置中允许定位，或手动输入起点。',locationBrowserBlocked:'浏览器未授予定位访问。可点击定位按钮重试，或手动输入起点。',locationPolicyBlocked:'当前页面的策略不允许定位。请直接打开网站，或手动输入起点。',locationTimeout:'获取位置超时，请重试或手动输入起点。',routeAlternatives:'其他方案',approxDuration:'预计路程用时'});
const navState={plannerExpanded:false,resultMode:false,searchIntent:0,locationMessageVersion:0,endpoints:{start:null,end:null},mode:'transit',location:null,locationAccuracy:null,locationTime:null,locationIssue:null,watch:null,fields:{},endpointVersion:{start:0,end:0},request:null,version:0,options:[],selected:0,busy:false,error:null,note:null,bounds:null,picking:null,locationMessage:null,locationRequest:null};
const deviceLocation={started:false,paused:false,lifecycleVersion:0,interactionVersion:0,requestVersion:0,watchVersion:0,permissionVersion:0,permission:'unknown',blocked:false,cancelRequest:null,resume:null,fixVersion:0};
let journeyLayers,endpointLayers,userLayers,liveArrivals;
const boardingCopy={
 en:{title:'YOUR BOARDING STOP',near:'Closest usable stop for this route',fromStart:'From your starting point',next:'NEXT BUS',refresh:'Refresh arrival',source:'Live estimate · Passio GO · updates every 20s',fresh:'Updated {n}s ago',noWait:'Travel time above excludes this wait',noTransitNow:'No campus bus connecting these places is operating now. Showing a walking route.'},
 zh:{title:'在这里上车',near:'这条线路距起点最近的可用上车站',fromStart:'从出发地前往',next:'下一班到站',refresh:'刷新到站时间',source:'Passio GO 实时预测 · 每 20 秒更新',fresh:'{n} 秒前更新',noWait:'上方路程用时不含这里的等车时间',noTransitNow:'目前没有运营中的校园公交连接这两个地点，先展示步行路线。'},
 es:{title:'TU PARADA DE SALIDA',near:'La parada utilizable más cercana de esta ruta',fromStart:'Desde el origen',next:'PRÓXIMO AUTOBÚS',refresh:'Actualizar llegada',source:'Estimación de Passio GO · cada 20 s',fresh:'Actualizado hace {n} s',noWait:'El tiempo anterior no incluye esta espera',noTransitNow:'Ahora no opera un autobús entre estos lugares. Se muestra una ruta a pie.'}
};
function boardingText(key,vars={}){return (boardingCopy[language]||boardingCopy.en)[key].replace(/\{(\w+)\}/g,(_,name)=>vars[name]??'');}
function boardingSelection(candidate){return{routeId:String(candidate.route.passioId),stopId:String(candidate.boardId||candidate.board.id),position:candidate.route.stopPositions?.[candidate.boardId||candidate.board.id]};}
function arrivalMatches(status,candidate){const wanted=boardingSelection(candidate);return status?.selection?.routeId===wanted.routeId&&status.selection.stopId===wanted.stopId&&status.selection.position===(wanted.position??null);}
function updateBoardingArrival(status=liveArrivals?.getSnapshot()){
 const card=$('boarding-arrival'),option=navState.options[navState.selected];
 if(!card||option?.kind!=='bus'||!arrivalMatches(status,option.candidate))return;
 const value=$('boarding-arrival-value'),meta=$('boarding-arrival-meta'),button=$('arrival-refresh');
 const label=status.label||status.message||'';if(value&&value.textContent!==label)value.textContent=label;
 const age=status.receivedAt?Math.max(0,Math.floor((Date.now()-status.receivedAt)/1000)):null;
 const detail=boardingText('source')+(age===null?'':' · '+boardingText('fresh',{n:age}));
 if(meta&&meta.textContent!==detail)meta.textContent=detail;
 card.dataset.state=status.state;card.setAttribute('aria-busy',String(status.state==='loading'));
 if(button){button.disabled=status.state==='loading';button.title=boardingText('refresh');button.setAttribute('aria-label',boardingText('refresh'));}
}
function boardingHTML(option){
 const c=option.candidate,a=option.approach,status=liveArrivals?.getSnapshot();
 const walking=a?.available?formatDistance(a.distanceMeters)+' · '+formatDuration(a.durationSeconds):boardingText('fromStart');
 const label=arrivalMatches(status,c)?status.label:(language==='zh'?'正在查询下一班公交…':language==='es'?'Consultando el próximo autobús…':'Checking the next bus…');
 return '<section id="boarding-arrival" class="boarding-arrival" aria-label="'+escapeHTML(boardingText('title'))+'"><p class="boarding-eyebrow">'+escapeHTML(boardingText('title'))+'</p><strong class="boarding-stop-name">'+escapeHTML(stopName(c.boardId||c.board.id))+'</strong><p class="boarding-walk">'+escapeHTML(boardingText('near'))+' · '+escapeHTML(walking)+'</p><div class="boarding-arrival-row"><div><span>'+escapeHTML(boardingText('next'))+'</span><strong id="boarding-arrival-value" role="status" aria-live="polite">'+escapeHTML(label)+'</strong></div><button id="arrival-refresh" type="button" aria-label="'+escapeHTML(boardingText('refresh'))+'">↻</button></div><small id="boarding-arrival-meta">'+escapeHTML(boardingText('source'))+'</small><small class="boarding-wait-note">'+escapeHTML(boardingText('noWait'))+'</small></section>';
}
const placeCache=new Map();
const normalized=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const campusPlaces=window.LEHIGH_PLACES||[];
const stopPlaces=Object.values(transitData.stops).map(s=>({...s,id:'stop-'+s.id,name:s.name,aliases:[],address:'Lehigh University',type:'stop'}));
function placeName(place){return place?.type==='location'?t('currentLocation'):place?.type==='map'?t('mapPoint')+' · '+place.lat.toFixed(5)+', '+place.lng.toFixed(5):place?.name||'';}
// Small spelling mistakes (including one swapped letter) still find campus buildings.
function spellingDistance(a,b){
 const rows=Array.from({length:a.length+1},()=>new Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)rows[i][0]=i;for(let j=0;j<=b.length;j++)rows[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])rows[i][j]=Math.min(rows[i][j],rows[i-2][j-2]+1);
 }
 return rows[a.length][b.length];
}
const genericPlaceWords=new Set(['house','hall','dorm','dorms','dormitory','residence','residential','building','library','the','lehigh','university']);
function localPlaceMatches(query){
 const q=normalized(query),fuzzyQuery=q.replace(/([a-z]{4,})(house|hall|dormitory|dorm|library)$/,'$1 $2'),terms=fuzzyQuery.split(' ').filter(Boolean),significant=terms.filter(term=>!genericPlaceWords.has(term));
 const saved=(window.LeHighCampusExtras?.store.list()||[]).map(p=>{const canonical=campusPlaces.find(c=>normalized(c.name)===normalized(p.name)&&Math.abs(c.lat-p.lat)<.0001&&Math.abs(c.lng-p.lng)<.0001);return{...canonical,...p,aliases:canonical?.aliases||[],abbreviations:canonical?.abbreviations||[],saved:true};});
 if(!q)return [...saved,...campusPlaces].filter((p,i,a)=>a.findIndex(q=>normalized(q.name)===normalized(p.name))===i).slice(0,7);
 const score=p=>{
  const names=[p.name,...(p.aliases||[])].map(normalized);let rank=0;
  for(const name of names){
   if(name===q)rank=Math.max(rank,1000);
   else if(name.startsWith(q))rank=Math.max(rank,850);
   else if(name.includes(q))rank=Math.max(rank,750);
   else if(terms.every(term=>name.includes(term)))rank=Math.max(rank,650);
   else if(q.length>=4&&name.replace(/ /g,'')===q.replace(/ /g,''))rank=Math.max(rank,900);
   // Fuzzy matching stays local to official campus places and distinctive words.
   if(p.type==='campus'&&significant.length&&significant.every(term=>/^[a-z]{4,}$/.test(term))){
    const words=name.split(' ');let edits=0,valid=true;
    for(const term of significant){let best=Infinity;for(const word of words){if(Math.abs(term.length-word.length)>2)continue;best=Math.min(best,spellingDistance(term,word));}
     const max=term.length>=8?2:1;if(best>max){valid=false;break;}edits+=best;
    }
    if(valid){const genericHits=terms.filter(term=>genericPlaceWords.has(term)&&words.includes(term)).length;rank=Math.max(rank,580-edits*35+genericHits*4);}
   }
  }
  if(normalized(p.address).includes(q))rank=Math.max(rank,200);return rank;
 };
 return [...saved,...campusPlaces,...stopPlaces].filter((p,i,a)=>a.findIndex(q=>normalized(q.name)===normalized(p.name)&&Math.abs(q.lat-p.lat)<.0001&&Math.abs(q.lng-p.lng)<.0001)===i).map((p,i)=>({p,i,s:score(p)})).filter(r=>r.s>0).sort((a,b)=>b.s-a.s||(a.p.type==='stop')-(b.p.type==='stop')||a.i-b.i).slice(0,8).map(r=>r.p);
}
function coordinatePlace(text){const m=text.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[,，]\s*(-?\d{1,3}(?:\.\d+)?)$/);if(!m)return null;const lat=+m[1],lng=+m[2];return Math.abs(lat)<=90&&Math.abs(lng)<=180?{id:'coords-'+lat+','+lng,lat,lng,name:text.trim(),type:'map'}:null;}
async function remotePlaceMatches(query,signal){
 // Photon supports search-as-you-type without a key. Its public demo is for
 // reasonable project use: https://github.com/komoot/photon#demo-server .
 // https://github.com/komoot/photon/blob/master/docs/api-v1.md documents GeoJSON,
 // q, bbox, lon/lat, limit and lang. The public instance supports English names;
 // the surrounding UI and official-campus Chinese aliases remain bilingual.
 const canceled=()=>new DOMException('Place search canceled','AbortError');
 const ensureActive=()=>{if(signal?.aborted)throw canceled();};ensureActive();
 const cacheKey='photon-bethlehem-v1|en|'+normalized(query);
 if(placeCache.has(cacheKey))return placeCache.get(cacheKey);
 const queue=remotePlaceMatches.queue||(remotePlaceMatches.queue={tail:Promise.resolve(),lastStarted:0});
 const operation=async()=>{
  ensureActive();if(placeCache.has(cacheKey))return placeCache.get(cacheKey);
  const delay=Math.max(0,1050-(Date.now()-queue.lastStarted));
  if(delay)await new Promise((resolve,reject)=>{
   const finish=()=>{signal?.removeEventListener('abort',abort);resolve();};
   const timer=setTimeout(finish,delay);
   const abort=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);reject(canceled());};
   signal?.addEventListener('abort',abort,{once:true});
   if(signal?.aborted)abort();
  });
  ensureActive();
  const params=new URLSearchParams({q:query.trim(),bbox:window.LEHIGH_SEARCH_SCOPE.bbox.join(','),lon:'-75.377',lat:'40.607',lang:'en',limit:'5'});
  queue.lastStarted=Date.now();
  const response=await fetch('https://photon.komoot.io/api/?'+params,{signal,headers:{Accept:'application/json'}});
  ensureActive();if(!response.ok)throw new Error('search-unavailable');
  const data=await response.json();ensureActive();
  if(!Array.isArray(data.features))throw new Error('search-unavailable');
  const seen=new Set(),results=[];
  for(const feature of data.features){
   const coordinates=feature.geometry?.coordinates,properties=feature.properties||{};
   if(feature.geometry?.type!=='Point'||!Array.isArray(coordinates)||!Number.isFinite(coordinates[0])||!Number.isFinite(coordinates[1])||Math.abs(coordinates[0])>180||Math.abs(coordinates[1])>90)continue;
   const clean=value=>typeof value==='string'||typeof value==='number'?String(value).trim():'';
   const street=[clean(properties.housenumber),clean(properties.street)].filter(Boolean).join(' ');
   const name=clean(properties.name)||street||clean(properties.city)||clean(properties.district);if(!name)continue;
   const address=[street,clean(properties.district)||clean(properties.locality),clean(properties.city),clean(properties.postcode),clean(properties.state),clean(properties.country)].filter(Boolean).filter((part,index,parts)=>parts.findIndex(value=>normalized(value)===normalized(part))===index).join(', ');
   const osmId=properties.osm_id!=null?clean(properties.osm_type)+'-'+clean(properties.osm_id)+'-'+clean(properties.osm_key)+'-'+clean(properties.osm_value):coordinates.join(',')+'-'+name;
   const place={id:'photon-'+osmId,name,address,lat:coordinates[1],lng:coordinates[0],type:'place'};
   if(window.LEHIGH_SEARCH_SCOPE.contains(place)&&!seen.has(place.id)){seen.add(place.id);results.push(place);}
  }
  ensureActive();placeCache.set(cacheKey,results);
  while(placeCache.size>100)placeCache.delete(placeCache.keys().next().value);
  return results;
 };
 const pending=queue.tail.then(operation);queue.tail=pending.catch(()=>{});
 if(!signal)return pending;
 // Reject a canceled queued search immediately, without delaying the latest
 // input behind it; its eventual queue turn checks cancellation before fetch.
 return new Promise((resolve,reject)=>{
  const abort=()=>{signal.removeEventListener('abort',abort);reject(canceled());};
  signal.addEventListener('abort',abort,{once:true});
  pending.then(value=>{signal.removeEventListener('abort',abort);resolve(value);},error=>{signal.removeEventListener('abort',abort);reject(error);});
  if(signal.aborted)abort();
 });
}
function abbreviationHTML(place){const labels=Array.isArray(place.abbreviations)?place.abbreviations.filter(v=>typeof v==='string').slice(0,3):[];return labels.length?'<span class="place-abbreviations">'+labels.map(value=>'<span class="place-abbreviation">'+escapeHTML(value)+'</span>').join('')+'</span>':'';}
function specialSuggestions(field){return [...(field==='start'?[{type:'location',id:'device-location',name:t('currentLocation')}]:[]),{type:'pick',id:'pick-'+field,name:t('pickMap')}];}
function closeSuggestions(field){const f=navState.fields[field];if(!f)return;f.generation++;clearTimeout(f.timer);f.controller?.abort();f.pointerInteracting=false;f.pointerGesture=null;f.box.hidden=true;f.input.setAttribute('aria-expanded','false');f.input.removeAttribute('aria-activedescendant');f.index=-1;if(field==='end')$('search-form').classList.remove('search-open');}
function closeAllSuggestions(){for(const name of ['start','end'])closeSuggestions(name);}
function renderSuggestions(field,places,status=null){
 const f=navState.fields[field];if(document.activeElement!==f.input)return;
 f.items=[...specialSuggestions(field),...places];f.index=-1;f.box.replaceChildren();
 const heading=document.createElement('div');heading.className='suggestion-heading';heading.textContent=t(f.input.value.trim()?'suggestedPlaces':'popularPlaces');f.box.append(heading);
 f.items.forEach((place,index)=>{
  const row=document.createElement('div');row.id=field+'-option-'+index;row.className='suggestion-option';row.setAttribute('role','option');row.setAttribute('aria-selected','false');
  const meta=place.saved?t('searchSaved'):place.type==='location'?t('locationPrivacy'):place.type==='pick'?'':place.address||t(place.type==='campus'?'campusPlace':place.type==='stop'?'stopPlace':'otherPlace');
  row.innerHTML='<span class="place-symbol '+(place.type==='campus'?'campus-symbol':'')+'">'+(place.saved?'★':place.type==='location'?'◎':place.type==='pick'?'⊕':place.type==='stop'?'▣':place.type==='campus'?'▥':'⌖')+'</span><span><strong>'+escapeHTML(placeName(place)||place.name)+'</strong>'+abbreviationHTML(place)+'<small>'+escapeHTML(meta)+'</small></span>';
  row.addEventListener('pointerdown',event=>{
   f.pointerGesture={id:event.pointerId,x:event.clientX||0,y:event.clientY||0,moved:false,canceled:false};f.pointerInteracting=true;f.suppressClickUntil=0;
   if(event.pointerType==='mouse')event.preventDefault();
  });
  row.addEventListener('pointermove',event=>{const gesture=f.pointerGesture;if(gesture&&gesture.id===event.pointerId&&Math.hypot((event.clientX||0)-gesture.x,(event.clientY||0)-gesture.y)>8){gesture.moved=true;f.suppressClickUntil=Date.now()+500;}});
  row.addEventListener('pointercancel',()=>{if(f.pointerGesture)f.pointerGesture.canceled=true;f.pointerInteracting=false;f.suppressClickUntil=Date.now()+500;});
  row.addEventListener('pointerup',()=>{f.pointerInteracting=false;f.keepSuggestionsUntil=Date.now()+400;if(f.pointerGesture?.moved)f.suppressClickUntil=Date.now()+500;});
  row.addEventListener('click',event=>{
   const gesture=f.pointerGesture;if(gesture?.moved||gesture?.canceled||Date.now()<(f.suppressClickUntil||0)){event.preventDefault();return;}
   event.preventDefault();chooseSuggestion(field,place);
  });f.box.append(row);
 });
 if(status||!places.length){const note=document.createElement('p');note.className='suggestion-message';note.textContent=t(status||'noPlaces');f.box.append(note);}
 f.box.hidden=false;f.input.setAttribute('aria-expanded','true');if(field==='end')$('search-form').classList.add('search-open');
}
function updateSuggestions(field){
 const f=navState.fields[field];clearTimeout(f.timer);f.controller?.abort();const query=f.input.value.trim();const generation=++f.generation;
 const coords=coordinatePlace(query);const local=coords?[coords]:localPlaceMatches(query);renderSuggestions(field,local,query.length>=2&&!coords?'searchingPlaces':null);
 if(query.length<2||coords)return;
 f.timer=setTimeout(async()=>{
  const controller=new AbortController();f.controller=controller;const timeout=setTimeout(()=>controller.abort(),8000);
  try{const remote=await remotePlaceMatches(query,controller.signal);if(generation!==f.generation||document.activeElement!==f.input)return;
   const combined=[...local,...remote.filter(p=>!local.some(l=>normalized(l.name)===normalized(p.name)&&JourneyEngine.distanceMeters(l,p)<150))].slice(0,9);renderSuggestions(field,combined);
  }catch(error){if(generation===f.generation&&document.activeElement===f.input)renderSuggestions(field,local,'searchUnavailable');}finally{clearTimeout(timeout);}
 },450);
}
function chooseSuggestion(field,place){
 noteLocationInteraction();
 closeAllSuggestions();
 if(place.type==='location'){
  expandPlanner();navState.endpointVersion[field]++;navState.endpoints[field]=navState.location?{...navState.location,implicit:true,displayed:true}:null;navState.fields[field].input.value=navState.location?placeName(navState.location):'';navState.locationMessage=null;clearJourney();renderEndpoints();window.dispatchEvent(new CustomEvent('lehigh:endpoints-changed'));
  if(!navState.location)locateUser(false,field,false,{focusNext:false,implicit:true});return;
 }
 if(place.type==='pick'){expandPlanner();clearJourney();navState.picking=field;$('map').classList.add('picking-location');showLocationMessage('pickPrompt',{field:t(field==='start'?'originWord':'destinationWord')});return;}
 acceptSearchedPlace(field,place);
}
function updatePlannerChrome(){
 const form=$('search-form');form.classList.toggle('compact',!navState.plannerExpanded);form.classList.toggle('directions',navState.plannerExpanded&&!navState.resultMode);form.classList.toggle('route-results',navState.resultMode);
 document.querySelector('.app-shell')?.classList.toggle('planning',navState.plannerExpanded);
 $('end-stop').placeholder=t(navState.plannerExpanded?'chooseEnd':'whereTo');
}
function expandPlanner(){const wasResults=navState.resultMode;navState.plannerExpanded=true;navState.resultMode=false;if(wasResults)clearJourney();else updatePlannerChrome();}
function collapsePlanner({resetView=true}={}){
 noteLocationInteraction();
 cancelMapPick();closeAllSuggestions();navState.plannerExpanded=false;navState.resultMode=false;navState.locationMessageVersion++;
 navState.endpointVersion.start++;navState.endpointVersion.end++;navState.endpoints={start:null,end:null};
 $('start-stop').value='';$('end-stop').value='';navState.locationMessage=null;const status=$('location-status');if(status)status.hidden=true;
 clearJourney();clearRouteSelection();renderEndpoints();updatePlannerChrome();setDrawer(false);window.LeHighCampusExtras?.closePanels();map.closePopup?.();if(resetView)window.LeHighCampusExtras?.showCampuses?.();window.dispatchEvent(new CustomEvent('lehigh:endpoints-changed'));
}
function acceptSearchedPlace(field,place){
 noteLocationInteraction();
 expandPlanner();window.LeHighCampusExtras?.closePanels();setEndpoint(field,place,{focusNext:false});
 if(field==='end'&&!navState.endpoints.start&&!navState.fields.start.input.value.trim()&&navState.location){navState.endpoints.start={...navState.location,implicit:true,displayed:true};navState.fields.start.input.value=placeName(navState.endpoints.start);}
 if(field==='start'&&!navState.endpoints.end)navState.fields.end.input.focus();
}
function dismissSuggestions(){const open=['start','end'].some(field=>navState.fields[field]&&!navState.fields[field].box.hidden);if(open)closeAllSuggestions();return open;}
function cancelMapPick(){if(!navState.picking)return;navState.picking=null;$('map').classList.remove('picking-location');navState.locationMessage=null;const status=$('location-status');if(status)status.hidden=true;}
function setEndpoint(field,place,{focusNext=true}={}){
 cancelMapPick();navState.endpointVersion[field]++;
 if(field==='start'&&place.type!=='location'){navState.locationMessageVersion++;navState.locationMessage=null;const status=$('location-status');if(status)status.hidden=true;}
 navState.endpoints[field]={...place};navState.fields[field].input.value=placeName(place);closeAllSuggestions();clearJourney();renderEndpoints();
 window.dispatchEvent(new CustomEvent('lehigh:place-selected',{detail:{field,place:{...place}}}));
 if(focusNext&&field==='start'&&!navState.endpoints.end)navState.fields.end.input.focus();
}
function renderEndpoints(){
 if(!endpointLayers)return;endpointLayers.clearLayers();
 for(const [field,place] of Object.entries(navState.endpoints)){
  if(!place||place.type==='location')continue;
  const icon=L.divIcon({className:'journey-endpoint '+field,html:'<span><b>'+(field==='start'?'A':'B')+'</b></span>',iconSize:[26,32],iconAnchor:[13,30]});
  L.marker([place.lat,place.lng],{icon,title:placeName(place)}).addTo(endpointLayers).bindPopup('<strong>'+t(field==='start'?'originLabel':'destinationLabel')+'</strong><br>'+escapeHTML(placeName(place)));
 }
}
function invalidateInput(field){noteLocationInteraction();cancelMapPick();navState.endpointVersion[field]++;if(field==='start'){navState.locationMessageVersion++;navState.locationMessage=null;}navState.endpoints[field]=null;clearJourney();renderEndpoints();updateSuggestions(field);window.dispatchEvent(new CustomEvent('lehigh:endpoints-changed'));}
function focusOption(field,index){const f=navState.fields[field];if(!f.items.length)return;f.index=(index+f.items.length)%f.items.length;Array.from(f.box.querySelectorAll('[role="option"]')).forEach((el,i)=>{el.classList.toggle('highlighted',i===f.index);el.setAttribute('aria-selected',String(i===f.index));});const el=$(field+'-option-'+f.index);f.input.setAttribute('aria-activedescendant',el.id);el.scrollIntoView({block:'nearest'});}
function translateNavigation(){
 for(const field of ['start','end']){const f=navState.fields[field];if(!f)continue;f.input.placeholder=t(field==='start'?'chooseStart':'chooseEnd');if(navState.endpoints[field]&&(!navState.endpoints[field].implicit||navState.endpoints[field].displayed))f.input.value=placeName(navState.endpoints[field]);closeSuggestions(field);}
 document.querySelector('.travel-modes').setAttribute('aria-label',language==='zh'?'出行方式':language==='es'?'Modo de viaje':'Travel mode');
 document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===navState.mode)));
 if(navState.locationMessage){const vars=navState.locationMessage.key==='pickPrompt'&&navState.picking?{field:t(navState.picking==='start'?'originWord':'destinationWord')}:navState.locationMessage.vars;showLocationMessage(navState.locationMessage.key,vars);}
 liveArrivals?.translate();if(navState.location)drawUserLocation();renderEndpoints();renderJourney();updatePlannerChrome();
}
function showLocationMessage(key,vars={}){
 const old=$('location-status');if(old){old.hidden=true;old.textContent='';}
 if(key==='locationReady'){if(navState.picking)return;navState.locationMessage=null;}
 else navState.locationMessage={key,vars};
 renderJourney();
}
function drawUserLocation(){
 if(!userLayers)return;userLayers.clearLayers();const p=navState.location;if(!p)return;
 L.circle([p.lat,p.lng],{radius:navState.locationAccuracy||15,color:'#3984ee',weight:1,fillColor:'#3984ee',fillOpacity:.08}).addTo(userLayers);
 const icon=L.divIcon({className:'user-position',html:'<span></span>',iconSize:[18,18],iconAnchor:[9,9]});
 L.marker([p.lat,p.lng],{icon,title:t('currentLocation'),zIndexOffset:1000}).addTo(userLayers).bindPopup('<strong>'+t('currentLocation')+'</strong><br>'+t('accuracy',{n:Math.round(navState.locationAccuracy||0)}));
 $('locate-me')?.classList.add('has-location');
}
function locationPolicyBlocked(){
 try{const policy=document.permissionsPolicy||document.featurePolicy;return typeof policy?.allowsFeature==='function'&&policy.allowsFeature('geolocation')===false;}catch(_){return false;}
}
function readLocationPermission(){
 const version=++deviceLocation.permissionVersion;
 const remember=state=>{if(version===deviceLocation.permissionVersion)deviceLocation.permission=state;return state;};
 try{if(typeof navigator.permissions?.query!=='function')return Promise.resolve(remember('unknown'));return Promise.resolve(navigator.permissions.query({name:'geolocation'})).then(permission=>remember(['granted','denied','prompt'].includes(permission?.state)?permission.state:'unknown'),()=>remember('unknown'));}catch(_){return Promise.resolve(remember('unknown'));}
}
function locationFailureKey(error,permission){
 if(locationPolicyBlocked())return 'locationPolicyBlocked';
 if(error?.code===1)return permission==='denied'?'locationPermissionDenied':'locationBrowserBlocked';
 return error?.code===3?'locationTimeout':'locationFailed';
}
function noteLocationInteraction(){deviceLocation.interactionVersion++;}
function stopLocationWatch(){
 deviceLocation.watchVersion++;
 if(navState.watch!==null){try{navigator.geolocation.clearWatch(navState.watch);}catch(_){}navState.watch=null;}
}
function startLocationWatch(){
 if(deviceLocation.paused||deviceLocation.blocked||navState.watch!==null||!window.isSecureContext||!navigator.geolocation||locationPolicyBlocked())return;
 const version=++deviceLocation.watchVersion;
 const current=()=>version===deviceLocation.watchVersion&&!deviceLocation.paused;
 const failure=error=>{
  if(!current())return;
  if(error?.code===1){deviceLocation.blocked=true;stopLocationWatch();}
  const reportVersion=deviceLocation.watchVersion;
  const report=permission=>{if(deviceLocation.paused||(error?.code===1?(!deviceLocation.blocked||reportVersion!==deviceLocation.watchVersion):!current()))return;navState.locationIssue=locationFailureKey(error,permission);if(navState.plannerExpanded&&navState.endpoints.start?.type==='location')showLocationMessage(navState.locationIssue);};
  if(error?.code===1)readLocationPermission().then(report);else report(deviceLocation.permission);
 };
 try{const watch=navigator.geolocation.watchPosition(position=>{if(current())receiveDevicePosition(position);},failure,{enableHighAccuracy:true,maximumAge:3000,timeout:20000});if(current())navState.watch=watch;else navigator.geolocation.clearWatch(watch);}catch(_){failure({code:1});}
}
function pauseLocationTracking(){
 deviceLocation.paused=true;deviceLocation.lifecycleVersion++;noteLocationInteraction();deviceLocation.requestVersion++;stopLocationWatch();deviceLocation.cancelRequest?.();deviceLocation.cancelRequest=null;deviceLocation.resume=null;navState.locationRequest=null;$('locate-me')?.classList.remove('locating');
 if(navState.locationMessage?.key==='locating'){navState.locationMessage=null;renderJourney();}
}
function resumeLocationTracking(){
 if(document.visibilityState==='hidden')return;
 deviceLocation.paused=false;
 if(!deviceLocation.started||deviceLocation.resume||navState.locationRequest||navState.watch!==null)return;
 const version=deviceLocation.requestVersion;
 const pending=readLocationPermission().then(permission=>{
  if(version!==deviceLocation.requestVersion||deviceLocation.paused||document.visibilityState==='hidden'||navState.locationRequest||navState.watch!==null||permission!=='granted')return;
  deviceLocation.blocked=false;startLocationWatch();
 });
 deviceLocation.resume=pending;pending.finally(()=>{if(deviceLocation.resume===pending)deviceLocation.resume=null;});
}
function requestStartupLocation(){
 if(deviceLocation.started)return;deviceLocation.started=true;
 const interactionVersion=deviceLocation.interactionVersion;
 setTimeout(()=>{if(document.visibilityState!=='hidden'&&!deviceLocation.paused)return locateUser(interactionVersion===deviceLocation.interactionVersion,null,true);},0);
}
function acquireDeviceLocation(){
 const version=++deviceLocation.requestVersion,fixVersion=deviceLocation.fixVersion;
 const current=()=>version===deviceLocation.requestVersion&&!deviceLocation.paused;
 const requestPosition=options=>new Promise(resolve=>{
  let settled=false;
  const finish=result=>{if(settled)return;settled=true;if(deviceLocation.cancelRequest===cancel)deviceLocation.cancelRequest=null;resolve(result);};
  const cancel=()=>finish({canceled:true});deviceLocation.cancelRequest=cancel;
  try{navigator.geolocation.getCurrentPosition(position=>finish({position}),error=>finish({error}),options);}catch(_){finish({error:{code:1}});}
 });
 const request=(async()=>{
  let permission=await readLocationPermission();if(!current())return null;
  if(permission==='denied'){deviceLocation.blocked=true;stopLocationWatch();navState.locationIssue='locationPermissionDenied';return null;}
  deviceLocation.blocked=false;
  let result=await requestPosition({enableHighAccuracy:true,maximumAge:10000,timeout:15000});if(!current()||result.canceled)return null;
  // A coarse browser/device fix is preferable to no dot. Retry only once, and
  // never retry permission errors or manufacture a campus/default coordinate.
  if(result.error?.code===2||result.error?.code===3){result=await requestPosition({enableHighAccuracy:false,maximumAge:60000,timeout:8000});if(!current()||result.canceled)return null;}
  if(result.position&&receiveDevicePosition(result.position)){startLocationWatch();return {...navState.location};}
  if(result.error?.code===1){
   deviceLocation.blocked=true;stopLocationWatch();permission=await readLocationPermission();if(!current())return null;
   navState.locationIssue=locationFailureKey(result.error,permission);return null;
  }
  // A watch may recover after both bounded attempts, without moving the map or
  // changing a chosen origin. Its lifecycle is independent of caller messages.
  startLocationWatch();
  if(deviceLocation.fixVersion!==fixVersion&&navState.location)return {...navState.location};
  navState.locationIssue=locationFailureKey(result.error,permission);return null;
 })();
 navState.locationRequest=request;
 request.finally(()=>{if(navState.locationRequest===request){navState.locationRequest=null;$('locate-me')?.classList.remove('locating');}});
 return request;
}
function locateUser(center=true,field=null,quiet=false,{focusNext=true,implicit=false}={}){
 const selectionVersion=field?navState.endpointVersion[field]:null,messageVersion=navState.locationMessageVersion,interactionVersion=deviceLocation.interactionVersion,lifecycleVersion=deviceLocation.lifecycleVersion;
 const current=()=>messageVersion===navState.locationMessageVersion;
 const apply=position=>{
  if(deviceLocation.paused||lifecycleVersion!==deviceLocation.lifecycleVersion)return position;
  if(!position){if(!quiet&&current())showLocationMessage(navState.locationIssue||'locationFailed');return null;}
  if(!current())return position;
  if(!quiet)showLocationMessage('locationReady');
  if(center&&interactionVersion===deviceLocation.interactionVersion)map.setView([position.lat,position.lng],16);
  if(field&&selectionVersion===navState.endpointVersion[field])setEndpoint(field,implicit?{...position,implicit:true,displayed:true}:position,{focusNext});
  return position;
 };
 const unavailable=key=>{if(current()){navState.locationIssue=key;if(!quiet)showLocationMessage(key);}return Promise.resolve(null);};
 if(!window.isSecureContext)return unavailable('locationSecure');
 if(!navigator.geolocation)return unavailable('locationUnsupported');
 if(locationPolicyBlocked())return unavailable('locationPolicyBlocked');
 if(deviceLocation.paused||document.visibilityState==='hidden')return Promise.resolve(null);
 deviceLocation.started=true;
 if(!quiet)showLocationMessage('locating');$('locate-me')?.classList.add('locating');
 return (navState.locationRequest||acquireDeviceLocation()).then(apply);
}
// Device fixes update only the blue location marker; routes remain a static plan.
function receiveDevicePosition(position){
 const c=position?.coords;if(!c||!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude)||Math.abs(c.latitude)>90||Math.abs(c.longitude)>180)return false;
 if(Number.isFinite(position.timestamp)&&navState.locationTime!==null&&position.timestamp<navState.locationTime)return false;
 deviceLocation.fixVersion++;
 navState.location={id:'my-location',name:'',type:'location',lat:c.latitude,lng:c.longitude};navState.locationAccuracy=Number.isFinite(c.accuracy)&&c.accuracy>0?c.accuracy:null;navState.locationTime=Number.isFinite(position.timestamp)?position.timestamp:Date.now();navState.locationIssue=null;drawUserLocation();
 let clearedLocationIssue=false;
 if(navState.locationMessage&&/^location/.test(navState.locationMessage.key)){navState.locationMessage=null;clearedLocationIssue=true;}
 if(navState.error&&/^location/.test(navState.error)){navState.error=null;clearedLocationIssue=true;}
 if(clearedLocationIssue)renderJourney();
 return true;
}
function formatDistance(meters){return meters>=1000?t('distanceKm',{n:(meters/1000).toFixed(meters>=10000?0:1)}):t('distanceM',{n:Math.round(meters/10)*10});}
function formatDuration(seconds){const minutes=Math.max(0,Math.ceil(seconds/60));return minutes<60?t('minutes',{n:minutes}):t('hours',{n:Math.floor(minutes/60)})+(minutes%60?' '+t('minutes',{n:minutes%60}):'');}
function googleDirectionsURL(){const a=navState.endpoints.start,b=navState.endpoints.end;const params=new URLSearchParams({api:'1',origin:a.lat+','+a.lng,destination:b.lat+','+b.lng,travelmode:navState.mode==='walk'?'walking':'transit'});return 'https://www.google.com/maps/dir/?'+params;}
function verifyAccess(route){if(route.available&&route.snapDistanceMeters?.some(d=>d>150))return {available:false,reason:'endpoint-access-gap',mode:route.mode};return route;}
function clearJourney({keepResults=false}={}){
 liveArrivals?.clear();
 navState.searchIntent++;if(!keepResults)navState.resultMode=false;
 navState.request?.abort();navState.version++;navState.busy=false;navState.options=[];navState.selected=0;navState.error=null;navState.note=null;navState.bounds=null;journeyLayers?.clearLayers();if(routeView==='journey')clearRouteSelection();updatePlannerChrome();renderJourney();
}
function fitJourney(){if(!navState.bounds)return false;map.fitBounds(navState.bounds,{...mapViewPadding(),maxZoom:17,animate:false});return true;}
async function resolveField(field,{intent=null}={}){
 const canceled=()=>intent!==null&&intent!==navState.searchIntent;if(canceled())return null;
 const f=navState.fields[field],text=f.input.value.trim();
 if(field==='start'&&!text){
  const generation=navState.endpointVersion.start;
  const position=navState.location||await locateUser(false,null,false);
  if(canceled())return null;
  if(generation!==navState.endpointVersion.start||f.input.value.trim())return resolveField(field,{intent});
  if(position){const implicit={...position,implicit:true};navState.endpoints.start=implicit;return implicit;}
  navState.error=navState.locationIssue||'locationStartNeeded';navState.locationMessage=null;renderJourney();return null;
 }
 const old=navState.endpoints[field];if(old&&text===placeName(old)){if(old.type==='location'&&navState.location)navState.endpoints[field]={...old,...navState.location};return navState.endpoints[field];}
 const coords=coordinatePlace(text);const local=localPlaceMatches(text);const exact=local.find(p=>[p.name,...(p.aliases||[])].some(n=>normalized(n)===normalized(text)));
 if(coords||exact){navState.endpoints[field]=coords||exact;f.input.value=placeName(coords||exact);window.dispatchEvent(new CustomEvent('lehigh:endpoints-changed'));return coords||exact;}
 f.input.focus();updateSuggestions(field);navState.error='selectSuggestion';renderJourney();return null;
}
function commitImplicitOrigin(){
 const origin=navState.endpoints.start,input=$('start-stop');
 if(!origin?.implicit||(!origin.displayed&&input.value.trim()))return;
 origin.displayed=true;input.value=placeName(origin);
}
function selectImplicitOriginText(field){
 if(field==='start'&&navState.endpoints.start?.implicit&&navState.endpoints.start.displayed)$(field+'-stop').select();
}
async function searchJourney(event,{recalculate=false}={}){
 if(recalculate&&!navState.resultMode)return;
 event?.preventDefault();closeAllSuggestions();const intent=++navState.searchIntent;
 const b=await resolveField('end',{intent});if(!b||intent!==navState.searchIntent)return;navState.plannerExpanded=true;updatePlannerChrome();const a=await resolveField('start',{intent});if(!a||intent!==navState.searchIntent)return;
 setDrawer(false);
 if(JourneyEngine.distanceMeters(a,b)<5){navState.error='sameLocation';renderJourney();return;}
 navState.resultMode=true;clearJourney({keepResults:true});renderEndpoints();const version=navState.version;const controller=new AbortController();navState.request=controller;navState.busy=true;renderJourney();
 try{
  if(navState.mode==='transit'){
   const stopId=point=>point?.type==='stop'?String(point.stopId||point.id).replace(/^stop-/,''):null;
   const candidates=JourneyEngine.busCandidates(a,b,{dateKey:today(),limit:4,maxWalkMeters:1400,preferNearestStops:true,fixedBoardId:stopId(a),fixedAlightId:stopId(b)}).filter(c=>c.serviceAvailable&&(!window.LeHighServiceStatus||window.LeHighServiceStatus.getStatus(c.route.id).running));
   if(candidates.length){navState.options=candidates.slice(0,3).map(candidate=>({kind:'bus',candidate,loading:false}));navState.selected=0;await loadJourneyOption(0,version,controller.signal);}
   else{navState.note='noTransitNow';const walk=verifyAccess(await JourneyEngine.walkRoute(a,b,controller.signal));if(version!==navState.version)return;navState.options=walk.available?[{kind:'walk',route:walk}]:[];if(!walk.available)navState.error='routeUnavailable';drawJourney();}
  }else{const route=verifyAccess(await JourneyEngine.walkRoute(a,b,controller.signal));if(version!==navState.version)return;navState.options=route.available?[{kind:navState.mode,route}]:[];if(!route.available)navState.error='routeUnavailable';drawJourney();}
 }catch(error){if(error.name!=='AbortError'&&version===navState.version)navState.error='routeUnavailable';}
 finally{if(version===navState.version){navState.busy=false;if(navState.options.length&&!navState.error)commitImplicitOrigin();renderJourney();}}
}
async function loadJourneyOption(index,version=navState.version,signal=navState.request?.signal){
 const option=navState.options[index];if(!option)return;navState.selected=index;
 if(option.kind!=='bus'){liveArrivals?.clear();clearRouteSelection();drawJourney();renderJourney();return;}
 const c=option.candidate;selectRoute(c.route,false,{journey:true});
 liveArrivals?.selectStop(boardingSelection(c));
 if(option.loading){drawJourney();renderJourney();return;}
 if(option.approach&&option.egress){drawJourney();renderJourney();return;}
 option.loading=true;renderJourney();drawJourney();
 const zero={available:true,distanceMeters:0,durationSeconds:0,geometry:[],steps:[]};
 try{
  option.approach=JourneyEngine.distanceMeters(navState.endpoints.start,c.board)<15?zero:verifyAccess(await JourneyEngine.walkRoute(navState.endpoints.start,c.board,signal));
  if(version!==navState.version||navState.selected!==index)return;
  option.egress=JourneyEngine.distanceMeters(c.alight,navState.endpoints.end)<15?zero:verifyAccess(await JourneyEngine.walkRoute(c.alight,navState.endpoints.end,signal));
 }finally{option.loading=false;}
 if(version!==navState.version||navState.selected!==index)return;drawJourney();renderJourney();
}
function drawJourney(){
 const option=navState.options[navState.selected];if(!option)return;journeyLayers.clearLayers();stopMarkers.clearLayers();
 if(option.kind!=='bus'&&activeRoute)clearRouteSelection();
 const addLine=(geometry,color,dashed=false)=>{if(geometry?.length>1)L.polyline(geometry,{color,weight:dashed?5:7,opacity:.95,dashArray:dashed?'4 9':null,lineCap:'round'}).addTo(journeyLayers);};
 if(option.kind==='bus'){
  const c=option.candidate;
  if(option.approach?.available)addLine(option.approach.geometry,'#4d7ac7',true);
  addLine(c.rideGeometry,c.route.color);
  if(option.egress?.available)addLine(option.egress.geometry,'#4d7ac7',true);
  for(const [point,label] of [[c.board,t('boardAt')],[c.alight,t('alightAt')]]){
   const marker=L.circleMarker([point.lat,point.lng],{className:'journey-stop',radius:7,color:'#fff',weight:3,fillColor:c.route.color,fillOpacity:1,bubblingMouseEvents:false}).addTo(journeyLayers);
   if(window.LeHighStopUI?.bindMarker)window.LeHighStopUI.bindMarker(marker,point.id,{route:c.route});else marker.bindPopup(label+'<br>'+escapeHTML(point.name));
  }
 }else{if(activePolyline)activePolyline.setStyle({opacity:.12});addLine(option.route.geometry,'#3f79c6',true);}
 const coords=[navState.endpoints.start,navState.endpoints.end].map(p=>[p.lat,p.lng]);journeyLayers.eachLayer(layer=>{if(layer.getBounds){const b=layer.getBounds();if(!b.isValid||b.isValid())coords.push([b.getSouth(),b.getWest()],[b.getNorth(),b.getEast()]);}});navState.bounds=L.latLngBounds(coords);$('fit-route').hidden=false;renderEndpoints();fitJourney();
}
function localizedStep(step,arrivalPlace=placeName(navState.endpoints.end)){const m=step.maneuver||{},road=step.name||t('road');if(m.type==='depart')return t('startFrom',{place:road});if(m.type==='arrive')return t('arriveAt',{place:arrivalPlace});if(String(m.type).includes('roundabout')||String(m.type).includes('rotary'))return t('roundabout',{road});const turns={'left':'left','right':'right','slight left':'slightLeft','slight right':'slightRight','sharp left':'sharpLeft','sharp right':'sharpRight','uturn':'uturn'};return turns[m.modifier]?t('turnOn',{turn:t(turns[m.modifier]),road}):t('continueOn',{road});}
function itineraryHTML(option){
 if(option.kind==='bus'){
  const c=option.candidate,a=option.approach,b=option.egress;
  const segment=(icon,title,desc,extra='')=>'<li><span class="leg-icon">'+icon+'</span><div><strong>'+escapeHTML(title)+'</strong><small>'+escapeHTML(desc)+'</small>'+extra+'</div></li>';
  let html='<ol class="journey-legs">';
  html+=segment('↟',t('walkTo',{place:c.board.name}),a?.available?formatDistance(a.distanceMeters)+' · '+formatDuration(a.durationSeconds):t(option.loading?'loadingConnections':'connectionsUnavailable'));
  html+=segment(c.route.shortName,t('rideTo',{route:routeName(c.route),place:c.alight.name}),t('estimated')+' '+formatDuration(c.rideDurationSeconds),boardingHTML(option));
  html+=segment('↟',t('walkFinish',{place:placeName(navState.endpoints.end)}),b?.available?formatDistance(b.distanceMeters)+' · '+formatDuration(b.durationSeconds):t(option.loading?'loadingConnections':'connectionsUnavailable'));
  html+='</ol>';
  if(a?.available&&a.steps.length)html+='<details class="walking-steps"><summary>'+t('walkTo',{place:c.board.name})+'</summary>'+stepsHTML(a.steps,c.board.name)+'</details>';
  if(b?.available&&b.steps.length)html+='<details class="walking-steps"><summary>'+t('walkFinish',{place:placeName(navState.endpoints.end)})+'</summary>'+stepsHTML(b.steps)+'</details>';
  return html;
 }
 return '<details class="walking-steps"><summary>'+t('steps')+'</summary>'+stepsHTML(option.route.steps)+'</details>';
}
function stepsHTML(steps,arrivalPlace){return '<ol class="direction-steps">'+steps.map(step=>'<li><span>'+escapeHTML(localizedStep(step,arrivalPlace))+'</span>'+(step.distanceMeters>0?'<small>'+formatDistance(step.distanceMeters)+'</small>':'')+'</li>').join('')+'</ol>';}
function optionTime(option){if(option.kind!=='bus')return formatDuration(option.route.durationSeconds);if(option.loading)return t('loadingConnections');const a=option.approach,b=option.egress;if(a?.available===false||b?.available===false)return t('connectionsUnavailable');return a?.available&&b?.available?formatDuration(a.durationSeconds+option.candidate.rideDurationSeconds+b.durationSeconds):t('estimated')+' '+formatDuration(option.candidate.estimatedDurationSeconds);}
function renderJourney(){
 const result=$('search-result');if(!result)return;
 const form=$('search-form');form?.setAttribute('aria-busy',String(navState.busy));const submit=$('find-button')||form?.querySelector('.find-button');if(submit)submit.disabled=navState.busy;
 const has=navState.busy||navState.options.length>0||navState.error||navState.locationMessage;
 result.hidden=!has;result.classList.add('journey-panel');form?.classList.toggle('location-feedback',Boolean(navState.locationMessage&&!navState.plannerExpanded));
 if(!has){result.replaceChildren();return;}
 const a=navState.endpoints.start,b=navState.endpoints.end;
 if(!navState.resultMode){
  const notice=navState.error?{key:navState.error,vars:{}}:navState.locationMessage;result.hidden=!notice;result.innerHTML=notice?'<p class="journey-message">'+escapeHTML(t(notice.key,notice.vars))+'</p>':'';return;
 }
 if(navState.busy&&!navState.options.length){result.innerHTML='<p class="journey-loading">'+escapeHTML(t('findingRoute'))+'</p>';return;}
 if(navState.error){result.innerHTML='<p class="journey-message">'+escapeHTML(t(navState.error))+'</p>'+(a&&b?'<a class="google-link" href="'+escapeHTML(googleDirectionsURL())+'" target="_blank" rel="noopener">'+t('openGoogle')+'</a>':'');return;}
 const active=navState.options[navState.selected];
 if(!active){result.innerHTML=navState.locationMessage?'<p class="journey-message">'+escapeHTML(t(navState.locationMessage.key,navState.locationMessage.vars))+'</p>':'';return;}
 const title=active.kind==='bus'?t('busOption',{route:routeName(active.candidate.route)}):t('walkOnly');
 const alternatives=navState.options.map((option,index)=>({option,index})).filter(item=>item.index!==navState.selected);
 const choices=alternatives.length?'<details class="journey-alternatives"><summary>'+escapeHTML(t('routeAlternatives'))+'</summary><div class="journey-choices">'+alternatives.map(({option,index})=>'<button type="button" class="journey-choice" data-journey="'+index+'"><strong>'+escapeHTML(option.kind==='bus'?routeName(option.candidate.route):t('walkOnly'))+'</strong><span>'+escapeHTML(optionTime(option))+'</span>'+(option.kind==='bus'?'<small>'+daySummary(option.candidate.route)+'</small>':'<small>'+formatDistance(option.route.distanceMeters)+'</small>')+'</button>').join('')+'</div></details>':'';
 result.innerHTML='<div class="journey-heading"><p class="detail-eyebrow">'+escapeHTML(title)+'</p><h2>'+escapeHTML(placeName(a))+'<span> → </span>'+escapeHTML(placeName(b))+'</h2></div><div class="journey-total"><span class="journey-total-value">'+escapeHTML(optionTime(active))+'</span><small>'+escapeHTML(t('approxDuration'))+'</small></div>'+(active.kind==='bus'?'<p class="journey-caveat">'+escapeHTML(t('noWait'))+'</p>':'')+(navState.note?'<p class="journey-message">'+escapeHTML(navState.note==='noTransitNow'?boardingText('noTransitNow'):t(navState.note))+'</p>':'')+itineraryHTML(active)+choices+(navState.locationMessage&&navState.locationMessage.key!=='locating'?'<p class="journey-message">'+escapeHTML(t(navState.locationMessage.key,navState.locationMessage.vars))+'</p>':'')+'<a class="google-link" href="'+escapeHTML(googleDirectionsURL())+'" target="_blank" rel="noopener">'+t('openGoogle')+'</a><p class="journey-credit">'+escapeHTML(t('routeSources'))+'</p>';
 $('arrival-refresh')?.addEventListener('click',()=>liveArrivals?.refresh());updateBoardingArrival();
 const version=navState.version;
 result.querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>loadJourneyOption(+button.dataset.journey).catch(error=>{if(error.name!=='AbortError'&&version===navState.version){navState.error='routeUnavailable';renderJourney();}})));
}
window.initNavigation=function(){
 journeyLayers=L.featureGroup().addTo(map);endpointLayers=L.featureGroup().addTo(map);userLayers=L.featureGroup().addTo(map);
 if(window.LeHighLiveArrivals&&typeof window.fetch==='function')liveArrivals=window.LeHighLiveArrivals.create({getLanguage:()=>language,onStatus:updateBoardingArrival});
 for(const field of ['start','end']){
  const input=$(field+'-stop'),box=$(field+'-suggestions');navState.fields[field]={input,box,items:[],index:-1,timer:null,generation:0,controller:null};
  input.addEventListener('input',()=>invalidateInput(field));input.addEventListener('focus',()=>{closeSuggestions(field==='start'?'end':'start');updateSuggestions(field);selectImplicitOriginText(field);});
  input.addEventListener('click',()=>selectImplicitOriginText(field));
  input.addEventListener('blur',()=>setTimeout(()=>{const f=navState.fields[field];if(document.activeElement!==input&&!f.pointerInteracting&&Date.now()>=(f.keepSuggestionsUntil||0))closeSuggestions(field);},180));
  box.addEventListener('scroll',()=>{const f=navState.fields[field];if(f.pointerGesture)f.pointerGesture.moved=true;f.suppressClickUntil=Date.now()+500;},{passive:true});
  input.addEventListener('keydown',event=>{const f=navState.fields[field];if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(box.hidden)updateSuggestions(field);focusOption(field,f.index+(event.key==='ArrowDown'?1:-1));}else if(event.key==='Escape'){event.preventDefault();closeSuggestions(field);}else if(event.key==='Enter'&&!box.hidden){event.preventDefault();const exact=localPlaceMatches(input.value).find(p=>[p.name,...(p.aliases||[])].some(alias=>normalized(alias)===normalized(input.value)));const choice=f.index>=0?f.items[f.index]:input.value.trim()?(exact||f.items.find(p=>!['location','pick'].includes(p.type))):null;if(choice)chooseSuggestion(field,choice);}});
 }
 updatePlannerChrome();$('close-directions').addEventListener('click',collapsePlanner);
 $('search-form').addEventListener('submit',searchJourney);
 $('swap-stops').addEventListener('click',()=>{
  noteLocationInteraction();
  cancelMapPick();navState.endpointVersion.start++;navState.endpointVersion.end++;
  const start=navState.endpoints.start,end=navState.endpoints.end,rawStart=$('start-stop').value,rawEnd=$('end-stop').value;
  navState.endpoints.start=end?{...end,implicit:false}:null;navState.endpoints.end=start?{...start,implicit:false}:null;
  $('start-stop').value=end?placeName(end):rawEnd;$('end-stop').value=start?placeName(start):rawStart;
  clearJourney();renderEndpoints();window.dispatchEvent(new CustomEvent('lehigh:endpoints-changed'));
 });
 $('locate-me').addEventListener('click',()=>locateUser(true));
 document.addEventListener('pointerdown',noteLocationInteraction,{passive:true});
 document.addEventListener('keydown',noteLocationInteraction);
 document.addEventListener('wheel',noteLocationInteraction,{passive:true});
 map.on('movestart',noteLocationInteraction);
 document.addEventListener('pointerdown',event=>{const form=$('search-form');if(typeof form?.contains==='function'&&!form.contains(event.target))closeAllSuggestions();});
 document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{const results=navState.resultMode;navState.mode=button.dataset.mode==='walk'?'walk':'transit';document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(results)searchJourney(undefined,{recalculate:true});}));
 map.on('click',event=>{if(!navState.picking)return;event.lehighPicked=true;const field=navState.picking;navState.picking=null;$('map').classList.remove('picking-location');navState.locationMessage=null;acceptSearchedPlace(field,{id:'map-'+Date.now(),type:'map',name:'',lat:event.latlng.lat,lng:event.latlng.lng});});
 window.dispatchEvent(new CustomEvent('lehigh:navigation-ready'));
 // Request once on page open; the browser owns the permission decision.
 requestStartupLocation();
 window.addEventListener('pagehide',pauseLocationTracking);
 window.addEventListener('pageshow',resumeLocationTracking);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')pauseLocationTracking();else resumeLocationTracking();});
};
window.LeHighNavigation={translate:translateNavigation,render:renderJourney,clearJourney,fit:fitJourney,hasJourney:()=>Boolean(navState.bounds),
 selectPlace(field,place){if(!['start','end'].includes(field)||!place||!Number.isFinite(place.lat)||!Number.isFinite(place.lng))return;acceptSearchedPlace(field,place);map.setView([place.lat,place.lng],17);},
 collapseSearch:collapsePlanner,expandSearch:expandPlanner,dismissSuggestions,getSearchState:()=>({expanded:navState.plannerExpanded,results:navState.resultMode,resultMode:navState.resultMode}),getEndpoints:()=>({...navState.endpoints}),getLocation:()=>navState.location?{...navState.location}:null,isPicking:()=>Boolean(navState.picking)};
