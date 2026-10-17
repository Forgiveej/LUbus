/* Typed place search, browser geolocation, and coordinate-to-coordinate directions.
 * Campus places: official Lehigh map. Search: MapTiler. Walking/driving: FOSSGIS OSRM.
 * Device coordinates stay in memory; routing requests are sent only on a route search.
 */
'use strict';
const navigationCopy={
 en:{
  modeTransit:'Campus bus',modeWalk:'Walk',modeDrive:'Drive',searchPowered:'Place search:',fixMap:'Fix the map',
  scopeNote:'Bethlehem + all Lehigh campuses',chooseStart:'My location, or enter a starting point',chooseEnd:'Where do you want to go?',myLocation:'My location',currentLocation:'Your location',locating:'Finding your location…',locationReady:'Your location is shown as a blue dot.',locationDenied:'Location is blocked. Allow location for this site in your browser, or enter your starting point.',locationFailed:'Your device could not determine a location. Try again or enter an address.',locationUnsupported:'This browser does not support location. Enter an address instead.',locationSecure:'Location requires localhost or a secure HTTPS site.',locationStartNeeded:'Allow location access, or enter a starting point.',accuracy:'Accuracy about {n} m',
  campusPlace:'Lehigh campus',stopPlace:'Campus bus stop',otherPlace:'Place or address',popularPlaces:'POPULAR AT LEHIGH',suggestedPlaces:'SUGGESTED PLACES',searchingPlaces:'Searching addresses…',noPlaces:'No local matches. Try a Lehigh building, residence hall or Bethlehem address.',searchUnavailable:'Address search is unavailable. Campus places and map selection still work.',selectSuggestion:'Select a suggested place to confirm its location.',pickMap:'Choose a point on the map',pickPrompt:'Click anywhere on the map to set {field}.',mapPoint:'Map point',originWord:'the starting point',destinationWord:'the destination',
  findingRoute:'Finding a route…',loadingConnections:'Calculating walking connections…',routeUnavailable:'A route could not be calculated. Try another mode or open Google Maps.',noTransit:'No scheduled campus bus connects these locations today. Showing a walking route.',sameLocation:'The starting point and destination are the same.',
  directionsTitle:'DIRECTIONS',journeyBack:'Back to campus routes',walkOnly:'Walking route',driveOnly:'Driving route',busOption:'Walk + {route}',walkTo:'Walk to {place}',rideTo:'Take {route} to {place}',walkFinish:'Walk to {place}',boardAt:'Board at',alightAt:'Get off at',minutes:'{n} min',hours:'{n} hr',distanceKm:'{n} km',distanceM:'{n} m',estimated:'Estimated',noWait:'Travel estimate only · bus waiting time excluded',busEstimate:'Bus duration is estimated from route distance; not a live arrival prediction.',connectionsUnavailable:'Walking connections could not be verified. No walking path is drawn for unavailable segments.',walkDistance:'Walking',rideDistance:'On the bus',routeDetails:'Route details',steps:'Directions',openGoogle:'Open in Google Maps ↗',routeSources:'Routes: © OpenStreetMap contributors · FOSSGIS OSRM',originLabel:'Start',destinationLabel:'Destination',startFrom:'Depart from {place}',arriveAt:'Arrive at {place}',continueOn:'Continue on {road}',turnOn:'{turn} onto {road}',road:'the path',left:'Turn left',right:'Turn right',straight:'Continue straight',slightLeft:'Bear left',slightRight:'Bear right',sharpLeft:'Turn sharply left',sharpRight:'Turn sharply right',uturn:'Make a U-turn',roundabout:'At the roundabout, follow {road}',north:'north',stepDistance:'{distance}',driveEstimate:'Estimated duration · no live traffic',noLive:'Published schedule · check live buses before leaving',useLocationHint:'Use your location or type an address',locationPrivacy:'Location stays on this page until you search a route. A route search sends its endpoints to the routing service.',
 },
 zh:{
  modeTransit:'校园公交',modeWalk:'步行',modeDrive:'驾车',searchPowered:'地点搜索：',fixMap:'纠正地图',
  scopeNote:'搜索限 Bethlehem 与理海全部校区',chooseStart:'我的位置，或输入其他出发地',chooseEnd:'想去哪里？输入地点或地址',myLocation:'我的位置',currentLocation:'我的位置',locating:'正在获取你的位置…',locationReady:'蓝色圆点已显示你的位置。',locationDenied:'定位权限被关闭。请在浏览器中允许此网站定位，或手动输入起点。',locationFailed:'设备暂时无法确定位置，请重试或手动输入地址。',locationUnsupported:'当前浏览器不支持定位，请手动输入地址。',locationSecure:'定位需要本机预览地址或 HTTPS 网站。',locationStartNeeded:'请允许定位，或手动输入出发地。',accuracy:'定位精度约 {n} 米',
  campusPlace:'理海校园地点',stopPlace:'校园公交站',otherPlace:'地点或地址',popularPlaces:'理海常用地点',suggestedPlaces:'可能想找的地点',searchingPlaces:'正在搜索地址…',noPlaces:'本地范围内没有匹配结果，请尝试理海建筑、宿舍名或 Bethlehem 地址。',searchUnavailable:'地址搜索暂不可用，仍可搜索校园地点或在地图上选点。',selectSuggestion:'请从搜索建议中选定地点，确认具体位置。',pickMap:'在地图上选择位置',pickPrompt:'请在地图上点击，设置{field}。',mapPoint:'地图选点',originWord:'出发地',destinationWord:'目的地',
  findingRoute:'正在规划路线…',loadingConnections:'正在计算步行接驳…',routeUnavailable:'暂时无法计算路线，可切换出行方式，或在 Google Maps 中打开。',noTransit:'今天没有覆盖这两个地点的计划校园公交，先展示步行路线。',sameLocation:'起点与终点是同一位置，请选择不同地点。',
  directionsTitle:'出行方案',journeyBack:'返回校园线路',walkOnly:'全程步行',driveOnly:'驾车路线',busOption:'步行 + {route}',walkTo:'步行至 {place}',rideTo:'乘坐 {route} 至 {place}',walkFinish:'步行至 {place}',boardAt:'上车站',alightAt:'下车站',minutes:'{n} 分钟',hours:'{n} 小时',distanceKm:'{n} 公里',distanceM:'{n} 米',estimated:'预计',noWait:'仅估算路程用时 · 不含公交等车时间',busEstimate:'公交乘车用时按线路距离估算，不是实时到站预测。',connectionsUnavailable:'部分步行接驳暂时无法验证，对应路段未绘制步行路径。',walkDistance:'步行',rideDistance:'乘车',routeDetails:'路线详情',steps:'分步路线',openGoogle:'在 Google Maps 中打开 ↗',routeSources:'路线：© OpenStreetMap contributors · FOSSGIS OSRM',originLabel:'起点',destinationLabel:'终点',startFrom:'从 {place} 出发',arriveAt:'到达 {place}',continueOn:'沿 {road} 继续前行',turnOn:'{turn}，进入 {road}',road:'当前道路',left:'左转',right:'右转',straight:'直行',slightLeft:'向左前方',slightRight:'向右前方',sharpLeft:'向左急转',sharpRight:'向右急转',uturn:'掉头',roundabout:'在环岛沿 {road} 行驶',north:'北',stepDistance:'{distance}',driveEstimate:'预计用时 · 未计算实时路况',noLive:'按公布时刻表规划 · 出发前请查看实时车辆',useLocationHint:'使用我的位置，或输入出发地址',locationPrivacy:'定位会先保留在当前页面；查询路线时会将起终点发送至路线服务。',
 }
};
Object.assign(copy.en,navigationCopy.en);Object.assign(copy.zh,navigationCopy.zh);
const navState={endpoints:{start:null,end:null},mode:'transit',location:null,locationAccuracy:null,watch:null,fields:{},endpointVersion:{start:0,end:0},request:null,version:0,options:[],selected:0,busy:false,error:null,note:null,bounds:null,picking:null,locationMessage:null,locationRequest:null};
let journeyLayers,endpointLayers,userLayers;
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
 if(!q)return campusPlaces.slice(0,7);
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
 return [...campusPlaces,...stopPlaces].map((p,i)=>({p,i,s:score(p)})).filter(r=>r.s>0).sort((a,b)=>b.s-a.s||(a.p.type==='stop')-(b.p.type==='stop')||a.i-b.i).slice(0,8).map(r=>r.p);
}
function coordinatePlace(text){const m=text.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[,，]\s*(-?\d{1,3}(?:\.\d+)?)$/);if(!m)return null;const lat=+m[1],lng=+m[2];return Math.abs(lat)<=90&&Math.abs(lng)<=180?{id:'coords-'+lat+','+lng,lat,lng,name:text.trim(),type:'map'}:null;}
async function remotePlaceMatches(query,signal){
 const key=(window.MAPTILER_CONFIG?.apiKey||'').trim();if(!key)throw new Error('missing-key');
 const cacheKey='bethlehem-v1|'+language+'|'+normalized(query);if(placeCache.has(cacheKey))return placeCache.get(cacheKey);
 const params=new URLSearchParams({key,bbox:window.LEHIGH_SEARCH_SCOPE.bbox.join(','),country:'us',proximity:'-75.377,40.607',language:language==='zh'?'zh,en':'en',limit:'5',autocomplete:'true'});
 const response=await fetch('https://api.maptiler.com/geocoding/'+encodeURIComponent(query)+'.json?'+params,{signal});
 if(!response.ok)throw new Error('search-unavailable');
 const data=await response.json();const results=(data.features||[]).map(feature=>{const center=feature.center||feature.geometry?.coordinates;return center&&Number.isFinite(center[0])&&Number.isFinite(center[1])?{id:'geo-'+feature.id,name:feature.place_name?.split(',')[0]||feature.text,address:feature.place_name||'',lat:center[1],lng:center[0],type:'place'}:null;}).filter(place=>place&&window.LEHIGH_SEARCH_SCOPE.contains(place));
 placeCache.set(cacheKey,results);return results;
}
function specialSuggestions(field){return [...(field==='start'?[{type:'location',id:'device-location',name:t('currentLocation')}]:[]),{type:'pick',id:'pick-'+field,name:t('pickMap')}];}
function closeSuggestions(field){const f=navState.fields[field];if(!f)return;f.generation++;clearTimeout(f.timer);f.controller?.abort();f.box.hidden=true;f.input.setAttribute('aria-expanded','false');f.input.removeAttribute('aria-activedescendant');f.index=-1;}
function closeAllSuggestions(){for(const name of ['start','end'])closeSuggestions(name);}
function renderSuggestions(field,places,status=null){
 const f=navState.fields[field];if(document.activeElement!==f.input)return;
 f.items=[...specialSuggestions(field),...places];f.index=-1;f.box.replaceChildren();
 const heading=document.createElement('div');heading.className='suggestion-heading';heading.textContent=t(f.input.value.trim()?'suggestedPlaces':'popularPlaces');f.box.append(heading);
 f.items.forEach((place,index)=>{
  const row=document.createElement('div');row.id=field+'-option-'+index;row.className='suggestion-option';row.setAttribute('role','option');row.setAttribute('aria-selected','false');
  const meta=place.type==='location'?t('locationPrivacy'):place.type==='pick'?'':place.address||t(place.type==='campus'?'campusPlace':place.type==='stop'?'stopPlace':'otherPlace');
  row.innerHTML='<span class="place-symbol '+(place.type==='campus'?'campus-symbol':'')+'">'+(place.type==='location'?'◎':place.type==='pick'?'⊕':place.type==='stop'?'▣':place.type==='campus'?'▥':'⌖')+'</span><span><strong>'+escapeHTML(placeName(place)||place.name)+'</strong><small>'+escapeHTML(meta)+'</small></span>';
  row.addEventListener('pointerdown',event=>{event.preventDefault();chooseSuggestion(field,place);});f.box.append(row);
 });
 if(status||!places.length){const note=document.createElement('p');note.className='suggestion-message';note.textContent=t(status||'noPlaces');f.box.append(note);}
 f.box.hidden=false;f.input.setAttribute('aria-expanded','true');
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
 closeAllSuggestions();
 if(place.type==='location'){locateUser(true,field);return;}
 if(place.type==='pick'){navState.picking=field;$('map').classList.add('picking-location');showLocationMessage('pickPrompt',{field:t(field==='start'?'originWord':'destinationWord')});return;}
 setEndpoint(field,place);
}
function cancelMapPick(){if(!navState.picking)return;navState.picking=null;$('map').classList.remove('picking-location');navState.locationMessage=null;$('location-status').hidden=true;}
function setEndpoint(field,place,{focusNext=true}={}){
 cancelMapPick();navState.endpointVersion[field]++;
 navState.endpoints[field]={...place};navState.fields[field].input.value=placeName(place);closeAllSuggestions();clearJourney();renderEndpoints();
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
function invalidateInput(field){cancelMapPick();navState.endpointVersion[field]++;navState.endpoints[field]=null;clearJourney();renderEndpoints();updateSuggestions(field);}
function focusOption(field,index){const f=navState.fields[field];if(!f.items.length)return;f.index=(index+f.items.length)%f.items.length;Array.from(f.box.querySelectorAll('[role="option"]')).forEach((el,i)=>{el.classList.toggle('highlighted',i===f.index);el.setAttribute('aria-selected',String(i===f.index));});const el=$(field+'-option-'+f.index);f.input.setAttribute('aria-activedescendant',el.id);el.scrollIntoView({block:'nearest'});}
function translateNavigation(){
 for(const field of ['start','end']){const f=navState.fields[field];if(!f)continue;f.input.placeholder=t(field==='start'?'chooseStart':'chooseEnd');if(navState.endpoints[field]&&(!navState.endpoints[field].implicit||navState.endpoints[field].displayed))f.input.value=placeName(navState.endpoints[field]);closeSuggestions(field);}
 document.querySelector('.travel-modes').setAttribute('aria-label',language==='zh'?'出行方式':'Travel mode');
 document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===navState.mode)));
 if(navState.locationMessage){const vars=navState.locationMessage.key==='pickPrompt'&&navState.picking?{field:t(navState.picking==='start'?'originWord':'destinationWord')}:navState.locationMessage.vars;showLocationMessage(navState.locationMessage.key,vars);}
 if(navState.location)drawUserLocation();renderEndpoints();renderJourney();
}
function showLocationMessage(key,vars={}){
 const el=$('location-status');
 if(key==='locationReady'){if(navState.picking)return;navState.locationMessage=null;el.textContent='';el.hidden=true;return;}
 navState.locationMessage={key,vars};el.textContent=t(key,vars);el.hidden=false;
}
function drawUserLocation(){
 userLayers.clearLayers();const p=navState.location;if(!p)return;
 L.circle([p.lat,p.lng],{radius:navState.locationAccuracy||15,color:'#3984ee',weight:1,fillColor:'#3984ee',fillOpacity:.08}).addTo(userLayers);
 const icon=L.divIcon({className:'user-position',html:'<span></span>',iconSize:[18,18],iconAnchor:[9,9]});
 L.marker([p.lat,p.lng],{icon,title:t('currentLocation'),zIndexOffset:1000}).addTo(userLayers).bindPopup('<strong>'+t('currentLocation')+'</strong><br>'+t('accuracy',{n:Math.round(navState.locationAccuracy||0)}));
 $('locate-me').classList.add('has-location');
}
function requestStartupLocation(){setTimeout(()=>locateUser(true,null,false),0);}
function locateUser(center=true,field=null,quiet=false,{focusNext=true}={}){
 const selectionVersion=field?navState.endpointVersion[field]:null;
 const apply=position=>{
  if(!position)return null;
  if(center)map.setView([position.lat,position.lng],16);
  if(field&&selectionVersion===navState.endpointVersion[field])setEndpoint(field,position,{focusNext});
  return position;
 };
 if(!navigator.geolocation){if(!quiet)showLocationMessage('locationUnsupported');return Promise.resolve(null);}
 if(!window.isSecureContext){if(!quiet)showLocationMessage('locationSecure');return Promise.resolve(null);}
 if(navState.locationRequest)return navState.locationRequest.then(apply);
 if(!quiet)showLocationMessage('locating');$('locate-me').classList.add('locating');
 const request=new Promise(resolve=>navigator.geolocation.getCurrentPosition(position=>{
  $('locate-me').classList.remove('locating');navState.location={id:'my-location',name:'',type:'location',lat:position.coords.latitude,lng:position.coords.longitude};navState.locationAccuracy=position.coords.accuracy;drawUserLocation();if(!quiet)showLocationMessage('locationReady');
  if(navState.watch===null)navState.watch=navigator.geolocation.watchPosition(next=>{navState.location={...navState.location,lat:next.coords.latitude,lng:next.coords.longitude};navState.locationAccuracy=next.coords.accuracy;drawUserLocation();},()=>{},{enableHighAccuracy:true,maximumAge:10000,timeout:20000});
  resolve({...navState.location});
 },error=>{$('locate-me').classList.remove('locating');if(!quiet)showLocationMessage(error.code===1?'locationDenied':'locationFailed');resolve(null);},{enableHighAccuracy:true,maximumAge:30000,timeout:15000}));
 navState.locationRequest=request;
 request.finally(()=>{if(navState.locationRequest===request)navState.locationRequest=null;});
 return request.then(apply);
}
function formatDistance(meters){return meters>=1000?t('distanceKm',{n:(meters/1000).toFixed(meters>=10000?0:1)}):t('distanceM',{n:Math.round(meters/10)*10});}
function formatDuration(seconds){const minutes=Math.max(1,Math.ceil(seconds/60));return minutes<60?t('minutes',{n:minutes}):t('hours',{n:Math.floor(minutes/60)})+(minutes%60?' '+t('minutes',{n:minutes%60}):'');}
function googleDirectionsURL(){const a=navState.endpoints.start,b=navState.endpoints.end;const params=new URLSearchParams({api:'1',origin:a.lat+','+a.lng,destination:b.lat+','+b.lng,travelmode:navState.mode==='walk'?'walking':navState.mode==='drive'?'driving':'transit'});return 'https://www.google.com/maps/dir/?'+params;}
function verifyAccess(route){if(route.available&&route.snapDistanceMeters?.some(d=>d>(route.mode==='drive'?500:150)))return {available:false,reason:'endpoint-access-gap',mode:route.mode};return route;}
function clearJourney(){
 navState.request?.abort();navState.version++;navState.busy=false;navState.options=[];navState.selected=0;navState.error=null;navState.note=null;navState.bounds=null;journeyLayers?.clearLayers();if(routeView==='journey')clearRouteSelection();renderJourney();
}
function fitJourney(){if(!navState.bounds)return false;map.fitBounds(navState.bounds,{...mapViewPadding(),maxZoom:17,animate:false});return true;}
async function resolveField(field){
 const f=navState.fields[field],text=f.input.value.trim();
 if(field==='start'&&!text){
  const generation=navState.endpointVersion.start;
  const position=navState.location||await locateUser(false,null,false);
  if(generation!==navState.endpointVersion.start||f.input.value.trim())return resolveField(field);
  if(position){const implicit={...position,implicit:true};navState.endpoints.start=implicit;return implicit;}
  navState.error='locationStartNeeded';renderJourney();return null;
 }
 const old=navState.endpoints[field];if(old&&text===placeName(old)){if(old.type==='location'&&navState.location)navState.endpoints[field]={...old,...navState.location};return navState.endpoints[field];}
 const coords=coordinatePlace(text);const local=localPlaceMatches(text);const exact=local.find(p=>[p.name,...(p.aliases||[])].some(n=>normalized(n)===normalized(text)));
 if(coords||exact){navState.endpoints[field]=coords||exact;f.input.value=placeName(coords||exact);return coords||exact;}
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
async function searchJourney(event){
 event?.preventDefault();closeAllSuggestions();
 const b=await resolveField('end');if(!b)return;const a=await resolveField('start');if(!a)return;
 setDrawer(true);
 if(JourneyEngine.distanceMeters(a,b)<5){navState.error='sameLocation';renderJourney();return;}
 clearJourney();renderEndpoints();const version=navState.version;const controller=new AbortController();navState.request=controller;navState.busy=true;renderJourney();
 try{
  if(navState.mode==='transit'){
   const candidates=JourneyEngine.busCandidates(a,b,{dateKey:today(),limit:4,maxWalkMeters:1400,preferNearestStops:true}).filter(c=>c.serviceAvailable);
   if(candidates.length){navState.options=candidates.slice(0,3).map(candidate=>({kind:'bus',candidate,loading:false}));navState.selected=0;await loadJourneyOption(0,version,controller.signal);}
   else{navState.note='noTransit';const walk=verifyAccess(await JourneyEngine.walkRoute(a,b,controller.signal));if(version!==navState.version)return;navState.options=walk.available?[{kind:'walk',route:walk}]:[];if(!walk.available)navState.error='routeUnavailable';drawJourney();}
  }else{const route=verifyAccess(await (navState.mode==='drive'?JourneyEngine.driveRoute:JourneyEngine.walkRoute)(a,b,controller.signal));if(version!==navState.version)return;navState.options=route.available?[{kind:navState.mode,route}]:[];if(!route.available)navState.error='routeUnavailable';drawJourney();}
 }catch(error){if(error.name!=='AbortError'&&version===navState.version)navState.error='routeUnavailable';}
 finally{if(version===navState.version){navState.busy=false;if(navState.options.length&&!navState.error)commitImplicitOrigin();renderJourney();}}
}
async function loadJourneyOption(index,version=navState.version,signal=navState.request?.signal){
 const option=navState.options[index];if(!option)return;navState.selected=index;
 if(option.kind!=='bus'){clearRouteSelection();drawJourney();renderJourney();return;}
 if(option.loading)return;
 const c=option.candidate;selectRoute(c.route,false,{journey:true});
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
 const addLine=(geometry,color,dashed=false)=>{if(geometry?.length>1)L.polyline(geometry,{color,weight:dashed?4:6,opacity:.95,dashArray:dashed?'3 8':null,lineCap:'round'}).addTo(journeyLayers);};
 if(option.kind==='bus'){
  const c=option.candidate;addLine(c.rideGeometry,c.route.color);
  if(option.approach?.available)addLine(option.approach.geometry,'#4d7ac7',true);
  if(option.egress?.available)addLine(option.egress.geometry,'#4d7ac7',true);
  for(const [point,label] of [[c.board,t('boardAt')],[c.alight,t('alightAt')]])L.circleMarker([point.lat,point.lng],{className:'journey-stop',radius:7,color:'#fff',weight:3,fillColor:c.route.color,fillOpacity:1}).addTo(journeyLayers).bindPopup(label+'<br>'+escapeHTML(point.name));
 }else{if(activePolyline)activePolyline.setStyle({opacity:.12});addLine(option.route.geometry,option.kind==='walk'?'#4e7fc9':'#367de1',option.kind==='walk');}
 const coords=[navState.endpoints.start,navState.endpoints.end].map(p=>[p.lat,p.lng]);journeyLayers.eachLayer(layer=>{if(layer.getBounds){const b=layer.getBounds();coords.push([b.getSouth(),b.getWest()],[b.getNorth(),b.getEast()]);}});navState.bounds=L.latLngBounds(coords);$('fit-route').hidden=false;renderEndpoints();fitJourney();
}
function localizedStep(step,arrivalPlace=placeName(navState.endpoints.end)){const m=step.maneuver||{},road=step.name||t('road');if(m.type==='depart')return t('startFrom',{place:road});if(m.type==='arrive')return t('arriveAt',{place:arrivalPlace});if(String(m.type).includes('roundabout')||String(m.type).includes('rotary'))return t('roundabout',{road});const turns={'left':'left','right':'right','slight left':'slightLeft','slight right':'slightRight','sharp left':'sharpLeft','sharp right':'sharpRight','uturn':'uturn'};return turns[m.modifier]?t('turnOn',{turn:t(turns[m.modifier]),road}):t('continueOn',{road});}
function itineraryHTML(option){
 if(option.kind==='bus'){
  const c=option.candidate,a=option.approach,b=option.egress;
  const segment=(icon,title,desc)=>'<li><span class="leg-icon">'+icon+'</span><div><strong>'+escapeHTML(title)+'</strong><small>'+escapeHTML(desc)+'</small></div></li>';
  let html='<ol class="journey-legs">';
  html+=segment('↟',t('walkTo',{place:c.board.name}),a?.available?formatDistance(a.distanceMeters)+' · '+formatDuration(a.durationSeconds):t(option.loading?'loadingConnections':'connectionsUnavailable'));
  html+=segment(c.route.shortName,t('rideTo',{route:routeName(c.route),place:c.alight.name}),t('estimated')+' '+formatDuration(c.rideDurationSeconds)+' · '+t('segments',{n:c.stops.length-1}));
  html+=segment('↟',t('walkFinish',{place:placeName(navState.endpoints.end)}),b?.available?formatDistance(b.distanceMeters)+' · '+formatDuration(b.durationSeconds):t(option.loading?'loadingConnections':'connectionsUnavailable'));
  html+='</ol><p class="journey-caveat">'+t('busEstimate')+'</p>';
  if(a?.available&&a.steps.length)html+='<details class="walking-steps"><summary>'+t('walkTo',{place:c.board.name})+'</summary>'+stepsHTML(a.steps,c.board.name)+'</details>';
  if(b?.available&&b.steps.length)html+='<details class="walking-steps"><summary>'+t('walkFinish',{place:placeName(navState.endpoints.end)})+'</summary>'+stepsHTML(b.steps)+'</details>';
  return html;
 }
 return '<details class="walking-steps" open><summary>'+t('steps')+'</summary>'+stepsHTML(option.route.steps)+'</details>';
}
function stepsHTML(steps,arrivalPlace){return '<ol class="direction-steps">'+steps.map(step=>'<li><span>'+escapeHTML(localizedStep(step,arrivalPlace))+'</span>'+(step.distanceMeters>0?'<small>'+formatDistance(step.distanceMeters)+'</small>':'')+'</li>').join('')+'</ol>';}
function optionTime(option){if(option.kind!=='bus')return formatDuration(option.route.durationSeconds);if(option.loading)return t('loadingConnections');const a=option.approach,b=option.egress;if(a?.available===false||b?.available===false)return t('connectionsUnavailable');return a?.available&&b?.available?formatDuration(a.durationSeconds+option.candidate.rideDurationSeconds+b.durationSeconds):t('estimated')+' '+formatDuration(option.candidate.estimatedDurationSeconds);}
function renderJourney(){
 const panel=$('journey-panel'),result=$('search-result');if(!panel||!result)return;
 const has=navState.busy||navState.options.length>0||navState.error;panel.hidden=!has;result.hidden=!has;
 $('search-form').setAttribute('aria-busy',String(navState.busy));$('search-form').querySelector('.find-button').disabled=navState.busy;
 if(!has){panel.replaceChildren();result.replaceChildren();document.querySelector('.routes-section').hidden=false;return;}
 const a=navState.endpoints.start,b=navState.endpoints.end;
 if(navState.busy&&!navState.options.length){result.textContent=t('findingRoute');panel.innerHTML='<p class="journey-loading">'+t('findingRoute')+'</p>';return;}
 if(navState.error){result.textContent=t(navState.error);panel.innerHTML='<p class="journey-message">'+t(navState.error)+'</p>'+(a&&b?'<a class="google-link" href="'+escapeHTML(googleDirectionsURL())+'" target="_blank" rel="noopener">'+t('openGoogle')+'</a>':'');return;}
 const active=navState.options[navState.selected];if(!active)return;
 result.innerHTML='<strong>'+escapeHTML(active.kind==='bus'?t('busOption',{route:routeName(active.candidate.route)}):t(active.kind==='drive'?'driveOnly':'walkOnly'))+'</strong><span>'+optionTime(active)+'</span><small>'+t(active.kind==='bus'?'noWait':active.kind==='drive'?'driveEstimate':'estimated')+'</small>';
 document.querySelector('.routes-section').hidden=true;
 panel.innerHTML='<div class="journey-top"><p class="detail-eyebrow">'+t('directionsTitle')+'</p><button type="button" class="journey-back">'+t('journeyBack')+'</button></div><h2>'+escapeHTML(placeName(a))+'<span> → </span>'+escapeHTML(placeName(b))+'</h2>'+(navState.note?'<p class="journey-message">'+t(navState.note)+'</p>':'')+'<div class="journey-choices">'+navState.options.map((option,index)=>'<button type="button" class="journey-choice'+(index===navState.selected?' chosen':'')+'" data-journey="'+index+'"><strong>'+escapeHTML(option.kind==='bus'?routeName(option.candidate.route):t(option.kind==='drive'?'driveOnly':'walkOnly'))+'</strong><span>'+optionTime(option)+'</span>'+(option.kind==='bus'?'<small>'+daySummary(option.candidate.route)+'</small>':'<small>'+formatDistance(option.route.distanceMeters)+'</small>')+'</button>').join('')+'</div>'+itineraryHTML(active)+'<p class="journey-caveat">'+t(active.kind==='bus'?'noWait':active.kind==='drive'?'driveEstimate':'estimated')+'</p><a class="google-link" href="'+escapeHTML(googleDirectionsURL())+'" target="_blank" rel="noopener">'+t('openGoogle')+'</a><p class="journey-credit">'+t('routeSources')+'</p>';
 panel.querySelector('.journey-back').addEventListener('click',()=>{clearJourney();clearRouteSelection();setDrawer(true);});
 panel.querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>loadJourneyOption(+button.dataset.journey).catch(error=>{if(error.name!=='AbortError'){navState.error='routeUnavailable';renderJourney();}})));
}
window.initNavigation=function(){
 journeyLayers=L.featureGroup().addTo(map);endpointLayers=L.featureGroup().addTo(map);userLayers=L.featureGroup().addTo(map);
 const panel=document.createElement('section');panel.id='journey-panel';panel.className='journey-panel';panel.hidden=true;document.querySelector('.sidebar-scroll').prepend(panel);
 for(const field of ['start','end']){
  const input=$(field+'-stop'),box=$(field+'-suggestions');navState.fields[field]={input,box,items:[],index:-1,timer:null,generation:0,controller:null};
  input.addEventListener('input',()=>invalidateInput(field));input.addEventListener('focus',()=>{closeSuggestions(field==='start'?'end':'start');updateSuggestions(field);selectImplicitOriginText(field);});
  input.addEventListener('click',()=>selectImplicitOriginText(field));
  input.addEventListener('blur',()=>setTimeout(()=>{if(document.activeElement!==input)closeSuggestions(field);},100));
  input.addEventListener('keydown',event=>{const f=navState.fields[field];if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(box.hidden)updateSuggestions(field);focusOption(field,f.index+(event.key==='ArrowDown'?1:-1));}else if(event.key==='Escape'){event.preventDefault();closeSuggestions(field);}else if(event.key==='Enter'&&!box.hidden){event.preventDefault();const exact=localPlaceMatches(input.value).find(p=>[p.name,...(p.aliases||[])].some(alias=>normalized(alias)===normalized(input.value)));const choice=f.index>=0?f.items[f.index]:exact||f.items.find(p=>!['location','pick'].includes(p.type));if(choice)chooseSuggestion(field,choice);}});
 }
 $('search-form').addEventListener('submit',searchJourney);
 $('swap-stops').addEventListener('click',()=>{
  cancelMapPick();navState.endpointVersion.start++;navState.endpointVersion.end++;
  const start=navState.endpoints.start,end=navState.endpoints.end,rawStart=$('start-stop').value,rawEnd=$('end-stop').value;
  navState.endpoints.start=end?{...end,implicit:false}:null;navState.endpoints.end=start?{...start,implicit:false}:null;
  $('start-stop').value=end?placeName(end):rawEnd;$('end-stop').value=start?placeName(start):rawStart;
  clearJourney();renderEndpoints();
 });
 $('locate-me').addEventListener('click',()=>locateUser(true));
 document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{navState.mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(navState.endpoints.end&&($('start-stop').value.trim()||navState.location))searchJourney();}));
 map.on('click',event=>{if(!navState.picking)return;const field=navState.picking;navState.picking=null;$('map').classList.remove('picking-location');$('location-status').hidden=true;navState.locationMessage=null;setEndpoint(field,{id:'map-'+Date.now(),type:'map',name:'',lat:event.latlng.lat,lng:event.latlng.lng});});
 // Request once on page open; the browser owns the permission decision.
 requestStartupLocation();
 window.addEventListener('pagehide',()=>{if(navState.watch!==null)navigator.geolocation.clearWatch(navState.watch);});
};
window.LeHighNavigation={translate:translateNavigation,render:renderJourney,clearJourney,fit:fitJourney,hasJourney:()=>Boolean(navState.bounds)};
