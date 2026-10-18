/* Live vehicle positions for the explicitly selected Lehigh route only.
 * Public source: https://lehigh.passiogo.com/ . Request/record schema verified
 * against https://passiogo.com/index.js and /js/drawBusMarkers.js, 2026-10-17.
 * No credentials, rider coordinates, ETA prediction or fabricated bus movement.
 */
(function(root){
 'use strict';
 const SOURCE='https://lehigh.passiogo.com/';
 const ENDPOINT='https://passiogo.com/mapGetData.php?getBuses=1&speed=1';
 const ROUTES={
  'packer-express':{passioId:'26305',shortName:'PE',color:'#bc945b',name:'Packer Express'},
  'mountaintop-connector':{passioId:'53045',shortName:'MC',color:'#FED141',name:'Mountaintop Connector'},
  'goodman-connector':{passioId:'53048',shortName:'GC',color:'#653819',name:'Goodman Connector'},
  'campus-connector':{passioId:'53054',shortName:'CC',color:'#b4bc00',name:'Campus Connector'}
 };
 const POLL_MS=20000,STALE_SECONDS=180,TIMEOUT_MS=12000;
 const clock=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const text={
  en:{idle:'Select a route to show its live buses.',loading:'Checking live buses…',empty:'No active buses are being reported for this route.',stale:'Vehicle locations are outdated; check Passio GO.',error:'Live bus positions are temporarily unavailable.',paused:'Live bus updates paused while this page is hidden.',active:'{n} live bus{plural}',refresh:'Refreshed {age}',report:'GPS report {time} ET · minute precision',unknownReport:'GPS report time not provided',justNow:'just now',seconds:'{n}s ago',minutes:'{n} min ago',vehicle:'Vehicle',source:'Source: Lehigh Passio GO',notEta:'Reported GPS position · not an arrival prediction'},
  es:{idle:'Elige una ruta para ver sus autobuses.',loading:'Buscando autobuses…',empty:'No se informan vehículos activos en esta ruta.',stale:'Ubicaciones antiguas; consulta Passio GO.',error:'Posiciones en vivo no disponibles por ahora.',paused:'Actualizaciones en pausa mientras la página está oculta.',active:'{n} en servicio',refresh:'Actualizado {age}',report:'GPS {time} · hora del este, precisión de un minuto',unknownReport:'Hora de GPS no disponible',justNow:'ahora',seconds:'hace {n} s',minutes:'hace {n} min',vehicle:'Vehículo',source:'Fuente: Lehigh Passio GO',notEta:'Posición GPS informada · no es una predicción de llegada'},
  zh:{idle:'选择线路后显示该线路的实时公交。',loading:'正在获取实时公交…',empty:'该线路目前没有上报运行中的车辆。',stale:'车辆定位已过期，请查看 Passio GO。',error:'实时公交定位暂时无法获取。',paused:'页面隐藏期间暂停更新公交位置。',active:'{n} 辆实时公交',refresh:'{age}刷新',report:'GPS 上报 {time}（美东时间，精确到分钟）',unknownReport:'未提供 GPS 上报时间',justNow:'刚刚',seconds:'{n} 秒前',minutes:'{n} 分钟前',vehicle:'车辆',source:'来源：理海 Passio GO',notEta:'车辆上报的 GPS 位置 · 非到站预测'}
 };
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function languageOf(getLanguage){const language=getLanguage?.();return ['en','es','zh'].includes(language)?language:'en';}
 function msg(language,key,variables={}){return (text[language][key]||key).replace(/\{(\w+)\}/g,(_,name)=>variables[name]??'');}
 function parseClock(label){
  const value=String(label||'').trim(),match=value.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
  if(!match)return null;let hour=Number(match[1]),minute=Number(match[2]);
  if(minute>59||hour>23||match[3]&&(hour<1||hour>12))return null;
  if(match[3])hour=hour%12+(match[3].toUpperCase()==='PM'?12:0);
  return hour*60+minute;
 }
 function easternMinute(now){const values={};clock.formatToParts(new Date(now)).forEach(part=>{values[part.type]=part.value;});return Number(values.hour)*60+Number(values.minute);}
 function ageAtFetch(label,receivedAt){
  const minute=parseClock(label);if(minute===null)return null;
  let difference=easternMinute(receivedAt)-minute;
  // At most two minutes ahead can be clock skew. Older times cross midnight.
  if(difference<0&&difference>=-2)return 0;
  if(difference<0)difference+=1440;
  return difference*60;
 }
 function resolveRoute(value){
  if(!value)return null;
  if(typeof value==='object'){
   const found=Object.entries(ROUTES).find(([slug,route])=>slug===value.id||route.passioId===String(value.passioId));
   return found?{id:found[0],...found[1],...value,passioId:found[1].passioId}:null;
  }
  const found=Object.entries(ROUTES).find(([slug,route])=>slug===value||route.passioId===String(value));
  return found?{id:found[0],...found[1]}:null;
 }
 function normalizeResponse(payload,routeValue,receivedAt=Date.now()){
  const route=resolveRoute(routeValue);
  if(!route||!payload||typeof payload.buses!=='object'||payload.buses===null)throw new Error('Invalid Passio vehicle response');
  const vehicles=[];let staleCount=0;
  for(const [deviceKey,records] of Object.entries(payload.buses)){
   // Official renderer uses the first position, rather than historical points.
   const row=Array.isArray(records)?records[0]:records;if(!row||typeof row!=='object')continue;
   if(String(row.routeId)!==route.passioId||row.userId!=null&&String(row.userId)!=='1090'||Number(row.outOfService)===1)continue;
   const lat=Number(row.correctedLatitude||row.latitude),lng=Number(row.correctedLongitude||row.longitude);
   if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||lat===0||lng===0)continue;
   const gpsTimeLabel=String(row.createdTime||row.created||'').trim();
   const reportAgeSeconds=ageAtFetch(gpsTimeLabel,receivedAt);
   const stale=Number(row.outdated)===1||reportAgeSeconds!==null&&reportAgeSeconds>=STALE_SECONDS;
   if(stale){staleCount++;continue;}
   vehicles.push({id:String(row.deviceId??deviceKey)+':'+String(row.busId??''),deviceId:String(row.deviceId??deviceKey),
    busId:row.busId!=null?String(row.busId):'',label:String(row.busName||row.bus||route.shortName).trim(),
    routeId:route.passioId,lat,lng,course:Number.isFinite(Number(row.calculatedCourse))?Number(row.calculatedCourse):null,
    gpsTimeLabel,reportTimePrecision:gpsTimeLabel?'minute':'unknown',reportAgeSeconds,
    // The feed only supplies a wall-clock minute, not a dated GPS timestamp.
    updatedAt:null,receivedAt,source:SOURCE});
  }
  return {vehicles,staleCount,receivedAt,sourceClockLabel:String(payload.time?.['1090']||'').trim()};
 }
 function create(options){
  const {map,L,getLanguage,onStatus}=options||{};
  if(!map||!L)throw new Error('Live buses require a Leaflet map');
  const documentRef=options.document||root.document;
  const fetchImpl=options.fetch||root.fetch.bind(root),now=options.now||(()=>Date.now());
  const setTimer=options.setTimeout||setTimeout,clearTimer=options.clearTimeout||clearTimeout;
  const layer=L.featureGroup().addTo(map),markers=new Map();
  let selected=null,epoch=0,pollTimer=null,ageTimer=null,controller=null,pending=null,destroyed=false;
  let normalized=null,status={state:'idle',route:null,routeId:null,count:0,receivedAt:null,updatedAt:null,oldestAgeSeconds:null,gpsTimeLabels:[],source:SOURCE,errorReason:null};
  const hidden=()=>documentRef?.hidden===true;
  function local(key,vars){return msg(languageOf(getLanguage),key,vars);}
  function elapsedLabel(seconds){return seconds<10?local('justNow'):seconds<60?local('seconds',{n:Math.floor(seconds)}):local('minutes',{n:Math.floor(seconds/60)});}
  function message(){
   const language=languageOf(getLanguage);let result=msg(language,status.state,{n:status.count,plural:status.count===1?'':'es'});
   if(status.receivedAt&&['active','empty','stale','error'].includes(status.state))result+=' · '+local('refresh',{age:elapsedLabel(Math.max(0,(now()-status.receivedAt)/1000))});
   if(status.state==='active')result+=' · '+(status.gpsTimeLabels.length?local('report',{time:status.gpsTimeLabels.join(', ')}):local('unknownReport'));
   return result;
  }
  function emit(changes={}){status={...status,...changes};status.message=message();if(typeof onStatus==='function')onStatus({...status,gpsTimeLabels:status.gpsTimeLabels.slice()});}
  function clearMarkers(){layer.clearLayers();markers.clear();}
  function cancelTimers(){if(pollTimer!==null)clearTimer(pollTimer);if(ageTimer!==null)clearTimer(ageTimer);pollTimer=ageTimer=null;}
  function cancelRequest(){controller?.abort();controller=null;pending=null;}
  function currentVehicles(){
   if(!normalized)return[];const seconds=Math.max(0,(now()-normalized.receivedAt)/1000);
   return normalized.vehicles.filter(vehicle=>vehicle.reportAgeSeconds===null?seconds<STALE_SECONDS:vehicle.reportAgeSeconds+seconds<STALE_SECONDS);
  }
  function iconFor(route){
   const color=/^#[0-9a-f]{6}$/i.test(route.color||'')?route.color:'#653819';
   const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)),ink=(rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000>160?'#17251f':'#ffffff';
   return L.divIcon({className:'lehigh-live-bus',iconSize:[52,36],iconAnchor:[26,18],popupAnchor:[0,-18],
    html:'<span style="display:flex;align-items:center;justify-content:center;gap:4px;height:32px;min-width:48px;padding:0 5px;background:'+color+';color:'+ink+';border:2px solid white;border-radius:12px;box-shadow:0 2px 9px #0005;font:bold 12px system-ui;box-sizing:border-box"><svg width="18" height="20" viewBox="0 0 24 26" fill="none" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="4" stroke="currentColor" stroke-width="2"/><path d="M4 11h16M8 5h8M7 23v2m10-2v2" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="17" r="1.5" fill="currentColor"/><circle cx="16" cy="17" r="1.5" fill="currentColor"/></svg>'+escape(route.shortName)+'</span>'});
  }
  function popup(vehicle){
   const report=vehicle.gpsTimeLabel?local('report',{time:vehicle.gpsTimeLabel}):local('unknownReport');
   return '<strong>'+escape(selected.shortName+' · '+selected.name)+'</strong><br>'+escape(local('vehicle')+(vehicle.busId?' '+vehicle.busId:''))+'<br>'+escape(report)+'<br><small>'+escape(local('notEta'))+'</small><br><a href="'+SOURCE+'" target="_blank" rel="noopener">'+escape(local('source'))+'</a>';
  }
  function draw(){
   if(!selected||hidden()){clearMarkers();return;}
   const vehicles=currentVehicles(),valid=new Set(vehicles.map(v=>v.id));
   for(const [id,marker] of markers)if(!valid.has(id)){layer.removeLayer(marker);markers.delete(id);}
   for(const vehicle of vehicles){
    let marker=markers.get(vehicle.id);
    if(!marker){marker=L.marker([vehicle.lat,vehicle.lng],{icon:iconFor(selected),title:selected.shortName+' '+local('vehicle'),zIndexOffset:1200}).addTo(layer);markers.set(vehicle.id,marker);}
    else marker.setLatLng([vehicle.lat,vehicle.lng]);
    marker.bindPopup(popup(vehicle));
   }
  }
  function updateFreshness(){
   if(!selected||!normalized||hidden()||destroyed)return;
   const vehicles=currentVehicles(),age=Math.max(0,(now()-normalized.receivedAt)/1000);
   draw();
   const ages=vehicles.map(vehicle=>vehicle.reportAgeSeconds===null?null:vehicle.reportAgeSeconds+age).filter(value=>value!==null);
   const staleCount=normalized.staleCount+normalized.vehicles.length-vehicles.length;
   const nextState=vehicles.length?'active':staleCount?'stale':'empty';
   emit({state:nextState,count:vehicles.length,staleCount,oldestAgeSeconds:ages.length?Math.max(...ages):null,
    gpsTimeLabels:[...new Set(vehicles.map(vehicle=>vehicle.gpsTimeLabel).filter(Boolean))]});
  }
  function ageTick(){
   if(hidden()||!selected||destroyed)return;
   if(status.state!=='error')updateFreshness();else emit();
   ageTimer=setTimer(ageTick,10000);
  }
  function schedule(){
   if(!selected||hidden()||destroyed)return;
   if(pollTimer!==null)clearTimer(pollTimer);
   pollTimer=setTimer(()=>{pollTimer=null;refresh();},POLL_MS);
   if(ageTimer===null)ageTimer=setTimer(ageTick,10000);
  }
  function refresh(){
   if(destroyed||!selected||hidden())return Promise.resolve(null);
   if(pending)return pending;
   const captured=epoch,route=selected,abort=new AbortController();controller=abort;
   if(!normalized)emit({state:'loading',errorReason:null});
   let timedOut=false;const timeout=setTimer(()=>{timedOut=true;abort.abort();},TIMEOUT_MS);
   const task=(async()=>{
    try{
     const body=new URLSearchParams({json:JSON.stringify({s0:'1090',sA:1,rA:1,r0:route.passioId})});
     const response=await fetchImpl(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',Accept:'application/json'},body:body.toString(),signal:abort.signal,credentials:'omit',cache:'no-store'});
     if(!response.ok)throw new Error('HTTP '+response.status);
     const data=await response.json();if(captured!==epoch||destroyed||hidden())return null;
     normalized=normalizeResponse(data,route,now());
     status={...status,receivedAt:normalized.receivedAt,updatedAt:null,errorReason:null};updateFreshness();
     return {...status};
    }catch(error){
     if(captured!==epoch||destroyed||hidden())return null;
     clearMarkers();
     emit({state:'error',count:0,gpsTimeLabels:[],errorReason:timedOut?'timeout':'network'});
     return {...status};
    }finally{
     clearTimer(timeout);
     if(captured===epoch&&!destroyed){controller=null;pending=null;schedule();}
    }
   })();
   pending=task;return task;
  }
  function clear(){
   epoch++;cancelTimers();cancelRequest();clearMarkers();selected=null;normalized=null;
   emit({state:'idle',route:null,routeId:null,count:0,staleCount:0,receivedAt:null,updatedAt:null,oldestAgeSeconds:null,gpsTimeLabels:[],errorReason:null});
  }
  function selectRoute(value){
   if(destroyed)return;
   const route=resolveRoute(value);if(!route){clear();return;}
   if(selected?.passioId===route.passioId){emit();return;}
   epoch++;cancelTimers();cancelRequest();clearMarkers();selected=route;normalized=null;
   emit({state:hidden()?'paused':'loading',route,routeId:route.passioId,count:0,staleCount:0,receivedAt:null,updatedAt:null,oldestAgeSeconds:null,gpsTimeLabels:[],errorReason:null});
   if(!hidden())refresh();
  }
  function visibility(){
   if(destroyed||!selected)return;
   epoch++;cancelTimers();cancelRequest();clearMarkers();
   if(hidden())emit({state:'paused',count:0,gpsTimeLabels:[]});
   else{normalized=null;emit({state:'loading',receivedAt:null,gpsTimeLabels:[],errorReason:null});refresh();}
  }
  documentRef?.addEventListener('visibilitychange',visibility);
  emit();
  return {selectRoute,clear,refresh,translate(){if(status.state==='active')draw();emit();},getSnapshot(){return{...status,gpsTimeLabels:status.gpsTimeLabels.slice()};},
   destroy(){if(destroyed)return;clear();destroyed=true;documentRef?.removeEventListener('visibilitychange',visibility);map.removeLayer(layer);},
   source:SOURCE};
 }
 root.LeHighLiveBuses={create,normalizeResponse,source:SOURCE,pollIntervalMs:POLL_MS,staleAfterSeconds:STALE_SECONDS};
})(typeof window!=='undefined'?window:globalThis);
