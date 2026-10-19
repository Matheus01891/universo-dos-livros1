'use strict';
/* Motor de cenas: ambientes 3D procedurais + câmera animada + importação GLB opcional.
   Se a biblioteca Three.js não estiver disponível, a leitura continua com palco Canvas 2D animado. */
class StoryCinema {
 constructor(canvas, notice) {
  this.canvas=canvas;this.notice=notice;this.page=1;this.elapsed=0;this.action=null;this.dragX=0;this.model=null;this.modelMixer=null;this.modelClips=[];this.clock=performance.now();this.audio=null;
  this.use3D=typeof THREE!=='undefined';
  try {if(this.use3D) this.init3D();else this.init2D();} catch(e){console.warn('3D não disponível; usando cena 2D.',e);this.use3D=false;this.init2D();}
  this.onResize=()=>this.resize();window.addEventListener('resize',this.onResize);
  this.resize();this.setPage(1);
  requestAnimationFrame(t=>this.tick(t));
  this.canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.down={x:e.clientX,y:e.clientY};this.canvas.setPointerCapture?.(e.pointerId);});
  this.canvas.addEventListener('pointermove',e=>{if(!this.down||this.action)return;this.dragX=Math.max(-1,Math.min(1,this.dragX+(e.clientX-this.down.x)*.004));this.down.x=e.clientX;});
  for(const evt of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(evt,()=>this.down=null);
 }
 init3D(){
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(42,1,.1,150);
  this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.outputEncoding=THREE.sRGBEncoding;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.28;
  this.scene.add(new THREE.HemisphereLight(0xe4d8ff,0x20132b,1.3));
  this.keyLight=new THREE.DirectionalLight(0xffedca,2.0);this.keyLight.position.set(-3,7,5);this.keyLight.castShadow=true;
  this.keyLight.shadow.mapSize.set(1024,1024);Object.assign(this.keyLight.shadow.camera,{left:-9,right:9,top:9,bottom:-9});this.scene.add(this.keyLight);
  this.fillLight=new THREE.PointLight(0xaa80ff,1.9,17);this.fillLight.position.set(3,3,3);this.scene.add(this.fillLight);
  this.world=new THREE.Group();this.scene.add(this.world);this.environment=new THREE.Group();this.world.add(this.environment);
  this.actors=new THREE.Group();this.world.add(this.actors);
  const girl=this.makeGirl(),fox=this.makeFox(),star=this.makeStar(),owl=this.makeOwl();
  this.people={lia:girl,pingo:fox,luma:star,coruja:owl};
  for(const actor of Object.values(this.people)) this.actors.add(actor.root);
  this.spawnDust();
  if(THREE.GLTFLoader&&location.protocol!=='file:')this.loadRemoteGLB('modelos/lia.glb',true);
 }
 init2D(){this.ctx=this.canvas.getContext('2d');this.notice.textContent='';}
 mat(color,metalness=0,roughness=.72,emissive=0){return new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?.6:0});}
 add(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 sphere(parent,x,y,z,r,mat){return this.add(parent,new THREE.SphereGeometry(r,20,14),mat,x,y,z);}
 box(parent,x,y,z,w,h,d,mat){return this.add(parent,new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
 cyl(parent,x,y,z,rt,rb,h,mat,n=14){return this.add(parent,new THREE.CylinderGeometry(rt,rb,h,n),mat,x,y,z);}
 makeGirl(){
  // Exploradora inspirada nas cores da textura enviada: jaqueta lilás, camiseta rosa,
  // mochila turquesa, shorts caramelo e botas ameixa. Modelo estilizado de alta suavização.
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const skin=this.mat(0xf1b58f),skinShadow=this.mat(0xd88e74),hair=this.mat(0x442637),shine=this.mat(0x6b4051),hairLight=this.mat(0x85576a),
        rose=this.mat(0xe36a99),roseHi=this.mat(0xf2a1ba),jacket=this.mat(0xb48bdc),jacketDark=this.mat(0x9164b8),
        shorts=this.mat(0xb98255),shortsDark=this.mat(0x976543),shoes=this.mat(0x773c6c),sole=this.mat(0x4a2b53),
        bag=this.mat(0x4596aa),bagHi=this.mat(0x71c2cc),eyeWhite=this.mat(0xfffbf6),iris=this.mat(0x6b4034),pupil=this.mat(0x221b2c),blush=this.mat(0xe08b88);
  const oval=(parent,x,y,z,rx,ry,rz,mat)=>{let a=this.sphere(parent,x,y,z,1,mat);a.scale.set(rx,ry,rz);return a;};
  // Calçados com cadarços, pernas e shorts
  for(const s of [-1,1]){
   const leg=new THREE.Group();leg.position.set(s*.25,-.67,.02);body.add(leg);
   oval(leg,0,-.25,0,.14,.34,.14,skin);oval(leg,0,-.54,.08,.18,.17,.19,shoes);
   oval(leg,0,-.64,.16,.26,.115,.37,shoes);oval(leg,0,-.73,.19,.28,.065,.38,sole);
   for(let j=0;j<3;j++)this.box(leg,0,-.50-j*.07,.262,.22,.018,.018,roseHi);
   oval(body,s*.235,-.59,0,.25,.34,.3,shorts);this.box(body,s*.24,-.39,.278,.4,.025,.03,shortsDark);
   if(!this._girlLegs)this._girlLegs=[];this._girlLegs.push(leg);
  }
  const torso=oval(body,0,-.08,0,.44,.59,.3,rose);torso.rotation.z=.018;
  // Manga / colete aberto com lapelas
  oval(body,-.325,-.02,.16,.16,.43,.15,jacket).rotation.z=-.12;
  oval(body,.325,-.02,.16,.16,.43,.15,jacket).rotation.z=.12;
  oval(body,0,.37,.13,.39,.13,.25,roseHi);
  this.box(body,0,-.12,.311,.045,.56,.025,jacketDark);
  for(const s of [-1,1])this.sphere(body,s*.22,.19,.294,.028,this.mat(0xffd9a2));
  // Mochila turquesa, fechos e alças aparentes
  oval(body,0,-.07,-.40,.42,.59,.23,bag);
  oval(body,0,-.07,-.63,.32,.43,.085,bagHi);
  this.box(body,0,-.35,-.7,.45,.04,.035,jacketDark);
  for(const s of [-1,1]){let strap=oval(body,s*.34,.07,.26,.065,.41,.055,bag);strap.rotation.z=s*.14;}
  // Braços articulados com pele, punhos e dedos
  const arms=[];
  for(const s of [-1,1]){
   let arm=new THREE.Group();arm.position.set(s*.44,.24,0);body.add(arm);
   oval(arm,s*.1,-.14,0,.18,.24,.19,jacket);oval(arm,s*.16,-.32,.01,.15,.13,.16,jacketDark);
   oval(arm,s*.18,-.47,.025,.115,.18,.11,skin);
   oval(arm,s*.185,-.64,.06,.13,.14,.10,skin);
   for(let j=0;j<3;j++)oval(arm,s*(.11+j*.065),-.69,.11,.028,.06,.032,skin);
   arms.push(arm);
  }
  // Pescoço, cabelo volumoso com mechas e franja
  oval(body,0,.48,0,.2,.20,.18,skin);
  oval(body,0,.85,-.18,.67,.73,.52,hair);
  for(const s of [-1,1]){
   oval(body,s*.48,.72,-.27,.25,.59,.24,hair);
   oval(body,s*.50,.35,-.14,.18,.42,.19,shine);
   oval(body,s*.52,.88,.14,.135,.35,.17,hair);
  }
  oval(body,0,.94,.105,.54,.6,.48,skin);
  // Orelhas, olhos expressivos com pupilas e reflexos
  for(const s of [-1,1]){
   oval(body,s*.54,.88,.09,.13,.2,.13,skin);
   oval(body,s*.53,.87,.2,.06,.10,.024,skinShadow);
   oval(body,s*.215,1.00,.504,.152,.19,.078,eyeWhite);
   oval(body,s*.215,.995,.572,.098,.134,.038,iris);
   oval(body,s*.205,.998,.604,.065,.10,.018,pupil);
   oval(body,s*.188,1.048,.623,.031,.041,.013,eyeWhite);
   oval(body,s*.31,.73,.49,.14,.052,.035,blush).material.transparent=true;
   let brow=oval(body,s*.22,1.24,.497,.17,.035,.03,hair);brow.rotation.z=s*.14;
   for(let j=0;j<2;j++){let lash=oval(body,s*(.31+j*.045),1.105,.546,.017,.05,.02,hair);lash.rotation.z=s*.24;}
  }
  oval(body,0,.79,.566,.065,.048,.044,skinShadow);
  // Boca sorridente em curva, sem aparência rígida de boneco de blocos
  let curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.13,.68,.537),new THREE.Vector3(0,.63,.571),new THREE.Vector3(.13,.68,.537)]);
  this.add(body,new THREE.TubeGeometry(curve,16,.017,7,false),this.mat(0x994b61));
  // Franja ondulada em camadas, colocada acima dos olhos
  for(let i=0;i<6;i++){
   let xx=-.44+i*.177,yy=1.4-.105*Math.cos(i*1.8);
   let a=oval(body,xx,yy,.32,.185,.175,.24,i%2?hair:shine);a.rotation.z=(i-2.5)*-.10;
  }
  oval(body,-.24,1.43,.23,.20,.12,.2,hairLight);
  return {root,body,arms,legs:this._girlLegs.splice(0),head:body,eyes:null};
 }
 makeFox(){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const fur=this.mat(0xe98a37),gold=this.mat(0xf5aa4c),light=this.mat(0xffd085),white=this.mat(0xfff2d8),inner=this.mat(0xe57e93),brown=this.mat(0x39283a),nose=this.mat(0x241d2e),shine=this.mat(0xffffff);
  const oval=(x,y,z,rx,ry,rz,mat,p=body)=>{let o=this.sphere(p,x,y,z,1,mat);o.scale.set(rx,ry,rz);return o;};
  oval(0,-.48,-.08,.59,.45,.56,fur);oval(0,-.30,.33,.48,.55,.39,gold);
  oval(0,-.45,.65,.34,.39,.15,white);
  // Cabeça, orelhas triangulares com interior rosado
  oval(0,.15,.26,.5,.5,.45,gold);oval(0,-.07,.61,.35,.25,.27,white);
  for(const s of [-1,1]){
   let ear=this.add(body,new THREE.ConeGeometry(.24,.58,6),fur,s*.33,.79,.23);ear.rotation.z=s*-.17;
   let pink=this.add(body,new THREE.ConeGeometry(.135,.37,6),inner,s*.33,.77,.40);pink.rotation.z=s*-.17;
   oval(s*.22,.22,.659,.107,.14,.04,white);oval(s*.22,.19,.702,.075,.104,.028,brown);oval(s*.205,.215,.723,.028,.039,.015,shine);
   oval(s*.34,-.87,.29,.16,.25,.22,fur);oval(s*.34,-1.02,.43,.19,.09,.22,brown);
   oval(s*.34,-.93,-.26,.16,.19,.21,fur);
  }
  oval(0,-.12,.83,.102,.088,.09,nose);
  for(const s of [-1,1]){const m=this.add(body,new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.2,.792),new THREE.Vector3(s*.08,-.235,.77),new THREE.Vector3(s*.14,-.21,.75)]),10,.014,6),brown);}
  // Cauda longa, cheia e com ponta branca, articulada independentemente
  const tail=new THREE.Group();tail.position.set(.1,-.35,-.49);body.add(tail);
  let tx=oval(.24,.10,-.43,.26,.31,.65,fur,tail);tx.rotation.y=-.36;
  let tip=oval(.50,.20,-.85,.19,.22,.33,white,tail);tip.rotation.y=-.28;
  for(let i=0;i<3;i++)oval(.36+i*.09,.07,-.68-i*.1,.10,.14,.13,light,tail);
  return {root,body,tail};
 }
 makeStar(){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const shape=new THREE.Shape();for(let i=0;i<10;i++){let angle=(i/10)*Math.PI*2+Math.PI/2,r=i%2?.39:.82;let x=Math.cos(angle)*r,y=Math.sin(angle)*r;i?shape.lineTo(x,y):shape.moveTo(x,y)}shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.12,bevelThickness:.13,curveSegments:20});geo.center();
  const starMat=this.mat(0xffd76c,.09,.25,0xffaf46);starMat.emissiveIntensity=.85;
  const item=this.add(body,geo,starMat);item.rotation.z=0;
  for(const s of [-1,1]){this.sphere(body,s*.18,.10,.265,.063,this.mat(0x4c3044));let blush=this.sphere(body,s*.37,-.10,.23,.115,this.mat(0xffac9d));blush.scale.set(1.18,.75,.25);}
  let mouth=this.add(body,new THREE.TorusGeometry(.10,.014,9,24,Math.PI),this.mat(0x8a4a57),0,-.11,.25);mouth.rotation.z=Math.PI;
  let light=new THREE.PointLight(0xffd86c,2.0,9);body.add(light);return {root,body,light};
 }
 makeOwl(){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const feather=this.mat(0x916849),featherDark=this.mat(0x64475a),chest=this.mat(0xf2ddbd),tan=this.mat(0xc69b79),gold=this.mat(0xf9d176,.62,.3),white=this.mat(0xfffcf1),eye=this.mat(0x453045);
  const oval=(x,y,z,rx,ry,rz,mat)=>{let m=this.sphere(body,x,y,z,1,mat);m.scale.set(rx,ry,rz);return m;};
  oval(0,.0,0,.66,.83,.56,feather);oval(0,-.11,.43,.47,.58,.25,chest);
  for(const s of [-1,1]){
   let wing=oval(s*.56,-.13,-.05,.22,.45,.31,featherDark);wing.rotation.z=s*-.32;
   let horn=this.add(body,new THREE.ConeGeometry(.20,.48,8),feather,s*.48,.83,0);horn.rotation.z=s*-.32;
   oval(s*.27,.32,.49,.28,.33,.19,chest);oval(s*.27,.34,.665,.16,.20,.08,white);oval(s*.27,.33,.728,.096,.13,.06,eye);
   let ring=this.add(body,new THREE.TorusGeometry(.275,.032,10,36),gold,s*.27,.34,.68);ring.scale.set(1.08,1.15,1);
   oval(s*.27,-.77,.13,.12,.16,.18,gold);
  }
  this.box(body,0,.34,.695,.17,.028,.042,gold);
  let beak=this.add(body,new THREE.ConeGeometry(.13,.32,8),gold,0,.09,.68);beak.rotation.x=Math.PI;
  return {root,body};
 }
 spawnDust(){const geo=new THREE.BufferGeometry(),pts=[],sizes=[];for(let i=0;i<230;i++){pts.push((Math.random()-.5)*30,(Math.random()-.5)*17,(Math.random()-.5)*23-5);sizes.push(Math.random());}geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));this.dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffe8b9,size:.06,transparent:true,opacity:.72,depthWrite:false}));this.scene.add(this.dust);}
 disposeEnvironment(){this.environment.traverse(obj=>{if(obj.isMesh){obj.geometry?.dispose?.();let mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m?.dispose?.());}});while(this.environment.children.length)this.environment.remove(this.environment.children[0]);this.props={};}
 makeFloor(color=0x27203c){const m=this.box(this.environment,0,-1.42,-.4,34,.17,25,this.mat(color));m.receiveShadow=true;}
 glow(x,y,z,color=0xaa85ff,intensity=2,r=7){const light=new THREE.PointLight(color,intensity,r);light.position.set(x,y,z);this.environment.add(light);return light;}
 pillar(x,y,z,h,c){return this.cyl(this.environment,x,y,z,.2,.28,h,this.mat(c),8);}
 portalAt(x=1.15,z=-1.3){const wood=this.mat(0x57335e),trim=this.mat(0xc9a16d,.45,.35),gate=this.mat(0x7745ae,0,.5,0x5031af);const frame=this.box(this.environment,x,0,z,1.95,2.8,.24,wood);this.box(this.environment,x,0,z+.15,1.68,2.46,.08,trim);let hinge=new THREE.Group();hinge.position.set(x-.8,0,z+.26);this.environment.add(hinge);this.box(hinge,.8,0,0,1.56,2.35,.11,gate);this.sphere(hinge,1.32,0,.09,.105,trim);this.props.door=hinge;this.props.doorCenter=[x,0,z];this.glow(x,0,z+1,0xb07bfd,2.3,7);}
 room(){this.scene.background=new THREE.Color(0x21182e);this.scene.fog=new THREE.FogExp2(0x21182e,.025);this.makeFloor(0x4e3953);this.box(this.environment,0,1,-4,30,11,.2,this.mat(0x3d2844));this.box(this.environment,-4.1,-.5,-1.8,2.3,.5,2.8,this.mat(0x8d708c));this.box(this.environment,-4,0,-1.8,2.25,.4,2.55,this.mat(0xd4acbe));this.box(this.environment,-4,1,-3.4,2.45,2.2,.16,this.mat(0x3d2a47));this.box(this.environment,-4,.9,-3.27,1.85,1.64,.08,this.mat(0x172448,0,.55,0x141f3d));this.box(this.environment,-4,.9,-3.2,.08,1.64,.13,this.mat(0xb7a5b0));this.box(this.environment,-4,.9,-3.2,1.85,.08,.13,this.mat(0xb7a5b0));this.portalAt(2.9,-1.6);this.glow(-3,1,-2,0x849bff,1,7);}
 sky(){this.scene.background=new THREE.Color(0x1b1744);this.scene.fog=new THREE.FogExp2(0x251c50,.027);this.makeFloor(0x302752);const green=this.mat(0x7e7eaa);for(let i=0;i<6;i++){let x=(i-2.5)*1.7,z=-4-(i%3)*2;let island=this.sphere(this.environment,x,-.95,z,.82,green);island.scale.set(1.4,.36,1);this.sphere(this.environment,x,-1.25,z,.6,this.mat(0x474069)).scale.set(.8,.8,.65);}for(let i=0;i<10;i++)this.sphere(this.environment,-7+i*1.7,3+Math.sin(i*4)*.45,-8,.6,this.mat(0x68649f)).scale.set(2.2,.45,.8);this.glow(0,2,-3,0xae7cff,2,12);}
 forest(){this.scene.background=new THREE.Color(0x172d3a);this.scene.fog=new THREE.FogExp2(0x152c38,.058);this.makeFloor(0x284447);for(let i=0;i<18;i++){let x=(i%9-4)*1.65+.2*Math.sin(i),z=-2-Math.floor(i/9)*5+(i%3)*.3;let h=2.5+Math.sin(i*2)*.7;const trunk=this.cyl(this.environment,x,-1.4+h/2,z,.18,.38,h,this.mat(0x664454));this.sphere(this.environment,x,.7+Math.sin(i)*.3,z,.9,this.mat(i%2?0x407d83:0x456775)).scale.set(1.1,1.2,1);for(let j=0;j<2;j++){let color=i%2?0xb882ed:0xfbd17e;this.sphere(this.environment,x+.48+j*.3,-1.19,z+.55,.17,this.mat(color,0,.4,color)).scale.set(1,.66,1);}}this.glow(-2,1,0,0x55e1d3,2.1,9);}
 bubbles(){this.sky();this.props.bubbles=[];for(let i=0;i<8;i++){const mat=new THREE.MeshPhysicalMaterial({color:i%2?0xf1a7e6:0x9dc9f7,metalness:.1,roughness:.05,transparent:true,opacity:.5,clearcoat:1,depthWrite:false});const m=this.sphere(this.environment,(i-3.4)*.92,-1.15+Math.sin(i*2)*.18,1-i*.48,.55,mat);this.props.bubbles.push(m);}this.glow(0,-.2,1,0xffb4e3,1.5,8);}
 lake(){this.scene.background=new THREE.Color(0x172944);this.scene.fog=new THREE.FogExp2(0x1d3450,.048);this.makeFloor(0x23415b);const water=new THREE.Mesh(new THREE.CircleGeometry(9,72),new THREE.MeshStandardMaterial({color:0x4e7b9c,metalness:.4,roughness:.25,transparent:true,opacity:.79}));water.rotation.x=-Math.PI/2;water.position.set(0,-1.31,0);water.receiveShadow=true;this.environment.add(water);this.props.water=water;for(let i=0;i<8;i++){let ring=new THREE.Mesh(new THREE.TorusGeometry(1.3+i*.42,.017,5,90),new THREE.MeshBasicMaterial({color:0x99d5ed,transparent:true,opacity:.14}));ring.rotation.x=Math.PI/2;ring.position.set(0,-1.275,0);this.environment.add(ring);}this.props.boat=new THREE.Group();this.environment.add(this.props.boat);this.sphere(this.props.boat,-1.2,-1.03,.8,.75,this.mat(0xa87d65)).scale.set(1.55,.22,.8);this.box(this.props.boat,-1.2,-.94,.8,.08,.55,.08,this.mat(0xeccaa0));this.props.lily=this.cyl(this.environment,.5,-1.25,1,1.3,1.2,.08,this.mat(0x83b885),32);this.sphere(this.environment,1.15,-.25,-3,.68,this.mat(0xd2c5e0)).scale.set(1,.35,1.2);this.glow(0,1,-2,0x80d1ef,1.6,11);}
 stairs(){this.sky();for(let i=0;i<8;i++)this.box(this.environment,-2.8+i*.78,-1.24+i*.26,1.5-i*.9,1.2,.23,1.2,this.mat(0xd8c1ef,0,.38,0x39234c));this.glow(1,2,-4,0xfedaa3,2,8);}
 tower(){this.scene.background=new THREE.Color(0x272047);this.scene.fog=new THREE.FogExp2(0x272047,.035);this.makeFloor(0x66507b);const stone=this.mat(0xc9b1d9,.15,.6);for(const x of [-2.2,2.2])this.cyl(this.environment,x,1.35,-2, .3,.5,5.5,stone,9);this.box(this.environment,0,3.6,-2,5.3,.42,.9,stone);this.box(this.environment,0,-1.12,-2,6,.52,3.4,stone);this.props.bell=new THREE.Group();this.props.bell.position.set(0,.75,-1.55);this.environment.add(this.props.bell);this.cyl(this.props.bell,0,.6,0,.075,.075,.72,this.mat(0x99744c));const bell=this.add(this.props.bell,new THREE.CylinderGeometry(.26,.65,1.0,26,1),this.mat(0xffd078,.8,.22,0x7e481e),0,-.15,0);this.sphere(this.props.bell,0,-.77,0,.15,this.mat(0xffe3a1,.8,.2));this.glow(0,1,-1,0xffd97b,2.3,9);}
 buildSet(name){this.disposeEnvironment();if(name==='room')this.room();else if(name==='portal'){this.room();this.glow(2.9,0,0,0xc78aff,3,10);}else if(name==='sky'||name==='fork')this.sky();else if(name==='forest')this.forest();else if(name==='bubbles')this.bubbles();else if(name==='lake')this.lake();else if(name==='stairs')this.stairs();else if(name==='tower')this.tower();if(name==='fork'){this.props.bubbles=[];for(let i=0;i<5;i++)this.props.bubbles.push(this.sphere(this.environment,-3+i*.55,-.8,1,.34,this.mat(0x9db9f0,0,.3,0x443073)));for(let i=0;i<5;i++)this.sphere(this.environment,2.8+i*.3,-.2,-2-i*.2,.5,this.mat(0x4a7d75));}}
 addSceneEffects(){
  this.props.extra=[];
  if(this.page===1){
   const mat=new THREE.MeshBasicMaterial({color:0xb8ceff,transparent:true,opacity:.45});
   for(let i=0;i<44;i++){
    let drop=this.add(this.environment,new THREE.CylinderGeometry(.008,.008,.3,4),mat,(Math.random()-.5)*8,Math.random()*5-1,-3+Math.random()*1.8);
    drop.rotation.z=-.16;drop.userData={start:drop.position.y,speed:.65+Math.random()*1.2};this.props.extra.push(drop);
   }
  }
  if(this.page===17){
   for(let i=0;i<10;i++){
    let group=new THREE.Group();group.position.set(-5+(i%5)*1.7,-.05+Math.floor(i/5)*1.3,-2.3-i*.25);
    this.environment.add(group);
    const gold=this.mat(i%2?0xf9ce87:0xffe6ac,.18,.3,0xac6a24);
    this.sphere(group,0,0,0,.22,gold).scale.set(1.55,.6,.56);
    let tail=this.add(group,new THREE.ConeGeometry(.20,.45,6),gold,-.39,0,0);tail.rotation.z=Math.PI/2;
    this.sphere(group,.23,.05,.14,.036,this.mat(0x47354a));
    group.userData={base:group.position.clone(),offset:i*.72};this.props.extra.push(group);
   }
  }
  if(this.page===18){
   const colors=[0xf3a1c3,0xffdf8b,0xc8a9f6,0x90f1dc];
   for(let i=0;i<19;i++){
    let g=new THREE.Group();g.position.set((i%10-4.5)*.84,-1.31,(Math.floor(i/10)?-1.2:2)+.16*Math.sin(i*7));
    this.environment.add(g);let c=this.mat(colors[i%4]);
    this.cyl(g,0,.15,0,.019,.023,.30,this.mat(0x75b98c));
    for(let j=0;j<5;j++){let a=j*Math.PI*2/5;this.sphere(g,Math.cos(a)*.12,.37+Math.sin(a)*.12,0,.112,c).scale.set(.8,1.18,.65);}
    this.sphere(g,0,.36,.08,.071,this.mat(0xffeeae));g.userData={base:g.position.clone(),offset:i*.15};this.props.extra.push(g);
   }
  }
  if(this.page===20){
   const colors=[0xef90ab,0xffcd83,0xf9efaf,0x90dbb3,0x8db9ed,0xbba0ea];
   for(let i=0;i<colors.length;i++){
    const geo=new THREE.TorusGeometry(2.2+i*.16,.065,7,110,Math.PI);
    let arc=this.add(this.environment,geo,new THREE.MeshBasicMaterial({color:colors[i],transparent:true,opacity:.75}),0,-.58,-4.5);
    arc.scale.setScalar(.94);this.props.extra.push(arc);
   }
  }
  if(this.page===14||this.page===15){
   for(let i=0;i<4;i++){
    const ring=this.add(this.environment,new THREE.TorusGeometry(.62+i*.28,.035,7,40),new THREE.MeshBasicMaterial({color:0xffe5a2,transparent:true,opacity:.0}),0,.45,-1.5);
    ring.userData={offset:i};this.props.extra.push(ring);
   }
  }
 }
 resetActors(){let set=BOOK[this.page-1].set;const who=this.people;for(const p of Object.values(who)){p.root.visible=false;p.root.rotation.set(0,0,0);p.body.rotation.set(0,0,0);p.root.scale.setScalar(1);}who.lia.root.visible=!(this.page===19);who.pingo.root.visible=!(this.page===19);who.luma.root.visible=[4,6,10,11,12,13,14,15,16,20,21].includes(this.page);who.coruja.root.visible=this.page===19;
  who.lia.root.position.set(-.82,0,.65);who.pingo.root.position.set(.72,-.2,.9);who.luma.root.position.set(1.25,.7,.15);who.coruja.root.position.set(0,.2,0);
  if(['room','portal'].includes(set)){who.lia.root.position.x=-1.15;who.pingo.root.position.x=.2;who.luma.root.position.x=1.65;}
  if(this.page===10||this.page===11||this.page===12){who.luma.root.position.set(1,.3,-.4);who.luma.root.scale.setScalar(.6);}
  if(this.page===15){who.luma.root.scale.setScalar(.9);}
  if(this.page===19){who.coruja.root.position.set(0,.4,0);}
  if(this.page===24){who.lia.root.rotation.z=-.9;who.lia.root.position.set(-.9,-.38,1);who.pingo.root.position.set(.3,-.4,1);}
  this.bases={};for(const [k,a] of Object.entries(who))this.bases[k]=a.root.position.clone();
 }
 setPage(p){this.page=p;this.action=null;this.elapsed=0;this.dragX=0;if(this.use3D){this.buildSet(BOOK[p-1].set);this.bubbleBases=this.props.bubbles?.map(b=>b.position.y)||[];this.addSceneEffects();this.resetActors();this.stopModelAction();}else this.notice.textContent='';}
 start(kind,done){if(this.action)this.finish();let captions={rain:'O céu se ilumina…',knock:'Toc, toc, toc! Quem está chamando?',portal:'A maçaneta começa a brilhar…',door:'A porta se abre para outro mundo!',listen:'Uma voz suave chama Lia…',reveal:'Bem-vindo ao Reino Estelar!',introduce:'A missão de Luma começa!',fork:'Dois caminhos aparecem!',bubbles:'Bolhas brilhantes flutuam no ar!',jump:'Um salto de coragem!',forest:'Os vagalumes revelam a trilha!',walk:'Os amigos seguem juntos!',lake:'O lago guarda um segredo…',boat:'O barquinho navega pelo lago!',lilypad:'A vitória-régia desliza pelo lago!',encourage:'O brilho de Luma fica mais forte!',stairs:'Cada degrau canta uma nota!',bell:'O Sino da Lua desperta!',starburst:'O Reino Estelar volta a brilhar!',thanks:'Uma promessa de amizade!',fish:'Peixes dourados voam entre estrelas!',bloom:'A floresta floresce!',owl:'A coruja compartilha sua sabedoria!',rainbow:'Um arco-íris abre o caminho!',keepsake:'Uma pequena estrela de presente!',home:'Estamos de volta ao quarto!',hug:'Um abraço cheio de alegria!',sleep:'Boa noite, Lia e Pingo…'};
  this.action={kind,start:performance.now(),duration:kind==='starburst'||kind==='bell'||kind==='door'?4800:kind==='sleep'?4400:3400,done};this.setModelAction(kind);return captions[kind]||'A magia acontece!';}
 finish(){const old=this.action;if(!old)return;this.action=null;this.stopModelAction();if(old.done)old.done();}
 stopModelAction(){if(!this.modelMixer)return;let idle=this.modelClips.find(a=>/idle|stand|breath|parad|respira/i.test(a.name))||this.modelClips[0];this.modelMixer.stopAllAction();if(idle)this.modelMixer.clipAction(idle).reset().fadeIn(.2).play();}
 setModelAction(kind){if(!this.modelMixer)return;let pat=/idle/;if(/walk|stairs|forest|home|rainbow|reveal|boat|lilypad/.test(kind))pat=/walk|run|andar|caminh|corr/i;else if(/jump|bubbles|starburst/.test(kind))pat=/jump|hop|saltar|pular/i;else if(/hug|thanks|encourage|introduce|bell/.test(kind))pat=/wave|clap|dance|happy|abraç|comemor/i;let match=this.modelClips.find(a=>pat.test(a.name))||this.modelClips.find(a=>/idle|stand|breath/i.test(a.name));if(!match)return;this.modelMixer.stopAllAction();const a=this.modelMixer.clipAction(match);a.reset().fadeIn(.12).play();}
 frame3D(dt,seconds,p){
  const t=seconds,kind=this.action?.kind||'',q=Math.min(1,p||0),smooth=q*q*(3-2*q),pulse=Math.sin(Math.PI*q),hop=(v)=>Math.max(0,Math.sin(v*Math.PI));
  const lia=this.people.lia,fox=this.people.pingo,star=this.people.luma,owl=this.people.coruja;
  for(const [name,actor] of Object.entries(this.people)){
   actor.root.position.copy(this.bases[name]);actor.root.rotation.set(0,0,0);
   actor.root.scale.setScalar(name==='luma'&&[10,11,12].includes(this.page)?.64:name==='luma'&&this.page===15?.9:1);
   actor.body.rotation.set(0,0,0);
  }
  lia.root.position.y+=.019*Math.sin(t*1.8);lia.body.rotation.z=Math.sin(t*1.7)*.018;
  lia.arms.forEach((a,i)=>{a.rotation.set(0,0,(i?-.08:.08)+.06*Math.sin(t*1.5+i));});
  lia.legs.forEach((leg,i)=>leg.rotation.set(0,0,0));
  fox.root.position.y+=Math.sin(t*2)*.018;fox.tail.rotation.y=Math.sin(t*3.1)*.24;fox.tail.rotation.x=-.1+Math.sin(t*2.3)*.1;
  star.root.position.y+=Math.sin(t*2.5)*.10;star.body.rotation.z=Math.sin(t*.9)*.08;star.light.intensity=2.0+.32*Math.sin(t*3.6);
  owl.root.position.y+=Math.sin(t)*.025;
  if(this.props.door)this.props.door.rotation.y=0;
  if(this.props.bell)this.props.bell.rotation.z=0;
  if(this.props.boat)this.props.boat.position.x=0;
  if(this.props.lily)this.props.lily.position.x=.5;
  if(this.props.bubbles)this.props.bubbles.forEach((b,i)=>{b.position.y=(this.bubbleBases?.[i]??b.position.y)+Math.sin(t*1.1+i)*.065;});
  // Cada ação tem uma coreografia própria. Nada de 'andar' para todas as escolhas.
  if(kind==='rain'){this.fillLight.intensity=1.9+.6*hop(q);lia.root.rotation.y=-.13*hop(q);fox.root.rotation.y=-.28*hop(q);}
  else if(kind==='knock'){if(this.props.door){this.props.door.rotation.y=Math.sin(q*Math.PI*6)*.038*pulse;}lia.root.rotation.y=-.12;fox.root.rotation.y=.2;}
  else if(kind==='listen'){lia.root.position.x+=.45*smooth;lia.root.rotation.z=-.11*pulse;lia.root.rotation.y=.2*pulse;fox.root.position.x+=.16*smooth;/* porta continua fechada */}
  else if(kind==='portal'){star.root.scale.setScalar(.55+.4*pulse);star.root.position.y+=.3*pulse;lia.root.rotation.y=-.25*pulse;this.fillLight.intensity=1.9+1.8*pulse;}
  else if(kind==='door'){
   const reach=Math.min(1,q*3),opened=Math.max(0,Math.min(1,(q-.28)/.56));
   lia.root.position.x+=.45*reach;lia.arms[1].rotation.x=-.42*reach;lia.arms[1].rotation.z=-.9*reach;
   if(this.props.door)this.props.door.rotation.y=-Math.PI*.75*opened;this.fillLight.intensity=2+2.3*opened;
   fox.root.position.x+=.14*opened;
  }
  else if(kind==='fork'){lia.root.rotation.y=-.28*pulse;fox.root.rotation.y=.32*pulse;lia.arms[1].rotation.z=-.55*pulse;}
  else if(kind==='jump'||kind==='bubbles'){
   const jumpHeight=kind==='bubbles'?Math.max(hop(q*2.1),hop(q*2.1-.58)*.55):hop(q);
   lia.root.position.x+=smooth*(kind==='bubbles'?1.55:1.08);lia.root.position.y+=jumpHeight*.98;
   fox.root.position.x+=smooth*(kind==='bubbles'?1.25:.98);fox.root.position.y+=hop(Math.max(0,q-.1)/.9)*.7;
   lia.legs.forEach((leg,i)=>leg.rotation.x=(i?-.42:.42)*jumpHeight);
   lia.arms[0].rotation.z=.65*jumpHeight;lia.arms[1].rotation.z=-.65*jumpHeight;
  }
  else if(['forest','walk','stairs','home','rainbow','reveal','introduce'].includes(kind)){
   const speed=kind==='stairs'?.55:kind==='reveal'?.6:.98;
   lia.root.position.x+=smooth*speed;fox.root.position.x+=smooth*speed*.9;
   const stride=Math.sin(q*19)*pulse;
   lia.legs.forEach((leg,i)=>leg.rotation.x=(i?-.58:.58)*stride);
   lia.arms.forEach((a,i)=>a.rotation.x=(i?.25:-.25)*stride);
   if(kind==='rainbow'){lia.root.position.z-=smooth*.5;star.root.position.y+=smooth*.55;}
   if(kind==='home'){lia.root.rotation.y=-.20*pulse;}
   if(kind==='introduce'){lia.arms[1].rotation.z=-.70*pulse;}
  }
  else if(kind==='lake'){lia.root.rotation.y=-.14*pulse;star.root.position.y-=.18*pulse;}
  else if(kind==='boat'||kind==='lilypad'){
   const dx=1.6*smooth,rideY=Math.sin(q*Math.PI*5)*.025;
   if(kind==='boat'&&this.props.boat)this.props.boat.position.x=dx;
   if(kind==='lilypad'&&this.props.lily)this.props.lily.position.x=.5+dx;
   // A personagem acompanha o transporte escolhido, em vez de andar sozinha pela água.
   lia.root.position.x+=dx;fox.root.position.x+=dx;lia.root.position.y+=rideY;fox.root.position.y+=rideY;
   lia.legs.forEach(leg=>{leg.rotation.x=-.15*pulse;});
  }
  else if(kind==='encourage'||kind==='thanks'){
   lia.root.rotation.y=.14*pulse;lia.arms[1].rotation.z=-.90*pulse;
   star.root.position.x-=.28*smooth;star.root.position.y+=.45*pulse;
   const baseStar=[10,11,12].includes(this.page)?.64:1;star.root.scale.setScalar(baseStar+.38*smooth);
   star.light.intensity=2+2.1*pulse;
  }
  else if(kind==='bell'){
   lia.root.position.x+=.4*smooth;lia.arms[1].rotation.z=-.88*pulse;
   if(this.props.bell)this.props.bell.rotation.z=Math.sin(q*42)*.33*pulse;
   star.root.position.y+=.36*pulse;star.light.intensity=2+2.8*pulse;
  }
  else if(kind==='starburst'){
   star.root.position.y+=smooth*1.28;star.root.scale.setScalar(.9+smooth*.75);star.body.rotation.z=q*Math.PI*2;
   lia.arms[0].rotation.z=.8*pulse;lia.arms[1].rotation.z=-.8*pulse;
   fox.root.position.y+=Math.max(0,Math.sin(q*5*Math.PI))*.18;
   star.light.intensity=2+4*pulse;this.fillLight.intensity=2+3*pulse;
  }
  else if(kind==='hug'){
   const approach=Math.min(1,q*2.4);
   lia.root.position.x+=approach*.55;fox.root.position.x-=approach*.38;
   lia.root.rotation.z=-.12*pulse;lia.arms[0].rotation.z=.8*pulse;lia.arms[1].rotation.z=-.8*pulse;
   fox.root.position.y+=.22*pulse;
  }
  else if(kind==='sleep'){
   lia.root.rotation.z=-1.12*smooth;lia.root.position.x-=.45*smooth;lia.root.position.y-=.21*smooth;
   fox.root.rotation.z=.23*smooth;fox.root.position.y-=.15*smooth;
  }
  else if(kind==='owl'){owl.root.rotation.z=Math.sin(q*Math.PI*4)*.08*pulse;owl.root.rotation.y=.24*pulse;}
  else if(kind==='bloom'){fox.root.rotation.y=.38*pulse;fox.root.position.y+=.1*pulse;}
  else if(kind==='fish'){lia.root.rotation.y=-.28*pulse;lia.arms[1].rotation.z=-.72*pulse;fox.root.rotation.y=-.18*pulse;}
  else if(kind==='keepsake'){star.root.position.x-=.46*smooth;star.root.position.y-=.38*smooth;lia.arms[1].rotation.z=-.8*pulse;star.light.intensity=2+2*pulse;}
  if(!['rain','portal','door','starburst'].includes(kind))this.fillLight.intensity=THREE.MathUtils.lerp(this.fillLight.intensity,1.9,Math.min(1,dt*5));
  // Cenário responde a ações específicas sem trocar o texto narrado.
  if(this.page===1){for(const drop of this.props.extra||[]){drop.position.y=drop.userData.start-((t*drop.userData.speed)%5);if(drop.position.y< -1.4)drop.position.y+=5;}}
  if(this.page===17){for(const fish of this.props.extra||[]){fish.position.x=fish.userData.base.x+Math.sin(t*.75+fish.userData.offset)*1.3+(kind==='fish'?smooth*1.0:0);fish.position.y=fish.userData.base.y+Math.sin(t*1.4+fish.userData.offset)*.38;fish.rotation.y=Math.sin(t*.75+fish.userData.offset)>.0?0:Math.PI;}}
  if(this.page===18){for(const flower of this.props.extra||[]){let spread=kind==='bloom'?.2+.8*Math.min(1,Math.max(0,(q*1.6-flower.userData.offset*.16))):.8;flower.scale.setScalar(spread);}}
  if(this.page===20){for(const rainbow of this.props.extra||[]){rainbow.material.opacity=kind==='rainbow'?.35+.6*pulse:.3;rainbow.position.y=-.58+(kind==='rainbow'?.26*smooth:0);}}
  if(this.page===14||this.page===15){for(const ring of this.props.extra||[]){const v=kind==='bell'||kind==='starburst'?pulse:0;ring.material.opacity=.04+.6*v;ring.scale.setScalar(1+v*(1+ring.userData.offset*.32));}}
  const frame=kind==='reveal'||kind==='rainbow'?1:0,orb=this.dragX;
  const distance=6.9-.7*pulse,camX=orb*2.2+(kind==='door'?.38*smooth:0),camY=.85+(frame?.45*smooth:0);
  this.camera.position.lerp(new THREE.Vector3(camX,camY,distance),Math.min(1,dt*3));
  this.camera.lookAt(0,-.12,-.6);this.modelMixer?.update(dt);this.dust.rotation.y=t*.009;
  this.renderer.render(this.scene,this.camera);
 }
 initFallbackGradient(ctx,w,h,palette){const g=ctx.createLinearGradient(0,0,0,h);palette.forEach(([p,color])=>g.addColorStop(p,color));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 frame2D(t,p){const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,mode=BOOK[this.page-1].set,kind=this.action?.kind||'',arc=Math.sin(Math.PI*(p||0));ctx.save();this.initFallbackGradient(ctx,w,h,mode==='room'||mode==='portal'?[[0,'#22203d'],[1,'#755078']]:mode==='forest'?[[0,'#153847'],[1,'#326970']]:mode==='lake'?[[0,'#182a57'],[1,'#447ca3']]:[[0,'#1a1949'],[1,'#604087']]);
  const s=Math.min(w/740,h/470);ctx.translate(w/2,h*.59);ctx.scale(s,s);
  for(let i=0;i<68;i++){const x=Math.sin(i*142.1)*355,y=Math.cos(i*78.3)*220-70;ctx.fillStyle=`rgba(255,226,173,${.16+.36*(.5+.5*Math.sin(t+i))})`;ctx.beginPath();ctx.arc(x,y,1+(i%4)*.55,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#2e284f';ctx.beginPath();ctx.ellipse(0,195,430,48,0,0,Math.PI*2);ctx.fill();
  if(mode==='room'||mode==='portal'){ctx.fillStyle='#694979';ctx.fillRect(154,-125,140,247);ctx.strokeStyle='#d3ad81';ctx.lineWidth=8;ctx.strokeRect(154,-125,140,247);ctx.fillStyle='#473463';ctx.fillRect(169,-110,110,217);if(['door','portal','listen'].includes(kind)){ctx.save();ctx.shadowColor='#dc9cff';ctx.shadowBlur=55*arc;ctx.fillStyle=`rgba(221,173,255,${.9*arc})`;ctx.fillRect(171,-107,106*arc,212);ctx.restore();}ctx.fillStyle='#ffe2aa';ctx.beginPath();ctx.arc(266,0,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#94a6dc';ctx.fillRect(-338,-133,120,106);ctx.strokeStyle='#d6bbdd';ctx.strokeRect(-338,-133,120,106);}
  if(mode==='forest'||mode==='fork'){for(let i=0;i<9;i++){let x=-375+i*93;ctx.strokeStyle='#624e65';ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(x,200);ctx.lineTo(x,-80);ctx.stroke();ctx.fillStyle=i%2?'#527e80':'#477071';ctx.beginPath();ctx.arc(x,-92,70,0,Math.PI*2);ctx.fill();}}
  if(mode==='bubbles'||mode==='fork'){for(let i=0;i<6;i++){ctx.strokeStyle='#deb6fd9c';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-270+i*100,135-Math.sin(t*2+i)*20,38+i%2*7,0,Math.PI*2);ctx.stroke();}}
  if(mode==='lake'){ctx.fillStyle='#81a9c98a';ctx.beginPath();ctx.ellipse(0,145,390,75,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a5745f';ctx.beginPath();ctx.ellipse(-100+arc*70,108,75,22,0,0,Math.PI*2);ctx.fill();}
  if(mode==='stairs'||mode==='tower'){ctx.fillStyle='#9c83c2';for(let i=0;i<6;i++)ctx.fillRect(-200+i*55,168-i*37,120,26);if(mode==='tower'){ctx.fillStyle='#d9b577';ctx.beginPath();ctx.moveTo(100,-160);ctx.lineTo(172,-160);ctx.lineTo(190,0);ctx.lineTo(80,0);ctx.fill();}}
  if(mode==='sky'){for(let i=0;i<5;i++){ctx.fillStyle='#7a79b4';ctx.beginPath();ctx.ellipse(-290+i*145,100+Math.sin(i+t*.3)*12,110,24,0,0,Math.PI*2);ctx.fill();}}
  // Efeitos desenhados no modo alternativo: cada ação ainda tem uma consequência visual.
  if(kind==='rain'||kind==='knock') {ctx.strokeStyle=`rgba(184,204,250,${.15+.3*arc})`;ctx.lineWidth=2;for(let i=0;i<35;i++){const x=(i*71+t*22)%760-380, y=(i*61+t*85)%470-240;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+16);ctx.stroke();}}
  if(kind==='rainbow'||kind==='reveal') {for(let i=0;i<5;i++){ctx.strokeStyle=['#efa2cf','#fce1aa','#8be6cc','#9dc5ff','#bda8fb'][i];ctx.lineWidth=12;ctx.globalAlpha=.25+.65*arc;ctx.beginPath();ctx.arc(0,200,210+i*15,Math.PI,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;}
  if(kind==='bell'||kind==='starburst'){ctx.save();ctx.font='110px Georgia';ctx.textAlign='center';ctx.shadowColor='#ffdc83';ctx.shadowBlur=30+50*arc;ctx.fillStyle='#ffe19d';ctx.fillText('✦',0,-80);ctx.restore();}
  if(kind==='fish'){for(let i=0;i<8;i++){const x=-360+(i*81+t*28)%750,y=-100+Math.sin(t*1.6+i)*42+i*12;ctx.save();ctx.translate(x,y);ctx.fillStyle='#f3d590';ctx.beginPath();ctx.ellipse(0,0,20,9,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-15,0);ctx.lineTo(-31,-12);ctx.lineTo(-31,12);ctx.fill();ctx.restore();}}
  if(kind==='bloom'||kind==='forest'){for(let i=0;i<28;i++){const x=-340+(i*67)%700,y=110+Math.sin(i*4+t)*28;ctx.fillStyle=`rgba(255,214,177,${.3+.5*arc})`;ctx.beginPath();ctx.arc(x,y,2+(i%3)*3,0,7);ctx.fill();}}
  if(kind==='boat'||kind==='lilypad'){ctx.save();ctx.translate(-130+arc*190,110);ctx.fillStyle=kind==='boat'?'#f4c8aa':'#abda9f';ctx.beginPath();ctx.ellipse(0,0,95,18,0,0,7);ctx.fill();ctx.restore();}
  if(kind==='owl'){ctx.fillStyle='#f4d1ab';ctx.font='21px Georgia';ctx.textAlign='center';ctx.fillText('A coragem cresce com gentileza',0,-165);}
  if(kind==='keepsake'){ctx.save();ctx.shadowColor='#ffe0a2';ctx.shadowBlur=30+arc*45;ctx.fillStyle='#ffe0a2';ctx.font='55px Georgia';ctx.textAlign='center';ctx.fillText('★',25,-165);ctx.restore();}
  const drawGirl=(x,y)=>{ctx.save();ctx.translate(x,y-arc*35);ctx.fillStyle='#3e2c47';ctx.beginPath();ctx.ellipse(0,-90,45,51,0,0,7);ctx.fill();ctx.fillStyle='#f7be9c';ctx.beginPath();ctx.ellipse(0,-86,35,38,0,0,7);ctx.fill();ctx.fillStyle='#b677ac';ctx.beginPath();ctx.moveTo(-32,-43);ctx.lineTo(32,-43);ctx.lineTo(38,62);ctx.lineTo(-38,62);ctx.fill();ctx.fillStyle='#f7be9c';ctx.fillRect(-43,-40,12,70);ctx.fillRect(31,-40,12,70);ctx.fillStyle='#725879';ctx.fillRect(-24,60,17,57);ctx.fillRect(9,60,17,57);ctx.fillStyle='#202136';for(const a of [-13,13]){ctx.beginPath();ctx.arc(a,-85,4,0,7);ctx.fill();}ctx.restore();};
  const drawFox=(x,y)=>{ctx.save();ctx.translate(x,y-arc*22);ctx.fillStyle='#d77e36';ctx.beginPath();ctx.ellipse(0,0,53,37,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-35,-15);ctx.lineTo(-32,-71);ctx.lineTo(-4,-31);ctx.lineTo(17,-71);ctx.lineTo(40,-15);ctx.fill();ctx.fillStyle='#ffe8be';ctx.beginPath();ctx.ellipse(0,5,33,23,0,0,7);ctx.fill();ctx.fillStyle='#30263c';for(let x of [-13,13]){ctx.beginPath();ctx.arc(x,-11,4,0,7);ctx.fill();}ctx.restore();};
  if(this.page!==19){drawGirl(-110+arc*20,40);drawFox(130+arc*12,125);}else{ctx.font='bold 145px serif';ctx.textAlign='center';ctx.fillText('🦉',0,80);}
  if([4,6,10,11,12,13,14,15,16,20,21].includes(this.page)){ctx.save();ctx.translate(240,0-arc*42);ctx.font='bold 105px serif';ctx.textAlign='center';ctx.shadowColor='#ffd274';ctx.shadowBlur=30;ctx.fillText('★',0,0);ctx.restore();}
  if(kind==='starburst'||kind==='bell'){ctx.fillStyle=`rgba(255,233,183,${.2*arc})`;ctx.fillRect(-400,-270,800,560);}ctx.restore();}
 async loadRemoteGLB(url,silent=false){if(!this.use3D||!THREE.GLTFLoader)return;try{const loader=new THREE.GLTFLoader();loader.load(url,g=>this.integrateGLB(g,url),undefined,e=>{if(!silent)console.warn('Falha GLB',e);});}catch(e){if(!silent)throw e;}}
 importGLB(file){return new Promise((resolve,reject)=>{if(!this.use3D||!THREE.GLTFLoader){reject(new Error('Carregador 3D indisponível. Verifique a conexão.'));return;}if(!file.name.toLowerCase().endsWith('.glb')){reject(new Error('É necessário um arquivo .GLB. O modelo .MAX não funciona no navegador.'));return;}if(file.size>100*1024*1024){reject(new Error('Modelo maior que 100 MB. Otimize antes de importar.'));return;}const url=URL.createObjectURL(file);new THREE.GLTFLoader().load(url,g=>{try{this.integrateGLB(g,file.name);resolve();}catch(e){reject(e);}finally{URL.revokeObjectURL(url);}},undefined,e=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível abrir o GLB. Use um GLB com texturas incorporadas.'));});});}
 integrateGLB(gltf,name){if(!gltf.scene)throw Error('Arquivo sem geometria 3D.');let content=gltf.scene,box=new THREE.Box3().setFromObject(content),size=new THREE.Vector3(),center=new THREE.Vector3();box.getSize(size);box.getCenter(center);if(!size.y||!isFinite(size.y))throw Error('Modelo sem altura válida.');const standardHeight=2.58,scale=standardHeight/size.y;let holder=new THREE.Group();holder.scale.setScalar(scale);content.position.set(-center.x,-box.min.y-1.20/scale,-center.z);holder.add(content);
  const girl=this.people.lia;if(this.model){girl.root.remove(this.model);this.model=null;}girl.body.visible=false;girl.root.add(holder);this.model=holder;
  if(this.modelMixer){this.modelMixer.stopAllAction();if(this.modelContent)this.modelMixer.uncacheRoot(this.modelContent);}this.modelContent=content;this.modelClips=gltf.animations||[];this.modelMixer=this.modelClips.length?new THREE.AnimationMixer(content):null;this.stopModelAction();this.importName=name;
 }
 resize(){const rect=this.canvas.getBoundingClientRect();const w=Math.max(100,Math.round(rect.width)),h=Math.max(100,Math.round(rect.height));this.canvas.width=w*Math.min(devicePixelRatio||1,2);this.canvas.height=h*Math.min(devicePixelRatio||1,2);if(this.use3D){this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);}else this.ctx.setTransform(1,0,0,1,0,0);}
 tick(ms){const dt=Math.min(.05,(ms-this.clock)/1000||0);this.clock=ms;this.elapsed+=dt;let p=0;if(this.action){p=Math.min(1,(ms-this.action.start)/this.action.duration);}if(!document.hidden){if(this.use3D)this.frame3D(dt,this.elapsed,p);else this.frame2D(this.elapsed,p);}if(this.action&&p>=1)this.finish();requestAnimationFrame(t=>this.tick(t));}
}
