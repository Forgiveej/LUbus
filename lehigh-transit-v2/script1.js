'use strict';
const transitData = window.LEHIGH_TRANSIT_DATA;
const schedules = window.LEHIGH_SCHEDULES;
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copy = {
 en: {
  brandSub:'CAMPUS NAVIGATOR',campusRoutes:'Campus routes',today:'Today',todayDate:'Campus time · Eastern',
  planRide:'Where are you headed?',campusOnly:'Campus',from:'From',to:'To',chooseStart:'Choose a departure stop',chooseEnd:'Choose a destination stop',findRoute:'Find a route',swap:'Swap departure and destination',fitRoute:'Fit route',
  officialData:'Official routes, thoughtfully mapped',serviceCaveat:'Published Fall 2026 hours. Holiday changes and service alerts may apply. Times shown in Eastern Time.',liveTracking:'Live buses ↗',officialSchedules:'Official schedules ↗',
  dataChecked:'DATA CHECKED · 17 OCT 2026',mapCaption:'LEHIGH UNIVERSITY · ROUTE MAP',weeklySchedule:'WEEKLY SERVICE HOURS',close:'Close schedule',weeklyIntro:'Regular Fall 2026 service · Monday–Sunday · Eastern Time',
  weeklyNote:'“Next day” means after midnight. This is the regular weekly timetable, not live vehicle availability. Holiday and limited-service schedules may differ.',viewOfficial:'View official schedule and holiday changes ↗',
  noService:'No scheduled service',holiday:'No service · holiday',limited:'Limited service',regular:'Regular service',nextDay:'next day',every:'Every {n} min',perBus:'per bus',vehicle:'Bus {n}',after23:'Every 30 min until 23:00; later headway not specified',
  selectedRoute:'EXPLORE THIS ROUTE',stops:'stops',viewStops:'View all {n} stops',viewWeek:'View the full week',todayService:'Today’s service hours',directionNote:'NB = northbound · SB = southbound. Stops follow the published circular route.',
  sameStop:'Choose two different stops.',noMatch:'No direct route matches these directional stops. Check Passio GO for connections.',direct:'Direct route',segments:'{n} stop segments',alternatives:'Also connects',searchNote:'Matches stop order only. Check today’s hours and live buses before travelling.',
  mapMissing:'Add your MapTiler key in maptiler-config.local.js, then refresh.',mapError:'Basemap unavailable. Check your connection, MapTiler key and allowed origins.',
  weekDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  sourceDate:'Stop and route data checked 17 Oct 2026. Official route pages and Passio may differ; this map follows Passio GO.',
  scope:['Asa Packer · Sayre','Asa Packer · Mountaintop','Asa Packer · Goodman','All campuses · Saucon Village'],
  routeNames:['Packer Express','Mountaintop Connector','Goodman Connector','Campus Connector'],
  descriptions:['A circular route around Asa Packer and Sayre. Runs in fall and spring semesters; no summer service.','Connects Asa Packer and Mountaintop, via Building C, Iacocca Hall and ATLSS.','Connects Asa Packer and Goodman, including Goodman Campus Circle and Cundey Varsity House.','Connects Asa Packer, Mountaintop, Goodman and Saucon Village, with separate stops for each direction.']
 },
 zh: {
  brandSub:'校园出行导航',campusRoutes:'校园公交线路',today:'今天',todayDate:'校园时间 · 美国东部',
  planRide:'今天想去哪里？',campusOnly:'校园出行',from:'出发站',to:'到达站',chooseStart:'选择出发站点',chooseEnd:'选择到达站点',findRoute:'查找线路',swap:'交换出发站和到达站',fitRoute:'查看整条线路',
  officialData:'官方线路，清晰呈现',serviceCaveat:'采用官网 2026 年秋季时刻表；节假日及临时调整以官方公告为准。全部时间为美国东部时间。',liveTracking:'实时车辆 ↗',officialSchedules:'官方时刻表 ↗',
  dataChecked:'数据核查 · 2026-10-17',mapCaption:'理海大学 · 公交线路图',weeklySchedule:'一周运营时间',close:'关闭时间表',weeklyIntro:'2026 年秋季常规班次 · 周一至周日 · 美国东部时间',
  weeklyNote:'“次日”表示跨过午夜后的时间。这里是常规周时刻表，不是实时车辆状态；节假日和缩减运营日可能调整。',viewOfficial:'查看官网时刻表与节假日调整 ↗',
  noService:'无计划班次',holiday:'节假日停运',limited:'缩减运营',regular:'常规运营',nextDay:'次日',every:'约 {n} 分钟一班',perBus:'每辆',vehicle:'车辆 {n}',after23:'23:00 前约 30 分钟一班；之后间隔未注明',
  selectedRoute:'当前线路',stops:'个站点',viewStops:'查看全部 {n} 个站点',viewWeek:'查看一周时间表',todayService:'今日运营时间',directionNote:'NB = 北向，SB = 南向；按官方站序循环，末站接回首站。',
  sameStop:'请选择两个不同的站点。',noMatch:'这两个方向站点之间暂无匹配的直达线路，请通过 Passio GO 查询换乘。',direct:'可直达线路',segments:'{n} 段站间路程',alternatives:'其他直达线路',searchNote:'按站序匹配，不计算实时等车时间；出发前请核对当天时段与实时车辆。',
  mapMissing:'请在 maptiler-config.local.js 中填写 MapTiler Key，然后刷新。',mapError:'地图底图暂时无法加载，请检查网络、MapTiler Key 和允许来源。',
  weekDays:['周日','周一','周二','周三','周四','周五','周六'],
  sourceDate:'站点和轨迹核查于 2026-10-17。官网旧线路页与 Passio 存在差异，此地图采用 Passio GO 数据。',
  scope:['Asa Packer · Sayre 校区','主校区 · 山顶校区','主校区 · Goodman 校区','全校区 · Saucon Village'],
  routeNames:['Packer 快线','Mountaintop 接驳线','Goodman 接驳线','全校区接驳线'],
  descriptions:['环绕 Asa Packer 与 Sayre 校区的循环线路。秋、春学期运行，暑期停运。','连接主校区和山顶校区，途经 Building C、Iacocca Hall 和 ATLSS。','连接主校区与 Goodman，服务 Goodman Campus Circle 和 Cundey Varsity House。','连接 Asa Packer、Mountaintop、Goodman 与 Saucon Village，去程与返程分方向设站。']
 }
};
let language='zh';
try { language = localStorage.getItem('lehigh-language') === 'en' ? 'en' : 'zh'; } catch (_) {}
let map, activePolyline, stopMarkers, activeRoute = null, routeView = null, dialogRoute = null, searchState = null, currentDateKey, liveBuses;
Object.assign(copy.en,{openMenu:'Open campus routes',closeMenu:'Close campus routes',clearRoute:'Clear selected route'});
Object.assign(copy.zh,{openMenu:'打开校园线路菜单',closeMenu:'收起校园线路菜单',clearRoute:'取消当前线路'});
function t(key, vars={}) { let value=copy[language][key]; Object.entries(vars).forEach(([k,v])=>{value=value.replace('{'+k+'}',v);}); return value; }
function routeIndex(route) { return transitData.routes.findIndex(r=>r.id===route.id); }
function routeName(route) { return copy[language].routeNames[routeIndex(route)]; }
function stopName(id) { let name=transitData.stops[id].name; return language==='zh' ? name.replace(/ NB$/,'（北向）').replace(/ SB$/,'（南向）') : name; }
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
 return new Intl.DateTimeFormat(language==='zh'?'zh-CN':'en-US',{timeZone:'UTC',month:'short',day:'numeric',weekday:'long'}).format(date);
}
function applyLanguage() {
 document.documentElement.lang=language==='zh'?'zh-CN':'en';
 document.title=language==='zh'?'Lehigh Transit · 校园公交导航':'Lehigh Transit · Campus Navigator';
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
 updateMapStatus();
 map.zoomControl._zoomInButton.title=language==='zh'?'放大':'Zoom in';
 map.zoomControl._zoomOutButton.title=language==='zh'?'缩小':'Zoom out';
 map.zoomControl._zoomInButton.setAttribute('aria-label',map.zoomControl._zoomInButton.title);
 map.zoomControl._zoomOutButton.setAttribute('aria-label',map.zoomControl._zoomOutButton.title);
}
function renderRoutes() {
 const list=$('route-list'); list.replaceChildren();
 transitData.routes.forEach(route=>{
  const li=document.createElement('li'); li.className='route-card'+(activeRoute?.id===route.id?' selected':'');
  li.style.setProperty('--route-color',route.color); li.style.setProperty('--badge-ink',route.shortName==='GC'?'#fff':'#3e462f');
  const button=document.createElement('button'); button.type='button';button.className='route-select';button.dataset.routeId=route.id;button.setAttribute('aria-pressed',String(activeRoute?.id===route.id));
  const day=schedules.getDaySchedule(route.id,today());
  button.innerHTML='<span class="route-badge">'+route.shortName+'</span><span class="route-copy"><strong>'+escapeHTML(routeName(route))+'</strong><span class="route-scope">'+escapeHTML(copy[language].scope[routeIndex(route)])+'</span><span class="route-today'+(!day.windows.length?' off':'')+'"><b>'+t('today')+'</b>'+daySummary(route)+'</span></span>';
  button.addEventListener('click',()=>{window.LeHighNavigation?.clearJourney();selectRoute(route);});
  const info=document.createElement('button');info.type='button';info.className='schedule-info';info.textContent='i';info.setAttribute('aria-label',routeName(route)+' · '+t('weeklySchedule'));info.title=t('viewWeek');info.dataset.scheduleId=route.id;
  info.addEventListener('click',()=>showWeekly(route));li.append(button,info);list.append(li);
 });
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
 $('display-area').innerHTML='<p class="detail-eyebrow">'+t('selectedRoute')+'</p><div class="detail-heading"><h2>'+escapeHTML(routeName(route))+'</h2><span class="detail-count">'+route.stops.length+' '+t('stops')+'</span></div><p class="detail-description">'+escapeHTML(copy[language].descriptions[routeIndex(route)])+'</p><div class="detail-schedule"><strong>'+t('todayService')+'</strong>'+daySummary(route,true)+'<br><button type="button" class="inline-week">'+t('viewWeek')+' ↗</button></div><details class="stops-disclosure"><summary>'+t('viewStops',{n:route.stops.length})+'</summary><ol class="stop-sequence">'+route.stops.map(id=>'<li>'+escapeHTML(stopName(id))+'</li>').join('')+'</ol><p class="direction-note">'+t('directionNote')+'</p></details>';
 $('display-area').querySelector('.inline-week').addEventListener('click',()=>showWeekly(route));
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
 if(mobile)return {paddingTopLeft:[20,Math.min(330,Math.max(60,height-160))],paddingBottomRight:[20,30]};
 return {paddingTopLeft:[drawerOpen?380:35,75],paddingBottomRight:[width<1000?30:395,width<1000?365:55]};
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
function renderMarkers() {
 stopMarkers.clearLayers();
 if(!activeRoute||routeView!=='browse')return;
 [...new Set(activeRoute.stops)].forEach(id=>{
  const stop=transitData.stops[id];
  const marker=L.circleMarker([stop.lat,stop.lng],{className:'browse-stop',radius:5,color:'#fff',weight:2,fillColor:activeRoute.color,fillOpacity:1}).addTo(stopMarkers);
  marker.bindTooltip(escapeHTML(stopName(id)),{direction:'top',offset:[0,-4]});
  marker.bindPopup('<strong>'+escapeHTML(stopName(id))+'</strong><br><small>'+escapeHTML(routeName(activeRoute))+'</small>');
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
let tileIssue=false, missingKey=false;
function updateMapStatus() { $('map-status').hidden=!tileIssue&&!missingKey; if(missingKey)$('map-status').textContent=t('mapMissing');else if(tileIssue)$('map-status').textContent=t('mapError'); }
function initMap() {
 map=L.map('map',{zoomControl:false,scrollWheelZoom:true}).setView([40.600,-75.37],14);
 map.zoomControl=L.control.zoom({position:'bottomright'}).addTo(map);
 const key=(window.MAPTILER_CONFIG?.apiKey||'').trim();
 if(key){const base=L.tileLayer('https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key='+encodeURIComponent(key),{tileSize:256,minZoom:1,maxZoom:18,crossOrigin:true,attribution:'&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'});base.on('tileerror',()=>{tileIssue=true;updateMapStatus();});base.on('tileload',()=>{tileIssue=false;updateMapStatus();});base.addTo(map);}else{missingKey=true;}
 stopMarkers=L.featureGroup().addTo(map);
}
document.addEventListener('DOMContentLoaded',()=>{
 initMap();
 liveBuses=window.LeHighLiveBuses?.create({map,L,getLanguage:()=>language,onStatus:status=>{if(activeRoute&&status.routeId===String(activeRoute.passioId))$('live-status').textContent=status.message||'';}});
 window.initNavigation?.();
 applyLanguage();
 document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.lang;try{localStorage.setItem('lehigh-language',language);}catch(_){}applyLanguage();}));
 $('fit-route').addEventListener('click',fitRoute);
 $('menu-toggle').addEventListener('click',()=>setDrawer($('menu-toggle').getAttribute('aria-expanded')!=='true'));
 $('clear-route').addEventListener('click',()=>{window.LeHighNavigation?.clearJourney();clearRouteSelection();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('schedule-dialog').open)setDrawer(false);});
 $('close-schedule').addEventListener('click',()=>$('schedule-dialog').close());
 $('schedule-dialog').addEventListener('click',event=>{if(event.target===$('schedule-dialog')){const r=$('schedule-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('schedule-dialog').close();}});
 new ResizeObserver(()=>{map.invalidateSize({animate:false});fitRoute();}).observe($('map'));
 currentDateKey=today();setInterval(()=>{if(today()!==currentDateKey){currentDateKey=today();applyLanguage();}},60000);
});
