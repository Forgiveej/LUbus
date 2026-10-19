'use strict';
const transitData = window.LEHIGH_TRANSIT_DATA;
const schedules = window.LEHIGH_SCHEDULES;
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copy = {
 en: {
  brandSub:'CAMPUS NAVIGATOR',campusRoutes:'Campus routes',today:'Today',todayDate:'Campus time · Eastern',
  planRide:'Where are you headed?',campusOnly:'Campus',from:'From',to:'To',chooseStart:'Choose a departure stop',chooseEnd:'Choose a destination stop',findRoute:'Routes',swap:'Swap departure and destination',fitRoute:'Fit route',
  officialData:'Official routes, thoughtfully mapped',serviceCaveat:'Published Fall 2026 hours. Holiday changes and service alerts may apply. Times shown in Eastern Time.',liveTracking:'Live buses ↗',officialSchedules:'Official schedules ↗',
  dataChecked:'DATA CHECKED · 17 OCT 2026',mapCaption:'LEHIGH UNIVERSITY · ROUTE MAP',weeklySchedule:'WEEKLY SERVICE HOURS',close:'Close schedule',weeklyIntro:'Regular Fall 2026 service · Monday–Sunday · Eastern Time',
  weeklyNote:'“Next day” means after midnight. This is the regular weekly timetable, not live vehicle availability. Holiday and limited-service schedules may differ.',viewOfficial:'View official schedule and holiday changes ↗',
  noService:'No scheduled service',holiday:'No service · holiday',limited:'Limited service',regular:'Regular service',nextDay:'next day',every:'Every {n} min',perBus:'per bus',vehicle:'Bus {n}',after23:'Every 30 min until 23:00; later headway not specified',
  selectedRoute:'EXPLORE THIS ROUTE',stops:'stops',viewStops:'View all {n} stops',viewWeek:'View the full week',todayService:'Today’s service hours',directionNote:'NB = northbound · SB = southbound. Stops follow the published circular route.',
  sameStop:'Choose two different stops.',noMatch:'No direct route matches these directional stops. Check Passio GO for connections.',direct:'Direct route',segments:'{n} stop segments',alternatives:'Also connects',searchNote:'Matches stop order only. Check today’s hours and live buses before travelling.',
  mapMissing:'Map configuration unavailable. Please refresh the page.',mapError:'Basemap unavailable. Check your connection and try again.',
  weekDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  sourceDate:'Stop and route data checked 17 Oct 2026. Official route pages and Passio may differ; this map follows Passio GO.',
  scope:['Asa Packer · Sayre','Asa Packer · Mountaintop','Asa Packer · Goodman','All campuses · Saucon Village'],
  routeNames:['Packer Express','Mountaintop Connector','Goodman Connector','Campus Connector'],
  descriptions:['A circular route around Asa Packer and Sayre. Runs in fall and spring semesters; no summer service.','Connects Asa Packer and Mountaintop, via Building C, Iacocca Hall and ATLSS.','Connects Asa Packer and Goodman, including Goodman Campus Circle and Cundey Varsity House.','Connects Asa Packer, Mountaintop, Goodman and Saucon Village, with separate stops for each direction.']
 },
 zh: {
  brandSub:'校园出行导航',campusRoutes:'校园公交线路',today:'今天',todayDate:'校园时间 · 美国东部',
  planRide:'今天想去哪里？',campusOnly:'校园出行',from:'出发站',to:'到达站',chooseStart:'选择出发站点',chooseEnd:'选择到达站点',findRoute:'路线',swap:'交换出发站和到达站',fitRoute:'查看整条线路',
  officialData:'官方线路，清晰呈现',serviceCaveat:'采用官网 2026 年秋季时刻表；节假日及临时调整以官方公告为准。全部时间为美国东部时间。',liveTracking:'实时车辆 ↗',officialSchedules:'官方时刻表 ↗',
  dataChecked:'数据核查 · 2026-10-17',mapCaption:'理海大学 · 公交线路图',weeklySchedule:'一周运营时间',close:'关闭时间表',weeklyIntro:'2026 年秋季常规班次 · 周一至周日 · 美国东部时间',
  weeklyNote:'“次日”表示跨过午夜后的时间。这里是常规周时刻表，不是实时车辆状态；节假日和缩减运营日可能调整。',viewOfficial:'查看官网时刻表与节假日调整 ↗',
  noService:'无计划班次',holiday:'节假日停运',limited:'缩减运营',regular:'常规运营',nextDay:'次日',every:'约 {n} 分钟一班',perBus:'每辆',vehicle:'车辆 {n}',after23:'23:00 前约 30 分钟一班；之后间隔未注明',
  selectedRoute:'当前线路',stops:'个站点',viewStops:'查看全部 {n} 个站点',viewWeek:'查看一周时间表',todayService:'今日运营时间',directionNote:'NB = 北向，SB = 南向；按官方站序循环，末站接回首站。',
  sameStop:'请选择两个不同的站点。',noMatch:'这两个方向站点之间暂无匹配的直达线路，请通过 Passio GO 查询换乘。',direct:'可直达线路',segments:'{n} 段站间路程',alternatives:'其他直达线路',searchNote:'按站序匹配，不计算实时等车时间；出发前请核对当天时段与实时车辆。',
  mapMissing:'地图配置暂时不可用，请刷新页面。',mapError:'地图底图暂时无法加载，请检查网络后重试。',
  weekDays:['周日','周一','周二','周三','周四','周五','周六'],
  sourceDate:'站点和轨迹核查于 2026-10-17。官网旧线路页与 Passio 存在差异，此地图采用 Passio GO 数据。',
  scope:['Asa Packer · Sayre 校区','主校区 · 山顶校区','主校区 · Goodman 校区','全校区 · Saucon Village'],
  routeNames:['Packer 快线','Mountaintop 接驳线','Goodman 接驳线','全校区接驳线'],
  descriptions:['环绕 Asa Packer 与 Sayre 校区的循环线路。秋、春学期运行，暑期停运。','连接主校区和山顶校区，途经 Building C、Iacocca Hall 和 ATLSS。','连接主校区与 Goodman，服务 Goodman Campus Circle 和 Cundey Varsity House。','连接 Asa Packer、Mountaintop、Goodman 与 Saucon Village，去程与返程分方向设站。']
 }
};
let language='en';
try { language = ['en','es','zh'].includes(localStorage.getItem('lehigh-language-v2')) ? localStorage.getItem('lehigh-language-v2') : 'en'; } catch (_) {}
let basemapLayer;
let map, activePolyline, stopMarkers, activeRoute = null, routeView = null, dialogRoute = null, searchState = null, currentDateKey, liveBuses;
let inactiveRoutesExpanded=false;
const serviceWords={
 en:{running:'Running now',overnight:'Running now · overnight until {time}',upcoming:'Starts today at {time}',finished:'Service finished today',noService:'No service today',holiday:'No service today · holiday',inactive:'Not running now ({n})',stop:'Bus stop',start:'Start here',end:'Go here',stopHint:'Choose this stop as your origin or destination.'},
 zh:{running:'正在运营',overnight:'跨夜班次运营至 {time}',upcoming:'今天 {time} 开始运营',finished:'今日班次已结束',noService:'今天无班次',holiday:'今天停运 · 节假日',inactive:'当前未运营（{n} 条）',stop:'公交站点',start:'设为起点',end:'设为终点',stopHint:'可将此站设为起点或终点。'},
 es:{running:'En servicio ahora',overnight:'Servicio nocturno hasta las {time}',upcoming:'Empieza hoy a las {time}',finished:'Servicio de hoy finalizado',noService:'Sin servicio hoy',holiday:'Sin servicio hoy · festivo',inactive:'Sin servicio ahora ({n})',stop:'Parada de autobús',start:'Salir de aquí',end:'Ir aquí',stopHint:'Elige esta parada como origen o destino.'}
};
function serviceText(key,vars={}){let value=(serviceWords[language]||serviceWords.en)[key]||key;for(const [name,text]of Object.entries(vars))value=value.replace('{'+name+'}',text);return value;}
// Scheduled service, independent of live GPS. Overnight windows retain their start service date.
function getRouteServiceStatus(routeId,value=new Date()){
 const current=schedules.easternParts(value),previous=schedules.shiftDate(current.dateKey,-1);
 const day=schedules.getDaySchedule(routeId,current.dateKey),before=schedules.getDaySchedule(routeId,previous);
 const parse=clock=>/^\d{2}:\d{2}$/.test(clock||'')?Number(clock.slice(0,2))*60+Number(clock.slice(3)):NaN;
 const windows=(source,offset)=>source.windows.map(window=>{
  const start=parse(window.start),end=parse(window.end);
  const extra=Number.isFinite(window.endDayOffset)?window.endDayOffset:(end<=start?1:0);
  return {window,start:start+offset,end:end+extra*1440+offset,dateKey:source.dateKey};
 }).filter(item=>Number.isFinite(item.start)&&Number.isFinite(item.end)&&item.end>item.start);
 const currentWindows=windows(day,0),all=windows(before,-1440).concat(currentWindows);
 const active=all.filter(item=>current.minuteOfDay>=item.start&&current.minuteOfDay<item.end);
 const upcoming=currentWindows.filter(item=>item.start>current.minuteOfDay).sort((a,b)=>a.start-b.start);
 const state=active.length?'running':upcoming.length?'upcoming':currentWindows.length?'finished':'no-service';
 const until=active.length?active.reduce((latest,item)=>item.end>latest.end?item:latest).window.end:null;
 return {state,running:state==='running',dateKey:current.dateKey,minuteOfDay:current.minuteOfDay,kind:day.kind,
  todayWindows:day.windows,activeWindows:active.map(item=>item.window),overnight:active.some(item=>item.dateKey===previous),until,
  nextStart:upcoming[0]?.window.start||null};
}
function routeStatusLabel(status){
 if(status.running)return serviceText(status.overnight?'overnight':'running',{time:status.until});
 if(status.state==='upcoming')return serviceText('upcoming',{time:status.nextStart});
 return serviceText(status.state==='finished'?'finished':status.kind==='no-service'?'holiday':'noService');
}
Object.assign(copy.en,{closeRoute:'Close route',whereTo:'Where to?',searchPlaces:'Search destinations',backToSearch:'Back to destination search',openMenu:'Open campus routes',closeMenu:'Close campus routes',clearRoute:'Clear selected route'});
Object.assign(copy.zh,{closeRoute:'关闭路线',whereTo:'想去哪里？',searchPlaces:'搜索目的地',backToSearch:'返回地点搜索',openMenu:'打开校园线路菜单',closeMenu:'收起校园线路菜单',clearRoute:'取消当前线路'});
function t(key, vars={}) { let value=copy[language]?.[key]??copy.en[key]??key; Object.entries(vars).forEach(([k,v])=>{value=value.replace('{'+k+'}',v);}); return value; }
function routeIndex(route) { return transitData.routes.findIndex(r=>r.id===route.id); }
function routeName(route) { return copy[language].routeNames[routeIndex(route)]; }
function stopName(id) { let name=transitData.stops[id].name; return language==='zh' ? name.replace(/ NB$/,'（北向）').replace(/ SB$/,'（南向）') : language==='es'?name.replace(/ NB$/,' (norte)').replace(/ SB$/,' (sur)'):name; }
function today() { return schedules.getEasternDate(); }
function timeRange(w) { return w.start+' – '+(w.endDayOffset ? t('nextDay')+' ' : '')+w.end; }
function formatWindows(windows, detailed=false) {
 if (!windows.length) return escapeHTML(t('noService'));
 return windows.map(w=>{
  let detail=w.headway ? t('every',{n:w.headway})+(w.vehicle?' · '+t('perBus'):'') : w.noteKey==='lateHeadwayUnspecified'?t('after23'):'';
  return (w.vehicle?'<span class="vehicle-label">'+escapeHTML(t('vehicle',{n:w.vehicle}))+' · </span>':'')+escapeHTML(timeRange(w))+(detailed&&detail?'<span class="frequency">'+escapeHTML(detail)+'</span>':'');
 }).join(detailed?'<br>':'<br>');
}
function daySummary(route,detailed=false) {
 const day=schedules.getDaySchedule(route.id,today());
 if(day.kind==='no-service') return escapeHTML(t('holiday'));
 return (day.kind==='limited'?escapeHTML(t('limited'))+' · ':'')+formatWindows(day.windows,detailed);
}
function dateLabel() {
 const date=new Date(today()+'T12:00:00Z');
 return new Intl.DateTimeFormat(language==='zh'?'zh-CN':language==='es'?'es-US':'en-US',{timeZone:'UTC',month:'short',day:'numeric',weekday:'long'}).format(date);
}
function applyLanguage() {
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 document.title=language==='zh'?'Lehigh Transit · 校园公交导航':language==='es'?'Lehigh Transit · Navegador del campus':'Lehigh Transit · Campus Navigator';
 document.querySelector('.sidebar').setAttribute('aria-label',t('campusRoutes'));
 document.querySelector('.map-workspace').setAttribute('aria-label',t('mapCaption'));
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll('[data-title]').forEach(el=>{el.title=t(el.dataset.title);el.setAttribute('aria-label',t(el.dataset.title));});
 document.querySelectorAll('[data-lang]').forEach(el=>{el.classList.toggle('active',el.dataset.lang===language);el.setAttribute('aria-pressed',String(el.dataset.lang===language));});
 $('today-date').textContent=dateLabel()+' · '+t('todayDate');
 $('menu-toggle').title=t($('menu-toggle').getAttribute('aria-expanded')==='true'?'closeMenu':'openMenu');
 $('menu-toggle').setAttribute('aria-label',$('menu-toggle').title);
 liveBuses?.translate();
 window.LeHighNavigation?.translate(); renderRoutes(); renderDetail(); renderMarkers(); renderChip(); renderSearch();
 if($('schedule-dialog').open&&dialogRoute) renderWeekly(dialogRoute);
 window.LeHighCampusExtras?.translate();
 updateMapStatus();
 map.zoomControl._zoomInButton.title=language==='zh'?'放大':language==='es'?'Acercar':'Zoom in';
 map.zoomControl._zoomOutButton.title=language==='zh'?'缩小':language==='es'?'Alejar':'Zoom out';
 map.zoomControl._zoomInButton.setAttribute('aria-label',map.zoomControl._zoomInButton.title);
 map.zoomControl._zoomOutButton.setAttribute('aria-label',map.zoomControl._zoomOutButton.title);
}
function renderRoutes(value=new Date()) {
 const list=$('route-list'); list.replaceChildren();
 const entries=transitData.routes.map(route=>({route,status:getRouteServiceStatus(route.id,value)}));
 const makeCard=({route,status})=>{
  const li=document.createElement('li'); li.className='route-card'+(activeRoute?.id===route.id?' selected':'');
  li.dataset.serviceState=status.state;
  li.style.setProperty('--route-color',route.color); li.style.setProperty('--badge-ink',route.shortName==='GC'?'#fff':'#3e462f');
  const button=document.createElement('button'); button.type='button';button.className='route-select';button.dataset.routeId=route.id;button.setAttribute('aria-pressed',String(activeRoute?.id===route.id));
  button.innerHTML='<span class="route-badge">'+route.shortName+'</span><span class="route-copy"><strong>'+escapeHTML(routeName(route))+'</strong><span class="route-scope">'+escapeHTML(copy[language].scope[routeIndex(route)])+'</span><span class="route-service-status '+status.state+'">'+escapeHTML(routeStatusLabel(status))+'</span><span class="route-today'+(!status.todayWindows.length?' off':'')+'"><b>'+t('today')+'</b>'+daySummary(route)+'</span></span>';
  button.addEventListener('click',()=>{window.LeHighNavigation?.clearJourney();selectRoute(route);});
  const info=document.createElement('button');info.type='button';info.className='schedule-info';info.textContent='i';info.setAttribute('aria-label',routeName(route)+' · '+t('weeklySchedule'));info.title=t('viewWeek');info.dataset.scheduleId=route.id;
  info.addEventListener('click',()=>showWeekly(route));li.append(button,info);return li;
 };
 entries.filter(item=>item.status.running).forEach(entry=>list.append(makeCard(entry)));
 const inactive=entries.filter(item=>!item.status.running);
 if(inactive.length){
  const group=document.createElement('li');group.className='inactive-routes-group';
  const details=document.createElement('details');details.className='inactive-routes';details.open=inactiveRoutesExpanded;
  const summary=document.createElement('summary');summary.textContent=serviceText('inactive',{n:inactive.length});
  const nested=document.createElement('ul');nested.className='route-list inactive-route-list';inactive.forEach(entry=>nested.append(makeCard(entry)));
  details.addEventListener('toggle',()=>{inactiveRoutesExpanded=details.open;});details.append(summary,nested);group.append(details);list.append(group);
 }
}
function renderChip() {
 const chip=document.querySelector('.map-route-chip');chip.hidden=!activeRoute;
 $('fit-route').hidden=!activeRoute&&!window.LeHighNavigation?.hasJourney();
 if(!activeRoute){$('chip-title').textContent='';$('live-status').textContent='';return;}
 $('chip-title').textContent=activeRoute.shortName+' · '+routeName(activeRoute);$('chip-dot').style.background=activeRoute.color;
}
function renderDetail() {
 const route=activeRoute;
 $('display-area').hidden=!route||routeView==='journey';
 if(!route){$('display-area').replaceChildren();return;}
 $('display-area').innerHTML='<p class="detail-eyebrow">'+t('selectedRoute')+'</p><div class="detail-heading"><h2>'+escapeHTML(routeName(route))+'</h2><span class="detail-count">'+route.stops.length+' '+t('stops')+'</span></div><p class="detail-description">'+escapeHTML(copy[language].descriptions[routeIndex(route)])+'</p><div class="detail-schedule"><strong>'+t('todayService')+'</strong>'+daySummary(route,true)+'<br><button type="button" class="inline-week">'+t('viewWeek')+' ↗</button></div><details class="stops-disclosure"><summary>'+t('viewStops',{n:route.stops.length})+'</summary><ol class="stop-sequence">'+route.stops.map(id=>'<li><button type="button" class="stop-list-button" data-stop-id="'+escapeHTML(id)+'">'+escapeHTML(stopName(id))+'</button></li>').join('')+'</ol><p class="direction-note">'+t('directionNote')+'</p></details>';
 $('display-area').querySelector('.inline-week').addEventListener('click',()=>showWeekly(route));
 $('display-area').querySelectorAll('.stop-list-button').forEach(button=>button.addEventListener('click',()=>openStop(button.dataset.stopId,{route,focusMap:true})));
}
function setDrawer(open) {
 const sidebar=document.querySelector('.sidebar');sidebar.classList.toggle('open',open);
 document.querySelector('.app-shell').classList.toggle('drawer-open',open);
 $('sidebar-content').hidden=!open;$('menu-toggle').setAttribute('aria-expanded',String(open));
 $('menu-toggle').title=t(open?'closeMenu':'openMenu');$('menu-toggle').setAttribute('aria-label',$('menu-toggle').title);
 requestAnimationFrame(()=>{map.invalidateSize({animate:false});fitRoute();});
}
function mapViewPadding(){
 const width=$('map').clientWidth,height=$('map').clientHeight,mobile=window.innerWidth<=760;
 const drawerOpen=$('menu-toggle').getAttribute('aria-expanded')==='true';
 const planner=$('search-form'),rect=planner?.getBoundingClientRect?.();
 const expanded=planner?.classList.contains('directions');
 if((expanded||planner?.classList.contains('route-results'))&&rect){
  if(!mobile)return {paddingTopLeft:[Math.min(rect.right+22,Math.max(40,width-240)),85],paddingBottomRight:[30,40]};
  return {paddingTopLeft:[20,Math.min(rect.bottom+16,Math.max(80,height-180))],paddingBottomRight:[20,30]};
 }
 if(mobile)return {paddingTopLeft:[20,220],paddingBottomRight:[20,30]};
 return {paddingTopLeft:[drawerOpen?380:35,110],paddingBottomRight:[30,45]};
}
function clearRouteSelection(){
 if(activePolyline)map.removeLayer(activePolyline);activePolyline=null;activeRoute=null;routeView=null;
 stopMarkers.clearLayers();liveBuses?.clear();renderRoutes();renderDetail();renderChip();
}
function selectRoute(route,fit=true,{journey=false}={}) {
 if(!route){clearRouteSelection();return;}
 activeRoute=route;routeView=journey?'journey':'browse';renderRoutes();renderDetail();renderChip();
 if(activePolyline)map.removeLayer(activePolyline);activePolyline=null;
 if(!journey)activePolyline=L.polyline(route.path,{color:route.color,weight:5,opacity:.9,lineCap:'round'}).addTo(map);
 renderMarkers();liveBuses?.selectRoute(route);
 if(fit)fitRoute();
}
function fitRoute() {
 if(window.LeHighNavigation?.fit())return;
 if(!activePolyline)return;
 map.fitBounds(activePolyline.getBounds(),{...mapViewPadding(),maxZoom:16,animate:false});
}
function stopPlace(value){
 const key=String(typeof value==='object'?(value?.stopId??value?.id??''):value??'').replace(/^stop-/,'');
 const source=transitData.stops[key]||(value&&typeof value==='object'?value:null);
 if(!source||!Number.isFinite(source.lat)||!Number.isFinite(source.lng)||Math.abs(source.lat)>90||Math.abs(source.lng)>180)return null;
 return {id:'stop-'+key,stopId:key,type:'stop',name:transitData.stops[key]?stopName(key):String(source.name||serviceText('stop')),lat:source.lat,lng:source.lng};
}
function selectStop(field,value){
 const place=stopPlace(value);if(!place||!['start','end'].includes(field))return;
 map.closePopup();window.LeHighCampusExtras?.closePanels?.();window.LeHighNavigation?.selectPlace(field,place);
}
function createStopPopup(value,{route,label}={}){
 const place=stopPlace(value),container=document.createElement('div');container.className='transit-stop-info';
 if(!place)return container;
 const title=document.createElement('strong');title.className='transit-stop-title';title.textContent=place.name;container.append(title);
 const subtitle=document.createElement('p');subtitle.className='transit-stop-route';subtitle.textContent=[label,route?route.shortName+' · '+routeName(route):serviceText('stop')].filter(Boolean).join(' · ');container.append(subtitle);
 const hint=document.createElement('p');hint.className='transit-stop-hint';hint.textContent=serviceText('stopHint');container.append(hint);
 const actions=document.createElement('div');actions.className='transit-stop-actions';
 for(const field of ['start','end']){const button=document.createElement('button');button.type='button';button.textContent=serviceText(field);button.dataset.stopField=field;button.addEventListener('click',event=>{event.stopPropagation();selectStop(field,value);});actions.append(button);}
 container.append(actions);L.DomEvent?.disableClickPropagation?.(container);L.DomEvent?.disableScrollPropagation?.(container);return container;
}
function openStop(value,options={}){
 const place=stopPlace(value);if(!place||!map)return;
 if(options.focusMap)map.setView([place.lat,place.lng],Math.max(16,map.getZoom?.()||16),{animate:false});
 L.popup({className:'transit-stop-popup',maxWidth:310}).setLatLng([place.lat,place.lng]).setContent(createStopPopup(value,options)).openOn(map);
}
function bindStopMarker(marker,value,options={}){
 const place=stopPlace(value);if(!place)return marker;
 marker.options.bubblingMouseEvents=false;marker.unbindPopup?.();
 marker.bindTooltip(escapeHTML(place.name),{direction:'top',offset:[0,-7]});
 const activate=event=>{
  event.lehighStopSelected=true;if(event.originalEvent){event.originalEvent.lehighStopSelected=true;event.originalEvent.stopPropagation?.();L.DomEvent?.stopPropagation?.(event.originalEvent);}
  if(window.LeHighNavigation?.isPicking?.()){map.fire?.('click',{latlng:{lat:place.lat,lng:place.lng},originalEvent:event.originalEvent});return;}
  openStop(value,options);
 };
 marker.on('click',activate);
 const element=marker.getElement?.();if(element){element.setAttribute('role','button');element.setAttribute('tabindex','0');element.setAttribute('aria-label',serviceText('stop')+' · '+place.name);element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();activate({originalEvent:event});}});}
 return marker;
}
function renderMarkers() {
 stopMarkers.clearLayers();
 if(!activeRoute||routeView!=='browse')return;
 [...new Set(activeRoute.stops)].forEach(id=>{
  const stop=transitData.stops[id];
  const marker=L.circleMarker([stop.lat,stop.lng],{className:'browse-stop-hit',pane:'lehighStops',radius:18,color:activeRoute.color,weight:0,opacity:0,fillColor:activeRoute.color,fillOpacity:0,bubblingMouseEvents:false}).addTo(stopMarkers);
  bindStopMarker(marker,id,{route:activeRoute});
  L.circleMarker([stop.lat,stop.lng],{className:'browse-stop',pane:'lehighStops',radius:6,color:'#fff',weight:2,fillColor:activeRoute.color,fillOpacity:1,interactive:false}).addTo(stopMarkers);
 });
 stopMarkers.bringToFront?.();
}
function showWeekly(route) { dialogRoute=route;renderWeekly(route);$('schedule-dialog').showModal(); }
function renderWeekly(route) {
 $('schedule-title').textContent=route.shortName+' · '+routeName(route);
 $('schedule-intro').textContent=t('weeklyIntro');$('schedule-note').textContent=t('weeklyNote');
 const day=schedules.weekdayOf(today());
 $('schedule-body').innerHTML='<table class="weekly-table"><tbody>'+[1,2,3,4,5,6,0].map(d=>'<tr'+(d===day?' class="is-today"':'')+'><th scope="row">'+t('weekDays')[d]+(d===day?' · '+t('today'):'')+'</th><td>'+formatWindows(schedules.routes[route.id].weekly[d],true)+'</td></tr>').join('')+'</tbody></table>';
}
function getRideStops(route,startId,endId) {
 const start=route.stops.indexOf(startId),end=route.stops.indexOf(endId);
 if(start<0||end<0||start===end)return null;
 return end>start?route.stops.slice(start,end+1):route.loop?route.stops.slice(start).concat(route.stops.slice(0,end+1)):null;
}
function renderSearch() { window.LeHighNavigation?.render(); }
let tileIssue=false, missingBasemap=false;
function updateMapStatus() { $('map-status').hidden=!tileIssue&&!missingBasemap; if(missingBasemap)$('map-status').textContent=t('mapMissing');else if(tileIssue)$('map-status').textContent=t('mapError'); }
function initMap() {
 map=L.map('map',{zoomControl:false,scrollWheelZoom:true,zoomSnap:.1}).setView(window.innerWidth<=760?[40.6063,-75.3778]:[40.606,-75.371],16);
 const stopPane=map.createPane?.('lehighStops');if(stopPane)stopPane.style.zIndex='610';
 map.zoomControl=L.control.zoom({position:'bottomright'}).addTo(map);
 const config=window.LEHIGH_MAP_CONFIG;
 if(config?.tileUrl){
  const base=L.tileLayer(config.tileUrl,{tileSize:256,minZoom:1,maxZoom:config.maxZoom||19,crossOrigin:true,attribution:config.attribution||'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'});
  base.on('tileerror',()=>{tileIssue=true;updateMapStatus();});
  base.on('tileload',()=>{tileIssue=false;updateMapStatus();});
  base.addTo(map);basemapLayer=base;
 }else{missingBasemap=true;}
 stopMarkers=L.featureGroup().addTo(map);
}
function renderLiveStatus(status){
 const widget=$('live-widget');if(!widget)return;widget.hidden=!status.routeId;
 if(activeRoute&&status.routeId===String(activeRoute.passioId))$('live-status').textContent=status.message||'';
 $('live-widget-title').textContent=(status.route?.shortName?status.route.shortName+' · ':'')+t('liveBusesTitle');
 $('live-widget-message').textContent=status.message||'';
 $('live-refresh').disabled=status.state==='loading';
}
document.addEventListener('DOMContentLoaded',()=>{
 initMap();
 liveBuses=window.LeHighLiveBuses?.create({map,L,getLanguage:()=>language,onStatus:renderLiveStatus});
 window.initNavigation?.();
 window.LeHighCampusExtras?.init({map,L,baseLayer:basemapLayer,getLanguage:()=>language,onTileIssue:issue=>{tileIssue=issue;updateMapStatus();}});
 $('live-refresh').addEventListener('click',async()=>{const button=$('live-refresh');button.disabled=true;try{await liveBuses?.refresh();}finally{button.disabled=false;}});
 applyLanguage();
 document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.lang;try{localStorage.setItem('lehigh-language-v2',language);}catch(_){}applyLanguage();}));
 $('fit-route').addEventListener('click',fitRoute);
 $('menu-toggle').addEventListener('click',()=>setDrawer($('menu-toggle').getAttribute('aria-expanded')!=='true'));
 $('clear-route').addEventListener('click',()=>{window.LeHighNavigation?.clearJourney();clearRouteSelection();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('schedule-dialog').open)setDrawer(false);});
 $('close-schedule').addEventListener('click',()=>$('schedule-dialog').close());
 $('schedule-dialog').addEventListener('click',event=>{if(event.target===$('schedule-dialog')){const r=$('schedule-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('schedule-dialog').close();}});
 new ResizeObserver(()=>{map.invalidateSize({animate:false});fitRoute();}).observe($('map'));
 const refreshService=()=>{if(today()!==currentDateKey){currentDateKey=today();applyLanguage();}else renderRoutes();};
 currentDateKey=today();setInterval(refreshService,60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshService();});
});

window.LeHighServiceStatus={getStatus:getRouteServiceStatus};
window.LeHighStopUI={createPopup:createStopPopup,bindMarker:bindStopMarker,openStop,selectStop};
window.LeHighMapState={hasSelection:()=>Boolean(activeRoute)||Boolean(window.LeHighNavigation?.hasJourney())||$('menu-toggle')?.getAttribute('aria-expanded')==='true',dismissSelection(){window.LeHighNavigation?.collapseSearch({resetView:false});clearRouteSelection();setDrawer(false);}};
