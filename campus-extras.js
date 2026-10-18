/* Local saved places, campus points and key-free basemaps. No tile prefetching.
 * USGS terms/services: https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map
 * Map services and data available from U.S. Geological Survey, National Geospatial Program.
 */
(function(root){
 'use strict';
 const words={
 en:{campusHome:'Lehigh campuses',mapStyles:'Map style',savedPlaces:'Saved places',savedLocal:'Saved on this browser only.',savePlace:'☆ Save destination',placeSaved:'★ Destination saved',saveHere:'☆ Save this place',unsave:'Remove saved place',useStart:'Start here',useEnd:'Go here',noSaved:'Save a building or a point on the map. Your stars will appear here.',storageFailed:'Could not save in this browser. Check your privacy settings.',savedLimit:'You can save up to 100 places.',maptilerStyle:'MapTiler Streets',roadStyle:'Streets',imageryStyle:'Aerial imagery',topoStyle:'Terrain',imageryNote:'USGS aerial imagery · not live · detail varies',mapStylesNote:'No API key needed. Maps load online.',liveBusesTitle:'Live buses',liveAuto:'Automatic updates · every 20 seconds',refreshBuses:'Refresh bus positions',savedHint:'Tap a building or the map to save a star.',searchSaved:'Saved place'},
 zh:{campusHome:'理海校区',mapStyles:'地图样式',savedPlaces:'收藏地点',savedLocal:'收藏仅保存在当前浏览器。',savePlace:'☆ 收藏目的地',placeSaved:'★ 已收藏目的地',saveHere:'☆ 收藏这里',unsave:'取消收藏',useStart:'设为起点',useEnd:'设为终点',noSaved:'在地图上点击建筑或位置，即可收藏星标。',storageFailed:'当前浏览器无法保存收藏，请检查隐私设置。',savedLimit:'最多收藏 100 个地点。',maptilerStyle:'MapTiler Streets',roadStyle:'道路地图',imageryStyle:'卫星 / 航拍',topoStyle:'地形地图',imageryNote:'USGS 航拍影像 · 非实时 · 清晰度因区域而异',mapStylesNote:'无需 API Key，底图通过网络加载。',liveBusesTitle:'实时公交',liveAuto:'每 20 秒自动更新',refreshBuses:'刷新公交位置',savedHint:'点击建筑或地图位置，可收藏星标。',searchSaved:'已收藏地点'},
 es:{campusHome:'Campus de Lehigh',mapStyles:'Estilo de mapa',savedPlaces:'Lugares guardados',savedLocal:'Se guardan solo en este navegador.',savePlace:'☆ Guardar destino',placeSaved:'★ Destino guardado',saveHere:'☆ Guardar lugar',unsave:'Quitar de guardados',useStart:'Salir de aquí',useEnd:'Ir aquí',noSaved:'Toca un edificio o un punto del mapa para guardar una estrella.',storageFailed:'No se pudo guardar. Revisa la privacidad de tu navegador.',savedLimit:'Puedes guardar hasta 100 lugares.',maptilerStyle:'MapTiler Streets',roadStyle:'Calles',imageryStyle:'Vista aérea',topoStyle:'Relieve',imageryNote:'Imágenes aéreas USGS · no en vivo · detalle variable',mapStylesNote:'Sin clave API. Los mapas necesitan conexión.',liveBusesTitle:'Autobuses en vivo',liveAuto:'Actualización automática · cada 20 segundos',refreshBuses:'Actualizar autobuses',savedHint:'Toca un edificio o un punto para guardar una estrella.',searchSaved:'Lugar guardado'}
 };
 if(typeof copy!=='undefined')for(const lang of Object.keys(words))Object.assign(copy[lang]||(copy[lang]={}),words[lang]);
 const KEY='lehigh-saved-places-v1';
 function cleanPlace(value){
  if(!value||typeof value!=='object'||!Number.isFinite(value.lat)||!Number.isFinite(value.lng)||Math.abs(value.lat)>90||Math.abs(value.lng)>180)return null;
  const name=typeof value.name==='string'?value.name.trim().slice(0,120):'';if(!name)return null;
  return {id:'saved-'+value.lat.toFixed(5)+','+value.lng.toFixed(5),name,address:typeof value.address==='string'?value.address.slice(0,300):'',lat:value.lat,lng:value.lng,type:value.type==='campus'?'campus':'place'};
 }
 function createStore(storage){
  let items=[];try{const parsed=JSON.parse(storage?.getItem(KEY)||'[]');if(Array.isArray(parsed))items=parsed.map(cleanPlace).filter(Boolean).filter((p,i,a)=>a.findIndex(q=>q.id===p.id)===i).slice(0,100);}catch(_){}
  const match=p=>{const safe=cleanPlace(p);return safe?items.findIndex(item=>item.id===safe.id):-1;};
  return{list:()=>items.map(item=>({...item})),has:p=>match(p)>=0,toggle(p){const safe=cleanPlace(p);if(!safe)return{ok:false,reason:'invalid'};const index=match(safe);if(index<0&&items.length>=100)return{ok:false,reason:'limit'};
   const next=index<0?[...items,safe]:items.filter((_,i)=>i!==index);try{if(!storage)throw Error('storage unavailable');storage.setItem(KEY,JSON.stringify(next));items=next;return{ok:true,saved:index<0};}catch(_){return{ok:false,reason:'storage'};}},remove(id){const next=items.filter(item=>item.id!==id);try{if(!storage)throw Error('storage unavailable');storage.setItem(KEY,JSON.stringify(next));items=next;return true;}catch(_){return false;}}};
 }
 let storage;try{storage=root.localStorage;}catch(_){}
 const store=createStore(storage);let context,savedLayer,campusLayer,baseLayer,style=root.LEHIGH_MAP_CONFIG?.effectiveStyle||'road',message=null,popupOpen=false,popupDismissUntil=0;
 const get=id=>root.document.getElementById(id),label=(key,vars)=>typeof t==='function'?t(key,vars):key;
 function button(text,fn,className=''){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.className=className;b.addEventListener('click',fn);return b;}
 function normalizedPlace(p){return cleanPlace({...p,name:typeof placeName==='function'?placeName(p)||p.name:p.name});}
 function toggle(p){const place=normalizedPlace(p),result=store.toggle(place);message=result.ok?null:result.reason==='limit'?'savedLimit':'storageFailed';const feedback=get('saved-feedback');if(feedback){feedback.hidden=!message;feedback.textContent=message?label(message):'';}renderSaved();updateSelected();if(context&&result.ok)context.map.closePopup();return result;}
 function choosePlace(field,place){root.LeHighNavigation?.selectPlace(field,place);closePanels();updateSelected();}
 function popup(place){
  const panel=root.document.createElement('div');panel.className='place-popup';const title=root.document.createElement('strong');title.textContent=place.name;panel.append(title);
  if(place.address){const address=root.document.createElement('p');address.textContent=place.address;panel.append(address);}
  const actions=root.document.createElement('div');actions.className='popup-actions';actions.append(button(label('useStart'),()=>{choosePlace('start',place);context.map.closePopup();}),button(label('useEnd'),()=>{choosePlace('end',place);context.map.closePopup();}),button(label(store.has(place)?'unsave':'saveHere'),()=>toggle(place)));panel.append(actions);return panel;
 }
 function updateSelected(){const b=get('favorite-place');if(!b)return;const p=root.LeHighNavigation?.getEndpoints()?.end;b.disabled=!p;b.textContent=label(p&&store.has(normalizedPlace(p))?'placeSaved':'savePlace');b.setAttribute('aria-pressed',String(Boolean(p&&store.has(normalizedPlace(p)))));}
 function renderSaved(){
  if(!context)return;savedLayer.clearLayers();const list=get('favorites-list');list.replaceChildren();const items=store.list();
  for(const place of items){
   const icon=context.L.divIcon({className:'saved-star',html:'<span aria-hidden="true">★</span>',iconSize:[30,30],iconAnchor:[15,15]});
   context.L.marker([place.lat,place.lng],{icon,title:place.name,zIndexOffset:900}).addTo(savedLayer).bindPopup(()=>popup(place));
   const row=root.document.createElement('article');row.className='saved-row';const name=button('★ '+place.name,()=>{context.map.setView([place.lat,place.lng],17);context.L.popup().setLatLng([place.lat,place.lng]).setContent(popup(place)).openOn(context.map);},'saved-name');
   const actions=root.document.createElement('div');actions.className='saved-actions';actions.append(button(label('useStart'),()=>choosePlace('start',place)),button(label('useEnd'),()=>choosePlace('end',place)),button('×',()=>{if(!store.remove(place.id))message='storageFailed';renderSaved();updateSelected();},'saved-remove'));
   actions.lastChild.setAttribute('aria-label',label('unsave')+' · '+place.name);row.append(name,actions);list.append(row);
  }
  if(!items.length||message){const p=root.document.createElement('p');p.className='utility-note';p.textContent=label(message||'noSaved');p.setAttribute('role','status');list.append(p);}
 }
 const providers={
  road:{key:'roadStyle',url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',nativeZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'},
  imagery:{key:'imageryStyle',url:'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',nativeZoom:16,attribution:'Map services and data available from <a href="https://www.usgs.gov/programs/national-geospatial-program/the-national-map">U.S. Geological Survey, National Geospatial Program</a>'},
  topo:{key:'topoStyle',url:'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',nativeZoom:16,attribution:'Map services and data available from <a href="https://www.usgs.gov/programs/national-geospatial-program/the-national-map">U.S. Geological Survey, National Geospatial Program</a>'}
 };
 if(root.LEHIGH_MAP_CONFIG?.maptilerApiKey){providers.maptiler={key:'maptilerStyle',url:'https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key='+encodeURIComponent(root.LEHIGH_MAP_CONFIG.maptilerApiKey),nativeZoom:18,attribution:root.LEHIGH_MAP_CONFIG.attribution};}
 function switchStyle(id){
  if(!providers[id]||!context)return;if(id!==style||!baseLayer){if(baseLayer)context.map.removeLayer(baseLayer);const p=providers[id];baseLayer=context.L.tileLayer(p.url,{maxZoom:20,maxNativeZoom:p.nativeZoom,tileSize:256,crossOrigin:true,attribution:p.attribution});baseLayer.on('tileerror',()=>context.onTileIssue?.(true));baseLayer.on('tileload',()=>context.onTileIssue?.(false));baseLayer.addTo(context.map);style=id;context.onTileIssue?.(false);}
  try{root.localStorage.setItem('lehigh-map-style-v2',id);}catch(_){}renderStyles();
 }
 function renderStyles(){
  const panel=get('map-style-panel');panel.replaceChildren();const h=root.document.createElement('h2');h.textContent=label('mapStyles');panel.append(h);const options=root.document.createElement('div');options.className='style-options';
  for(const [id,p] of Object.entries(providers)){const b=button(label(p.key),()=>switchStyle(id),'style-option '+id);b.setAttribute('aria-pressed',String(style===id));const preview=root.document.createElement('span');preview.className='style-swatch '+id;preview.setAttribute('aria-hidden','true');b.prepend(preview);options.append(b);}panel.append(options);
  for(const key of ['mapStylesNote','imageryNote']){const p=root.document.createElement('p');p.className='utility-note';p.textContent=label(key);panel.append(p);}
 }
 function nearestCampusPlace(point,maxPixels=24){
  if(!context||context.map.getZoom()<16||!Number.isFinite(point?.lat)||!Number.isFinite(point?.lng))return null;
  const map=context.map,zoom=map.getZoom(),origin=map.latLngToContainerPoint?.([point.lat,point.lng]);let closest=null,distance=Infinity;
  for(const place of root.LEHIGH_PLACES||[]){
   let pixels;
   if(origin){const projected=map.latLngToContainerPoint([place.lat,place.lng]);pixels=Math.hypot(projected.x-origin.x,projected.y-origin.y);}
   else{const rad=Math.PI/180,lat=(point.lat+place.lat)*rad/2;const meters=Math.hypot((place.lat-point.lat)*111195,(place.lng-point.lng)*111195*Math.cos(lat));pixels=meters/(156543.03392*Math.cos(point.lat*rad)/Math.pow(2,zoom));}
   if(pixels<=maxPixels&&pixels<distance){distance=pixels;closest=place;}
  }
  return closest;
 }
 function dismissRouteOnMap(){
  const state=root.LeHighNavigation?.getSearchState?.();
  if(!root.LeHighMapState?.hasSelection?.()&&!state?.results&&!state?.resultMode)return false;
  if(root.LeHighMapState?.dismissSelection)root.LeHighMapState.dismissSelection();else root.LeHighNavigation?.collapseSearch?.({resetView:false});
  context.map.closePopup();return true;
 }
 function openPlace(place,at){context.L.popup().setLatLng(at||[place.lat,place.lng]).setContent(popup(place)).openOn(context.map);}
 function campusPoints(){
  campusLayer.clearLayers();if(context.map.getZoom()<16)return;const bounds=context.map.getBounds();
  for(const place of root.LEHIGH_PLACES||[]){
   if(!bounds.contains([place.lat,place.lng]))continue;
   const hit=context.L.circleMarker([place.lat,place.lng],{radius:18,weight:0,opacity:0,fillOpacity:0,className:'campus-place-hit',bubblingMouseEvents:false}).addTo(campusLayer);
   hit.bindTooltip(place.name,{direction:'top'});
   const element=hit.getElement?.();if(element){element.setAttribute('role','button');element.setAttribute('tabindex','0');element.setAttribute('aria-label',place.name);element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();if(!dismissRouteOnMap())openPlace(place);}});}
   hit.on('click',event=>{
    if(root.LeHighNavigation?.isPicking?.()){context.map.fire?.('click',{latlng:event.latlng||{lat:place.lat,lng:place.lng},originalEvent:event.originalEvent});return;}
    if(Date.now()<popupDismissUntil||dismissRouteOnMap())return;
    const at=event.latlng||{lat:place.lat,lng:place.lng};openPlace(nearestCampusPlace(at)||place);
   });
   context.L.circleMarker([place.lat,place.lng],{radius:5,color:'#ffffff',weight:1.5,fillColor:'#667854',fillOpacity:.9,className:'campus-place-point',interactive:false}).addTo(campusLayer);
  }
 }
 function closePanels(){let closed=false;for(const name of ['map-style','favorites']){const panel=get(name+'-panel');if(!panel.hidden)closed=true;panel.hidden=true;get(name+'-toggle').setAttribute('aria-expanded','false');}root.document.querySelector('.map-workspace')?.classList.remove('utility-open');return closed;}
 function setPanel(which){let anyOpen=false;for(const name of ['map-style','favorites']){const panel=get(name+'-panel'),b=get(name+'-toggle');const open=name===which&&panel.hidden;panel.hidden=!open;b.setAttribute('aria-expanded',String(open));anyOpen=anyOpen||open;}root.document.querySelector('.map-workspace')?.classList.toggle('utility-open',anyOpen);}
 function showCampuses(){
  if(!context)return;context.map.closePopup();context.map.invalidateSize?.({animate:false});
  if(root.innerWidth<=760)context.map.setView([40.6063,-75.3778],16,{animate:false});
  else context.map.fitBounds([[40.5995,-75.3842],[40.6119,-75.3548]],{padding:[12,12],maxZoom:18,animate:false});
 }
 function init(options){
  if(context)return;context=options;baseLayer=options.baseLayer;savedLayer=options.L.featureGroup().addTo(options.map);campusLayer=options.L.featureGroup().addTo(options.map);
  get('map-style-toggle').addEventListener('click',()=>setPanel('map-style'));get('favorites-toggle').addEventListener('click',()=>setPanel('favorites'));
  get('search-form').addEventListener('pointerdown',closePanels);get('search-form').addEventListener('focusin',closePanels);
  get('favorite-place').addEventListener('click',()=>{const p=root.LeHighNavigation?.getEndpoints()?.end;if(p)toggle(p);});
  get('campus-home').addEventListener('click',()=>{root.LeHighMapState?.dismissSelection?.();closePanels();showCampuses();});
  options.map.on('moveend zoomend',campusPoints);
  options.map.on('popupopen',()=>{popupOpen=true;});options.map.on('popupclose',()=>{popupOpen=false;});
  const dismissPopup=event=>{
   if(event.target?.closest?.('.leaflet-popup'))return;
   const open=popupOpen||options.map.getPopup?.()?.isOpen?.();if(!open)return;
   if(event.target?.closest?.('#map'))popupDismissUntil=Date.now()+800;
   options.map.closePopup();popupOpen=false;
  };
  root.document.addEventListener('pointerdown',dismissPopup,{capture:true,passive:true});
  root.document.addEventListener('click',dismissPopup,true);root.document.addEventListener('focusin',dismissPopup,true);
  options.map.on('click',event=>{
   if(event.lehighPicked||root.LeHighNavigation?.isPicking?.())return;
   if(closePanels())return;if(root.LeHighNavigation?.dismissSuggestions?.())return;
   if(dismissRouteOnMap()||Date.now()<popupDismissUntil)return;
   const place=nearestCampusPlace(event.latlng);if(place){openPlace(place);return;}
   const target=event.originalEvent?.target;if(target?.closest?.('.leaflet-interactive'))return;
   const p={id:'map-place',type:'map',lat:event.latlng.lat,lng:event.latlng.lng,name:label('mapPoint')+' · '+event.latlng.lat.toFixed(5)+', '+event.latlng.lng.toFixed(5)};openPlace(p,event.latlng);
  });
  root.document.addEventListener('keydown',event=>{if(event.key==='Escape')closePanels();});
  root.addEventListener('lehigh:place-selected',updateSelected);root.addEventListener('lehigh:endpoints-changed',updateSelected);
  let remembered;try{remembered=root.localStorage.getItem('lehigh-map-style-v2');}catch(_){}if(providers[remembered])switchStyle(remembered);
  translate();campusPoints();
 }
 function translate(){if(!context)return;renderStyles();renderSaved();updateSelected();campusPoints();}
 root.LeHighSavedPlaces={createStore,cleanPlace};root.LeHighCampusExtras={init,translate,toggle,store,providers,switchStyle,closePanels,showCampuses,nearestCampusPlace};
})(typeof window!=='undefined'?window:globalThis);
