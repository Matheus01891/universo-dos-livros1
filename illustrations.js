'use strict';
/* Ilustração 2D independente da conexão. As mesmas ações possuem estados visuais distintos. */
StoryCinema.prototype.frame2D=function(t,p){
 const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,page=BOOK[this.page-1],mode=page.set,kind=this.action?.kind||'',q=p||0;
 const ease=q*q*(3-2*q),pulse=Math.sin(Math.PI*q),osc=Math.sin(t*2.6),jump=(v)=>Math.max(0,Math.sin(Math.PI*v));
 const theme={room:['#bdb2e9','#584177','#c89bab'],portal:['#c1a4ec','#58377b','#9271c7'],sky:['#8b99e5','#6653b9','#6f8bc7'],fork:['#9db4d9','#5f65b5','#7cb0a5'],forest:['#6ebcaf','#365a83','#599484'],bubbles:['#b2b9ed','#7365b5','#84a5d3'],lake:['#88c5d9','#4d7aac','#82c2c7'],stairs:['#c1b8ea','#826ab6','#a2a4dd'],tower:['#ae9bd8','#62518c','#9685c9']}[mode]||['#b4addc','#6956a0','#a3accd'];
 const grad=(x,y,X,Y,stops)=>{let g=ctx.createLinearGradient(x,y,X,Y);stops.forEach(([v,c])=>g.addColorStop(v,c));return g;};
 const ellipse=(x,y,rx,ry,c)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();};
 const rounded=(x,y,b,hh,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,b,hh,r);ctx.fill();};
 const line=(arr,color,width=3)=>{ctx.beginPath();ctx.moveTo(arr[0],arr[1]);for(let k=2;k<arr.length;k+=2)ctx.lineTo(arr[k],arr[k+1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
 const circle=(x,y,r,color)=>ellipse(x,y,r,r,color);
 const glow=(x,y,r,c)=>{let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'#ffffff00');ellipse(x,y,r,r,g);};
 const starPath=(x,y,r,small=.52)=>{ctx.beginPath();for(let i=0;i<10;i++){let a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*small:r,xx=x+rr*Math.cos(a),yy=y+rr*Math.sin(a);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();};
 const flower=(x,y,r,col)=>{for(let j=0;j<5;j++){let a=j*Math.PI*2/5;ellipse(x+Math.cos(a)*r*.72,y+Math.sin(a)*r*.72,r*.54,r*.55,col);}circle(x,y,r*.38,'#ffe4a5');};
 ctx.save();ctx.clearRect(0,0,w,h);ctx.fillStyle=grad(0,0,w,h,[[0,theme[0]],[.66,theme[1]],[1,theme[2]]]);ctx.fillRect(0,0,w,h);
 const s=Math.min(w/740,h/495);ctx.translate(w/2,h*.58);ctx.scale(s,s);
 glow(-185,-140,290,mode==='forest'?'#99ecbe45':'#ffdfdb59');glow(250,-110,240,'#edd4fa67');
 // Fundo em três camadas com estrelas estáticas e flutuantes.
 for(let i=0;i<60;i++){let xx=Math.sin(i*34.7)*356, yy=Math.cos(i*85.1)*224-70;let size=.85+(i%4)*.62;ctx.globalAlpha=.25+.48*(.5+.5*Math.sin(i*1.4+t*.6));circle(xx,yy,size,'#fff9d9');}ctx.globalAlpha=1;
 const isHome=['room','portal'].includes(mode),isSky=['sky','fork','bubbles','stairs'].includes(mode);
 if(isHome){
  // Quarto de conto de fadas, janela estrelada e tapete bordado.
  rounded(-380,-245,760,470,18,grad(0,-240,0,220,[[0,'#806ea9'],[1,'#b395b5']]));
  ctx.fillStyle='#ca9cba';ctx.fillRect(-380,90,760,145);
  rounded(-356,-208,205,176,18,'#d7c2ec');rounded(-342,-195,177,151,9,'#7a83bd');
  let glass=grad(-340,-190,-200,-35,[[0,'#495796'],[1,'#8fb4cf']]);rounded(-333,-187,160,134,8,glass);
  line([-254,-186,-254,-54],'#dec9e9',9);line([-337,-118,-171,-118],'#dec9e9',9);
  for(let i=0;i<13;i++)circle(-316+(i*53)%137,-174+(i*37)%108,2+(i%2),'#fff5cf');
  rounded(-366,-47,231,17,8,'#f4dcca');
  // Cama ao fundo com travesseiros de nuvens.
  rounded(-380,45,165,75,16,'#8c5d90');rounded(-380,54,153,62,10,'#de98bb');ellipse(-306,51,68,26,'#f7d6e3');
  for(let i=0;i<12;i++)circle(-322+i*12,117+Math.sin(i)*4,2,'#ffe9ca');
  rounded(-110,123,325,78,80,'#d3b2cf');ellipse(52,180,187,28,'#bd8cc0');
  // Estante e varinha na parede
  rounded(15,-203,79,140,8,'#a27697');for(let y=-179;y< -70;y+=39)rounded(23,y,64,7,3,'#e4b1aa');
  for(let i=0;i<8;i++)rounded(24+i*7,-194+(i%3)*4,6,18-(i%3)*3,1,['#ffc877','#ad9ce4','#80b7b5'][i%3]);
  glow(194,-60,170,'#f6c9ff4f');
 } else if(mode==='forest'){
  ellipse(0,235,470,120,'#375d65');
  for(let i=0;i<13;i++){let x=-420+i*70,yy=45+(i%3)*33;rounded(x-9,-228,23,400,9,'#466377');
   ellipse(x,-160+(i%4)*18,83,94,i%2?'#41877f':'#478e96');ellipse(x+17,-212+(i%3)*19,65,68,i%2?'#569b8d':'#54a39d');}
  for(let i=0;i<14;i++){let x=-370+i*61,y=158+(i%3)*15;line([x,y+22,x,y-5],'#78b79b',4);ellipse(x,y-9,13,9,i%2?'#ffd6aa':'#e9b2f7');circle(x,y-7,3,'#fff9d9');}
  for(let i=0;i<28;i++){let x=-330+(i*79)%680,y=-180+(i*47)%320;glow(x,y,18,'#f9e59b1e');circle(x,y,2,'#fff1b8');}
 } else if(mode==='lake'){
  ellipse(0,225,530,150,'#548fa6');ellipse(0,136,480,125,grad(0,20,0,270,[[0,'#a5eff0'],[1,'#4c87b0']]));
  for(let i=0;i<12;i++){let x=-350+i*63,y=110+(i%4)*26;line([x,y,x+33,y],'#d2fcf1b3',2)}
  for(let i=0;i<8;i++){let x=-380+i*118;ellipse(x,-53-(i%3)*25,120,38,'#89bdd1');ellipse(x,-79-(i%2)*20,85,27,'#e2eafa80');}
  glow(164,-62,180,'#e8e0ff75');
 } else if(mode==='tower'){
  ellipse(0,218,480,110,'#725a9e');
  for(const x of [-190,182]){rounded(x-44,-232,88,390,20,'#c3a9db');rounded(x-39,-232,18,390,9,'#dac8ed');}
  rounded(-220,-220,440,43,12,'#e0c7e9');rounded(-245,116,490,64,16,'#b59dcc');
  ctx.save();ctx.translate(0,-75);glow(0,0,160,'#fff3ac9c');line([0,-108,0,-35],'#765478',10);ctx.fillStyle=grad(0,-30,0,76,[[0,'#ffe9a4'],[1,'#bb7d52']]);ctx.beginPath();ctx.moveTo(-45,-33);ctx.lineTo(45,-33);ctx.quadraticCurveTo(48,22,70,47);ctx.quadraticCurveTo(0,78,-70,47);ctx.quadraticCurveTo(-48,22,-45,-33);ctx.fill();ellipse(0,51,71,12,'#ffe7aa');circle(0,61,15,'#987052');ctx.restore();
 } else {
  // Reino das ilhas suspensas, nuvens suaves e caminho celestial.
  for(let i=0;i<9;i++){let x=-440+i*116,y=-118+(i%3)*38;ellipse(x,y,83,25,'#e7e4fb99');ellipse(x-27,y-16,51,25,'#ecedffc4');ellipse(x+27,y-7,54,22,'#e7e1fbcc');}
  for(let i=0;i<5;i++){let x=-310+i*165,y=93+(i%3)*47;ellipse(x,y,125,40,'#7375ab');ctx.fillStyle='#536a9b';ctx.beginPath();ctx.moveTo(x-88,y+15);ctx.lineTo(x+85,y+15);ctx.lineTo(x+9,y+64);ctx.closePath();ctx.fill();ellipse(x,y-15,100,24,'#8ebca0');}
  ellipse(0,229,510,115,'#7a80b1');
  if(mode==='fork'){for(let i=0;i<6;i++)ellipse(-300+i*69,175-i*23,43,22,'#c5b8f2a8');for(let i=0;i<5;i++)ellipse(135+i*45,115-i*8,22,50,'#71c5a8a8');}
  if(mode==='bubbles'){for(let i=0;i<7;i++){let x=-305+i*103,y=150-(i%3)*60+Math.sin(t*1.3+i)*5;glow(x,y,65,'#edc1ff35');ctx.beginPath();ctx.ellipse(x,y,43,43,0,0,7);ctx.fillStyle='#e4deff42';ctx.fill();ctx.strokeStyle='#ffeaffaf';ctx.lineWidth=4;ctx.stroke();ellipse(x-14,y-15,12,6,'#ffffff9e');}}
  if(mode==='stairs'){for(let i=0;i<8;i++){let x=-310+i*73,y=160-i*32;rounded(x,y,150,27,8,'#d9cdf3');rounded(x,y+16,150,15,6,'#987bc9');}}
 }
 // Acessórios da cena, mostrados antes dos protagonistas.
 if(isHome){
  const hinge=kind==='door'?ease*.68:0,shiver=kind==='knock'?Math.sin(q*Math.PI*6)*2*pulse:0;
  ctx.save();ctx.translate(225+shiver,-75);glow(0,-10,170,kind==='portal'||kind==='door'?'#ffd3fdc8':'#edccff28');
  rounded(-78,-145,161,286,14,'#a9798e');rounded(-66,-137,132,273,10,'#edc79c');
  rounded(-56,-126,112,252,8,kind==='door'?'#ddbbf5':'#785d9e');
  for(let i=0;i<30;i++){let x=Math.sin(i*8.3)*46,y=-113+(i*63)%231;circle(x,y,1.5,'#ffebadad');}
  ctx.save();ctx.transform(1,0,-.34*hinge,1,-83*hinge,0);rounded(-56,-126,112,252,8,grad(-58,0,58,0,[[0,'#654d91'],[1,'#9174b1']]));rounded(-45,-112,90,102,7,'#8267a6');rounded(-45,7,90,107,7,'#8267a6');circle(31,2,7,'#f9d384');ctx.restore();ctx.restore();
 }
 if(mode==='lake'){
  const travel=['boat','lilypad'].includes(kind)?ease*140:0;
  if(kind==='lilypad'){ellipse(-32+travel,123,111,24,'#54986f');ellipse(-35+travel,111,100,27,'#a1df9e');flower(25+travel,100,20,'#f8bce9');}
  else {ellipse(-28+travel,135,120,33,'#735173');ctx.fillStyle='#ab7a69';ctx.beginPath();ctx.moveTo(-143+travel,103);ctx.lineTo(96+travel,103);ctx.lineTo(68+travel,152);ctx.lineTo(-117+travel,152);ctx.fill();line([-27+travel,105,-27+travel,-40],'#f2ddb3',6);ctx.fillStyle='#ffead5';ctx.beginPath();ctx.moveTo(-21+travel,-36);ctx.lineTo(63+travel,74);ctx.lineTo(-21+travel,80);ctx.fill();}
 }
 if(kind==='rainbow'){for(let i=5;i>=0;i--){ctx.beginPath();ctx.arc(20,220,195+i*12,Math.PI,0);ctx.lineWidth=14;ctx.strokeStyle=['#f6a7b1','#f9d9a2','#c7e8a6','#b6e5e8','#aeb6fa','#e1a7f2'][i];ctx.globalAlpha=.4+.5*pulse;ctx.stroke();}ctx.globalAlpha=1;}
 if(kind==='bloom'){for(let i=0;i<17;i++){let x=-355+i*44,y=150+(i%3)*17;flower(x,y,5+pulse*13,['#fff0bc','#ffb0d5','#d2b4ff'][i%3]);}}
 if(kind==='fish'){for(let i=0;i<9;i++){let x=-310+(i*75+t*21)%650,y=-125+(i%5)*44+Math.sin(t*2+i)*11;ellipse(x,y,21,10,'#f3d18f');ctx.fillStyle='#f8ae72';ctx.beginPath();ctx.moveTo(x-15,y);ctx.lineTo(x-36,y-12);ctx.lineTo(x-36,y+12);ctx.closePath();ctx.fill();circle(x+11,y-2,2,'#63486b');}}
 if(kind==='knock'){for(let i=0;i<3;i++){ctx.lineWidth=3;ctx.strokeStyle='#fceaa5';ctx.beginPath();ctx.arc(210+i*19,-145-i*9,9,0,Math.PI*1.2);ctx.stroke();}}
 // Sombra que sempre acompanha os pés dos personagens.
 if(this.page!==19){ellipse(-100,188,89,13,'#302d5754');ellipse(152,191,89,12,'#302d5754');}
 function drawGirl(x,y,params={}){
  let {wave=0,walk=0,jump:leap=0,tilt=0,turn=0}=params;
  ctx.save();ctx.translate(x,y-leap);ctx.rotate(tilt);ctx.scale(1-turn*.08,1);
  const el=(x,y,rx,ry,c)=>ellipse(x,y,rx,ry,c);
  // Mochila turquesa vista por trás dos braços.
  rounded(-45,-45,89,109,26,'#2e8296');rounded(-40,-42,80,99,24,'#51aabd');rounded(-30,-13,60,47,18,'#82d4d8');
  // Pernas e botas com sola.
  for(const z of [-1,1]){ctx.save();ctx.translate(z*25,50);ctx.rotate(z*walk);
   rounded(-16,0,32,71,12,'#eeb291');rounded(-17,47,34,38,12,'#743c70');rounded(-20,75,43,15,7,'#4a2957');line([-10,61,12,61],'#dca9ba',3);line([-10,67,12,67],'#dca9ba',3);ctx.restore();}
  // Shorts e blusa de algodão com jaqueta aberta.
  rounded(-47,20,94,45,16,'#b67f58');rounded(-39,41,35,26,10,'#a66c4a');rounded(5,41,34,26,10,'#a66c4a');
  el(0,-7,51,67,'#d9669c');rounded(-36,-45,72,45,21,'#f19ac2');
  for(const z of [-1,1]){ctx.save();ctx.translate(z*49,-29);ctx.rotate(z*(.15+wave*.65));
   el(z*5,18,17,29,'#b38bd8');el(z*7,32,14,17,'#dfb4e9');rounded(-10,41,20,45,9,'#edb08d');el(0,91,13,16,'#edaf8c');ctx.restore();}
  rounded(-42,-51,24,96,11,'#b48ad9');rounded(17,-51,24,96,11,'#b48ad9');
  // Pescoço e cabelo volumoso.
  rounded(-13,-74,26,24,10,'#e9ae8e');
  el(0,-132,65,71,'#4b293b');el(-56,-101,24,65,'#4b293b');el(56,-101,24,65,'#4b293b');
  el(0,-132,54,61,grad(-54,-125,54,-130,[[0,'#e9a683'],[.55,'#f8c6a4'],[1,'#e6a184']]));
  el(-53,-132,11,18,'#ecaf8f');el(53,-132,11,18,'#ecaf8f');
  // Olhos grandes mas com globo, íris, pupilas e brilho.
  for(const z of [-1,1]){el(z*21,-139,14,18,'#fffafa');el(z*21,-137,9,13,'#785047');el(z*21,-138,5,9,'#26212b');el(z*21-3,-145,3.5,4.3,'#fff');el(z*36,-111,13,5,'#f8a4a2');}
  el(0,-118,5,4,'#e49e8e');ctx.strokeStyle='#aa536b';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-116,13,.22,Math.PI-.22);ctx.stroke();
  // Franja em mechas arredondadas.
  el(0,-181,59,26,'#502d3f');
  for(let i=0;i<5;i++){el(-39+i*19,-176+Math.sin(i*2)*8,20,21,i%2?'#533248':'#664051');}
  ctx.restore();
 }
 function drawFox(x,y,params={}){
  let {jump:leap=0,turn=0}=params;ctx.save();ctx.translate(x,y-leap);ctx.rotate(turn);
  // Cauda espessa em camadas de pelo.
  ellipse(58,-27,71,29,'#c6773d');ellipse(99,-33,36,25,'#fff1d0');ellipse(60,-36,30,19,'#ed9544');
  ellipse(0,12,64,49,'#e89342');ellipse(-1,22,39,34,'#ffe7bb');
  for(const a of [-1,1]){ellipse(a*40,45,23,14,'#e18b3c');ellipse(a*34,49,16,6,'#a86046');}
  ellipse(0,-35,58,54,'#e99945');
  ctx.fillStyle='#dd7e38';ctx.beginPath();ctx.moveTo(-47,-50);ctx.lineTo(-34,-117);ctx.lineTo(-2,-74);ctx.lineTo(25,-119);ctx.lineTo(48,-55);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e9a4a0';ctx.beginPath();ctx.moveTo(-36,-68);ctx.lineTo(-28,-100);ctx.lineTo(-12,-74);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(15,-74);ctx.lineTo(27,-100);ctx.lineTo(39,-67);ctx.fill();
  ellipse(0,-17,40,31,'#fff0cf');
  for(let a of [-1,1]){ellipse(a*22,-42,9,11,'#fff9eb');ellipse(a*22,-41,6,9,'#4b3140');circle(a*20,-46,2.3,'#fff');ellipse(a*32,-20,10,5,'#f7b79a');}
  ellipse(0,-15,8,6,'#322b39');ctx.strokeStyle='#96525d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-13,12,.20,Math.PI-.20);ctx.stroke();
  ctx.restore();
 }
 function drawLuma(x,y,scale=1){ctx.save();ctx.translate(x,y+Math.sin(t*2.5)*10);ctx.rotate(Math.sin(t)*.07);ctx.scale(scale,scale);glow(0,0,135,'#ffe0a75c');starPath(0,0,75);ctx.fillStyle=grad(-65,-80,70,65,[[0,'#fff5bf'],[.55,'#ffdf82'],[1,'#f0ad59']]);ctx.shadowColor='#ffe1a0';ctx.shadowBlur=30;ctx.fill();ctx.shadowBlur=0;ellipse(-18,-2,5,7,'#5c3f54');ellipse(18,-2,5,7,'#5c3f54');ellipse(-34,16,14,7,'#f7ae9e');ellipse(34,16,14,7,'#f7ae9e');ctx.strokeStyle='#bd756d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,12,11,0,Math.PI);ctx.stroke();ellipse(-26,-23,16,8,'#fffef8a1');ctx.restore();}
 function drawOwl(x,y){ctx.save();ctx.translate(x,y);ellipse(0,0,74,97,'#946c55');ellipse(0,16,54,65,'#f4dbbc');ellipse(-66,18,25,58,'#694a55');ellipse(66,18,25,58,'#694a55');
  for(const a of [-1,1]){ctx.fillStyle='#9c7151';ctx.beginPath();ctx.moveTo(a*35,-74);ctx.lineTo(a*71,-127);ctx.lineTo(a*63,-55);ctx.fill();ellipse(a*28,-36,32,34,'#fff9ed');ellipse(a*28,-36,17,19,'#4f394a');ellipse(a*26,-42,7,7,'#fff');ctx.strokeStyle='#e3b65a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(a*28,-36,36,0,7);ctx.stroke();}rounded(-16,-42,33,7,3,'#e3b65a');ctx.fillStyle='#efc472';ctx.beginPath();ctx.moveTo(-12,-10);ctx.lineTo(12,-10);ctx.lineTo(0,14);ctx.fill();ctx.restore();}
 let dx=0,dy=0,foxX=0,foxY=0,wave=0,walk=0,tilt=0,turn=0,foxTurn=0;
 if(['jump','bubbles'].includes(kind)){dx=ease*135;foxX=ease*106;dy=jump(kind==='bubbles'?q*2:q)*80;foxY=jump(q)*65;walk=.25*pulse;wave=.15*pulse;}
 if(['forest','walk','stairs','home','rainbow','reveal','introduce'].includes(kind)){dx=ease*87;foxX=ease*90;walk=Math.sin(q*18)*pulse*.3;wave=kind==='introduce'?.9*pulse:0;}
 if(kind==='listen'){dx=40*ease;tilt=-.10*pulse;}
 if(kind==='door'){dx=35*ease;wave=1*pulse;}
 if(kind==='hug'){dx=ease*55;foxX=-ease*66;tilt=-.10*pulse;wave=.8*pulse;foxY=8*pulse;}
 if(kind==='rain'){turn=-.08*pulse;foxTurn=.12*pulse;}
 if(kind==='boat'||kind==='lilypad'){dx=140*ease;foxX=140*ease;dy=15;foxY=10;}
 if(kind==='bell'){dx=ease*25;wave=.9*pulse;}
 if(kind==='starburst'){wave=.95*pulse;foxY=jump(q*2)*20;}
 if(kind==='encourage'||kind==='thanks'){wave=.5*pulse;}
 if(kind==='fish'||kind==='fork'){wave=.6*pulse;}
 if(kind==='sleep'){tilt=-.65*ease;dy=40*ease;foxTurn=.18*ease;}
 if(this.page===19){drawOwl(3,53+Math.sin(t*1.5)*5);}else{
  drawGirl(-130+dx,59+Math.sin(t*1.5)*2,{wave,walk,jump:dy,tilt,turn});
  drawFox(115+foxX,151+Math.sin(t*2)*2,{jump:foxY,turn:foxTurn});
 }
 if([4,6,10,11,12,13,14,15,16,20,21].includes(this.page)){
  let sx=230,sy=-90,scale=[10,11,12].includes(this.page)?.56:1;
  if(kind==='encourage'||kind==='thanks'){sx-=25*ease;scale+=pulse*.34;}
  if(kind==='starburst'){sy-=100*ease;scale+=ease*.65;}
  if(kind==='keepsake'){sx-=90*ease;sy+=55*ease;}
  drawLuma(sx,sy,scale);
 }
 // Partículas acima dos atores para a magia parecer integrada à cena.
 if(['starburst','bell','portal','encourage','reveal','keepsake','bloom'].includes(kind)){
  for(let i=0;i<28;i++){let a=i*2.4+t*.4,r=35+(i%7)*19+50*pulse,x=(kind==='bell'?0:kind==='portal'?215:170)+Math.cos(a)*r,y=(kind==='bell'?-80:-65)+Math.sin(a)*r*.8;ctx.globalAlpha=.3+.6*pulse;circle(x,y,2+(i%3),'#fff1ad');}ctx.globalAlpha=1;
 }
 ctx.restore();
};
