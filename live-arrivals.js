/* Stop arrival predictions from Lehigh's public Passio GO feed.
 * Source/request schema verified against Passio queryStopEta, 2026-10-19.
 * Countdown values come from the provider; vehicle speed/distance is never used.
 */
(function(root){
 'use strict';
 const SOURCE='https://lehigh.passiogo.com/';
 const ENDPOINT='https://passiogo.com/mapGetData.php';
 const POLL_MS=20000,STALE_SECONDS=180,TIMEOUT_MS=12000;
 const eastern=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 const labels={
  en:{idle:'Select a stop to check the next bus.',loading:'Checking the next bus…',active:'Next bus: {eta}',arriving:'Bus arriving · reported by Passio GO',due:'Prediction due · checking for an update',empty:'No live arrival prediction for this stop.',stale:'Arrival prediction is outdated. Check Passio GO.',error:'Live arrivals are temporarily unavailable.',paused:'Live arrivals paused while this page is hidden.',minute:'{n} min',underMinute:'<1 min',source:'Lehigh Passio GO estimate'},
  es:{idle:'Elige una parada para consultar el próximo autobús.',loading:'Consultando el próximo autobús…',active:'Próximo autobús: {eta}',arriving:'Autobús llegando · informado por Passio GO',due:'Hora estimada alcanzada · buscando una actualización',empty:'No hay una predicción en vivo para esta parada.',stale:'La predicción está desactualizada. Consulta Passio GO.',error:'Las llegadas en vivo no están disponibles por ahora.',paused:'Llegadas en pausa mientras la página está oculta.',minute:'{n} min',underMinute:'<1 min',source:'Estimación de Lehigh Passio GO'},
  zh:{idle:'选择站点后查看下一班公交。',loading:'正在查询下一班公交…',active:'下一班：{eta}',arriving:'公交即将到站 · Passio GO 上报',due:'预计到站时间已到 · 正在等待更新',empty:'该站点暂无实时到站预测。',stale:'到站预测已过期，请查看 Passio GO。',error:'暂时无法获取实时到站信息。',paused:'页面隐藏期间暂停更新到站信息。',minute:'{n} 分钟',underMinute:'少于 1 分钟',source:'理海 Passio GO 预测'}
 };
 function number(value){return value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))?Number(value):null;}
 function enabled(value){return value===true||value===1||value==='1';}
 function selectionOf(value){
  if(!value||!/^\d+$/.test(String(value.routeId||''))||!/^\d+$/.test(String(value.stopId||'')))return null;
  let position=null;
  if(value.position!==undefined&&value.position!==null&&value.position!==''){
   position=number(value.position);if(position===null||!Number.isInteger(position)||position<0)return null;
  }
  return {routeId:String(value.routeId),stopId:String(value.stopId),position};
 }
 function selectionKey(selection){return selection?[selection.routeId,selection.stopId,selection.position??''].join(':'):'';}
 // Passio's dated feed clocks are Eastern wall time. Never parse them in the
 // visitor's timezone; explicit timezone strings are handled as timestamps.
 function providerTime(value,reference=Date.now()){
  if(typeof value!=='string')return null;
  if(/(?:Z|[+-]\d\d:\d\d)$/i.test(value)){const result=Date.parse(value);return Number.isFinite(result)?result:null;}
  const match=value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2}):(\d{2})(?:\s*([AP]M))?$/i);
  if(!match)return null;
  let hour=Number(match[4]);const minute=Number(match[5]),second=Number(match[6]);
  if(minute>59||second>59||hour>23||match[7]&&(hour<1||hour>12))return null;
  if(match[7])hour=hour%12+(match[7].toUpperCase()==='PM'?12:0);
  const parts={year:Number(match[1]),month:Number(match[2]),day:Number(match[3]),hour,minute,second};
  const wall=Date.UTC(parts.year,parts.month-1,parts.day,hour,minute,second);
  const candidates=[4,5].map(offset=>wall+offset*3600000).filter(candidate=>{
   const actual={};eastern.formatToParts(new Date(candidate)).forEach(part=>{actual[part.type]=Number(part.value);});
   return Object.keys(parts).every(key=>parts[key]===actual[key]);
  });
  return candidates.length?candidates.sort((a,b)=>Math.abs(a-reference)-Math.abs(b-reference))[0]:null;
 }
 function epochTime(value){const result=number(value);return result!==null&&result>0?result<100000000000?result*1000:result:null;}
 function hasProviderError(error){return Array.isArray(error)?error.length>0:error!==null&&error!==undefined&&error!==''&&error!==false&&error!==0;}
 function normalizeResponse(payload,value,receivedAt=Date.now()){
  const selection=selectionOf(value);
  if(!selection||!payload||!payload.ETAs||typeof payload.ETAs!=='object'||Array.isArray(payload.ETAs))throw new Error('Invalid Passio arrival response');
  const rows=payload.ETAs[selection.stopId]??[];
  if(!Array.isArray(rows))throw new Error('Invalid Passio stop arrivals');
  const feedAt=providerTime(payload.time,receivedAt),feedAge=feedAt===null?null:Math.max(0,(receivedAt-feedAt)/1000);
  const feedInvalid=feedAt!==null&&(feedAge>=STALE_SECONDS||feedAt-receivedAt>120000);
  let staleCount=feedInvalid?1:0;const arrivals=[];
  for(const row of rows){
   if(!row||typeof row!=='object')continue;
   const stop=row.theStop||{};
   if(String(row.routeId)!==selection.routeId||stop.routeId!=null&&String(stop.routeId)!==selection.routeId)continue;
   if(row.stopId!=null&&String(row.stopId)!==selection.stopId||stop.stopId!=null&&String(stop.stopId)!==selection.stopId)continue;
   if(row.userId!=null&&String(row.userId)!=='1090'||stop.userId!=null&&String(stop.userId)!=='1090')continue;
   if(selection.position!==null&&number(stop.position)!==selection.position)continue;
   if(enabled(row.OOS)||enabled(row.outOfService)||hasProviderError(row.error))continue;
   const createdAt=providerTime(row.created,receivedAt),sourceAt=feedAt??createdAt;
   // A successful HTTP response can still contain an old or unverifiable feed.
   const oldestAt=feedAt!==null&&createdAt!==null?Math.min(feedAt,createdAt):sourceAt;
   if(enabled(row.outdated)||feedInvalid||oldestAt===null||receivedAt-oldestAt>=STALE_SECONDS*1000||oldestAt-receivedAt>120000||createdAt!==null&&createdAt-receivedAt>120000){staleCount++;continue;}
   const reportedArriving=enabled(row.arrived)||/^(?:arriving|arrived|at stop)\b/i.test(String(row.eta||'').trim());
   let arrivalAt=epochTime(row.arrivalTimestamp)??epochTime(row.etaUtc);
   const secondsSpent=number(row.secondsSpent);
   if(arrivalAt===null&&secondsSpent!==null&&secondsSpent>=0)arrivalAt=sourceAt+secondsSpent*1000;
   if(arrivalAt===null&&!reportedArriving)continue;
   // Already-passed predictions stay predictions. Only the provider can report
   // an arriving bus; crossing zero on a local timer cannot establish arrival.
   arrivals.push({arrivalAt,arriving:reportedArriving,sourceAt:oldestAt,receivedAt,secondsSpent,
    routeId:selection.routeId,stopId:selection.stopId,position:selection.position,source:SOURCE});
  }
  arrivals.sort((a,b)=>Number(b.arriving)-Number(a.arriving)||(a.arrivalAt??Infinity)-(b.arrivalAt??Infinity));
  return {selection,arrivals,staleCount,receivedAt,feedAt,source:SOURCE};
 }
 function create(options={}){
  const documentRef=options.document||root.document,fetchImpl=options.fetch||(root.fetch&&root.fetch.bind(root));
  if(typeof fetchImpl!=='function')throw new Error('Live arrivals require fetch');
  const now=options.now||(()=>Date.now()),setTimer=options.setTimeout||setTimeout,clearTimer=options.clearTimeout||clearTimeout;
  const Abort=options.AbortController||root.AbortController||AbortController;
  let selected=null,normalized=null,version=0,pollTimer=null,tickTimer=null,requestTimer=null,controller=null,pending=null,destroyed=false;
  let status={state:'idle',selection:null,seconds:null,arriving:false,receivedAt:null,message:'',source:SOURCE,errorReason:null};
  const hidden=()=>documentRef?.hidden===true;
  function local(key,variables={}){const language=options.getLanguage?.(),table=labels[language]||labels.en;return (table[key]||key).replace(/\{(\w+)\}/g,(_,name)=>variables[name]??'');}
  function snapshot(){return {...status,selection:status.selection?{...status.selection}:null};}
  function emit(changes={},notify=true){
   status={...status,...changes};
   const key=status.arriving&&status.state==='active'?'arriving':status.state;
   const eta=status.seconds!==null?(status.seconds<60?local('underMinute'):local('minute',{n:Math.ceil(status.seconds/60)})):'';
   status.message=local(key,{eta});status.label=status.arriving&&status.state==='active'?local('arriving'):status.state==='active'?eta:local(status.state);
   status.sourceLabel=local('source');
   if(notify&&typeof options.onStatus==='function')options.onStatus(snapshot());
   return snapshot();
  }
  function updateFreshness(notify=true){
   if(!normalized||hidden()||destroyed)return emit({},notify);
   const fresh=normalized.arrivals.filter(row=>now()-row.sourceAt<STALE_SECONDS*1000&&now()-row.receivedAt<STALE_SECONDS*1000);
   const row=fresh[0];
   if(!row)return emit({state:normalized.staleCount+normalized.arrivals.length?'stale':'empty',seconds:null,arriving:false,arrivalAt:null},notify);
   const seconds=row.arrivalAt===null?0:Math.max(0,Math.ceil((row.arrivalAt-now())/1000));
   return emit({state:!row.arriving&&row.arrivalAt<=now()?'due':'active',seconds,arriving:row.arriving,arrivalAt:row.arrivalAt},notify);
  }
  function cancelTimers(){for(const timer of [pollTimer,tickTimer,requestTimer])if(timer!==null)clearTimer(timer);pollTimer=tickTimer=requestTimer=null;}
  function cancelRequest(){controller?.abort();controller=null;pending=null;}
  function tick(){tickTimer=null;if(!selected||hidden()||destroyed)return;updateFreshness();tickTimer=setTimer(tick,1000);}
  function schedule(){
   if(!selected||hidden()||destroyed)return;
   if(pollTimer!==null)clearTimer(pollTimer);
   pollTimer=setTimer(()=>{pollTimer=null;refresh();},POLL_MS);
   if(tickTimer===null)tickTimer=setTimer(tick,1000);
  }
  function refresh(){
   if(destroyed||!selected||hidden())return Promise.resolve(null);
   if(pending)return pending;
   const capturedVersion=version,selection={...selected},abort=new Abort();controller=abort;
   if(!normalized)emit({state:'loading',seconds:null,arriving:false,arrivalAt:null,errorReason:null});
   let timedOut=false;
   const aborted=new Promise((_,reject)=>abort.signal.addEventListener('abort',()=>reject(new Error('Arrival request aborted')),{once:true}));
   // Selection may be cleared before the deferred request begins.
   aborted.catch(()=>{});
   const timeout=setTimer(()=>{timedOut=true;abort.abort();},TIMEOUT_MS);requestTimer=timeout;
   // Deferring the request ensures pending is assigned even if fetch throws.
   const task=Promise.resolve().then(async()=>{
    try{
     if(capturedVersion!==version||destroyed||hidden()||abort.signal.aborted)return null;
     const query=new URLSearchParams({eta:'3',stopIds:selection.stopId,routeId:selection.routeId,userId:'1090'});
     if(selection.position>0)query.set('position',String(selection.position));
     const request=Promise.resolve().then(()=>fetchImpl(ENDPOINT+'?'+query.toString(),{method:'GET',headers:{Accept:'application/json'},signal:abort.signal,credentials:'omit',cache:'no-store'})).then(response=>{
      if(!response.ok)throw new Error('HTTP '+response.status);
      return response.json();
     });
     const payload=await Promise.race([request,aborted]);
     if(capturedVersion!==version||destroyed||hidden()||selectionKey(selection)!==selectionKey(selected))return null;
     normalized=normalizeResponse(payload,selection,now());
     status={...status,receivedAt:normalized.receivedAt,errorReason:null};
     return updateFreshness();
    }catch(error){
     if(capturedVersion!==version||destroyed||hidden())return null;
     normalized=null;
     return emit({state:'error',seconds:null,arriving:false,arrivalAt:null,errorReason:timedOut?'timeout':'network'});
    }finally{
     clearTimer(timeout);
     if(capturedVersion===version&&!destroyed){controller=null;pending=null;requestTimer=null;schedule();}
    }
   });
   pending=task;return task;
  }
  function clear(){
   version++;cancelTimers();cancelRequest();selected=null;normalized=null;
   return emit({state:'idle',selection:null,seconds:null,arriving:false,arrivalAt:null,receivedAt:null,errorReason:null});
  }
  function selectStop(value){
   if(destroyed)return Promise.resolve(null);
   const next=selectionOf(value);if(!next){clear();return Promise.resolve(null);}
   if(selectionKey(selected)===selectionKey(next)){emit();return pending||Promise.resolve(snapshot());}
   version++;cancelTimers();cancelRequest();selected=next;normalized=null;
   emit({state:hidden()?'paused':'loading',selection:{...next},seconds:null,arriving:false,arrivalAt:null,receivedAt:null,errorReason:null});
   return hidden()?Promise.resolve(snapshot()):refresh();
  }
  function visibility(){
   if(destroyed||!selected)return;
   version++;cancelTimers();cancelRequest();normalized=null;
   emit({state:hidden()?'paused':'loading',seconds:null,arriving:false,arrivalAt:null,receivedAt:null,errorReason:null});
   if(!hidden())refresh();
  }
  documentRef?.addEventListener('visibilitychange',visibility);emit();
  return {selectStop,clear,refresh,translate(){return normalized?updateFreshness():emit();},getSnapshot(){return normalized?updateFreshness(false):snapshot();},
   destroy(){if(destroyed)return;clear();destroyed=true;documentRef?.removeEventListener('visibilitychange',visibility);},source:SOURCE};
 }
 root.LeHighLiveArrivals={create,normalizeResponse,providerTime,source:SOURCE,pollIntervalMs:POLL_MS,staleAfterSeconds:STALE_SECONDS};
})(typeof window!=='undefined'?window:globalThis);
