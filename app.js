'use strict';
const $ = id => document.getElementById(id);
const FIN = 29;
const ICONOS = ['🤝','🔒','🪝','💬','🛡️','🔎','🎰'];
const COLORES = ['#713eb4','#26784c','#b95620','#246ca2','#a83369','#626125'];
const FICHAS = [
 ['🎮','Joystick'],['🚀','Cohete'],['🦊','Zorro'],['👾','Alien'],
 ['🎧','Auriculares'],['⚡','Rayo'],['🐱','Gato'],['🐉','Dragón'],
 ['🛹','Skate'],['🌈','Arcoíris'],['🔥','Fuego'],['🤖','Robot']
];
const seleccionFichas = [0,1,2,3,4,5];
function nombresConfigurados(){return $('names').value.split('\n').map(n=>n.trim()).filter(Boolean);}
function configurarFichas(){
 $('token-pickers').replaceChildren();
 nombresConfigurados().slice(0,6).forEach((name,i)=>{
  const label=texto('label','');const preview=texto('span',FICHAS[seleccionFichas[i]][0],'picker-preview');preview.setAttribute('aria-hidden','true');label.append(preview,texto('span',name));const select=document.createElement('select');
  select.setAttribute('aria-label',`Ficha de ${name}`);
  FICHAS.forEach(([emoji,nombre],j)=>{const option=texto('option',`${emoji} ${nombre}`);option.value=String(j);select.append(option);});
  select.value=String(seleccionFichas[i]);
  select.addEventListener('change',()=>{seleccionFichas[i]=Number(select.value);preview.textContent=FICHAS[seleccionFichas[i]][0];});
  label.append(select);$('token-pickers').append(label);
 });
}
function fichaEquipo(team,i){
 const token=texto('span',FICHAS[team.ficha][0],'token');
 token.style.setProperty('--team',COLORES[i]);
 token.title=`${team.nombre} · ${FICHAS[team.ficha][1]}`;
 token.setAttribute('role','img');token.setAttribute('aria-label',token.title);
 return token;
}
const EFECTOS = {back1:'Retroceder 1 casilla',back2:'Retroceder 2 casillas',skip:'Perder un turno',return:'Volver a la posición anterior',rebound:'Rebote al siguiente equipo',retry:'Otra pregunta para conservar la casilla'};
let equipos=[], turno=0, anterior=0, modo='question', fase='setup', pregunta=null, tipo='normal', efecto='', siguiente=null;
const usadas = new Map();
function texto(tag, value, className){const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;}
function categoria(pos){return (pos-1+7)%7;}
function elegir(cat, excluir){let pool=PREGUNTAS.filter(p=>p.categoria===cat&&p!==excluir);let seen=usadas.get(cat)||new Set();let available=pool.filter(p=>!seen.has(p));if(!available.length){seen=new Set();available=pool;}const q=available[Math.floor(Math.random()*available.length)];seen.add(q);usadas.set(cat,seen);return q;}
function render(){
 $('board').replaceChildren();
 // Filas alternadas: el recorrido serpentea sin saltar entre extremos.
 for(let row=0;row<5;row++){const numbers=Array.from({length:6},(_,i)=>row*6+i);if(row%2)numbers.reverse();for(const n of numbers){
  const cat=CATEGORIAS[categoria(n)];const cell=texto('div','', 'cell');cell.style.setProperty('--tile',n===0?'#2f265a':n===FIN?'#5940bd':cat.color);if(n===0||n===FIN)cell.style.color='white';
  if(equipos[turno].pos===n)cell.classList.add('current-cell');
  const arrow=n===FIN?'★':n%6===5?'↓':row%2?'←':'→';
  cell.append(texto('span',n===0?'00':n===FIN?'29':String(n).padStart(2,'0'),'cell-number'),texto('span',arrow,'cell-arrow'));
  const icon=texto('span',n===0?'🚩':n===FIN?'🏆':ICONOS[categoria(n)],'cell-icon');icon.setAttribute('aria-hidden','true');cell.append(icon,texto('span',n===0?'SALIDA':n===FIN?'META':cat.nombre,'cell-name')); 
  const tokens=texto('div','','tokens');equipos.forEach((t,i)=>{if(t.pos===n)tokens.append(fichaEquipo(t,i));});cell.append(tokens);$('board').append(cell);
 }}
 $('teams').replaceChildren();equipos.forEach((t,i)=>{const row=texto('div','',`team-row${turno===i?' active':''}`);const info=texto('div','','team-info');info.append(texto('span',t.nombre));const track=texto('div','','progress-track');const fill=texto('span','','progress-fill');fill.style.width=`${t.pos/FIN*100}%`;fill.style.background=COLORES[i];track.append(fill);info.append(track);row.append(fichaEquipo(t,i),info,texto('small',`${t.pos}/${FIN}${t.skip?' · pausa':''}`));$('teams').append(row);});
 $('turn').textContent=fase==='won'?`¡Ganó ${equipos[turno].nombre}!`:`Turno de ${equipos[turno].nombre}`;
 $('roll').disabled=fase!=='roll';
 document.body.classList.toggle('playing',fase!=='setup');
 document.body.classList.toggle('finished',fase==='won');
}
function abrir(q,variant='normal'){
 pregunta=q;tipo=variant;fase='question';siguiente=null;
 $('question-dialog').style.setProperty('--category',CATEGORIAS[q.categoria].color);
 $('question-category').textContent=`${CATEGORIAS[q.categoria].nombre} · ${q.dificultad}`;
 $('question-title').textContent=q.situacion;
 const respondent=variant==='rebound'?(turno+1)%equipos.length:turno;
 $('question-team').textContent=`Responde ${equipos[respondent].nombre}${variant==='retry'?' · Segunda oportunidad':variant==='rebound'?' · Rebote':''}`;
 efecto=modo==='question'?q.consecuencia:modo;
 $('question-penalty').textContent=variant==='normal'?`Si se equivocan: ${EFECTOS[efecto]}.`:variant==='retry'?'Si se equivocan, vuelven a la posición anterior al lanzamiento.':'Si aciertan, avanzan 1 casilla. Su turno habitual se conserva.';
 $('options').replaceChildren();q.opciones.forEach((option,i)=>{const b=texto('button','');b.append(texto('span','ABC'[i],'option-letter'),texto('span',option));b.addEventListener('click',()=>responder(i));$('options').append(b);});
 $('feedback').hidden=true;$('continue').hidden=true;
 if(!$('question-dialog').open)$('question-dialog').showModal();render();
 $('options').firstElementChild.focus();
}
function responder(index){
 if(fase!=='question')return;fase='feedback';const ok=index===pregunta.correcta;const team=equipos[turno];let message='';let reveal=true;
 if(tipo==='rebound'){if(ok){const other=equipos[(turno+1)%equipos.length];other.pos=Math.min(FIN-1,other.pos+1);message=`${other.nombre} avanza 1 casilla.`;}else message='El rebote no suma avances.';}
 else if(tipo==='retry'){if(!ok){team.pos=anterior;message='Vuelven a la posición anterior al lanzamiento.';}else message='Conservan la casilla.';}
 else if(ok){message='¡Conservan su avance!';}
 else {
  if(team.pos===FIN)team.pos=anterior;
  if(efecto==='back1'||efecto==='back2'){team.pos=Math.max(0,team.pos-(efecto==='back1'?1:2));message=EFECTOS[efecto]+'.';}
  if(efecto==='skip'){team.skip=1;message='Pierden su próximo turno.';}
  if(efecto==='return'){team.pos=anterior;message='Vuelven a la posición anterior al lanzamiento.';}
  if(efecto==='retry'){siguiente=()=>abrir(elegir(pregunta.categoria,pregunta),'retry');message='Tienen otra pregunta para conservar la casilla.';}
  if(efecto==='rebound'){reveal=false;const same=pregunta;siguiente=()=>abrir(same,'rebound');message='Hay rebote: el siguiente equipo responde antes de mostrar la solución.';}
 }
 if(ok&&tipo!=='rebound'&&team.pos===FIN){fase='won';message=`¡${team.nombre} llegó a la meta!`;}
 [...$('options').children].forEach((b,i)=>{b.disabled=true;if(reveal&&i===pregunta.correcta)b.classList.add('correct');if(reveal&&i===index&&!ok)b.classList.add('incorrect');});
 $('feedback').textContent=(ok?'¡Respuesta correcta! ':'Esta opción no es la correcta. ')+(reveal?`Respuesta: ${pregunta.opciones[pregunta.correcta]} ${pregunta.explicacion} `:'')+message;
 $('feedback').hidden=false;$('continue').hidden=false;$('continue').textContent=siguiente?'Seguir con el desafío →':fase==='won'?'Ver resultado →':'Siguiente turno →';render();$('continue').focus();
}
function avanzarTurno(){const skipped=[];do{turno=(turno+1)%equipos.length;if(!equipos[turno].skip)break;equipos[turno].skip--;skipped.push(equipos[turno].nombre);}while(true);fase='roll';$('status').textContent=skipped.length?`${skipped.join(', ')} pierde su turno. Ahora juega ${equipos[turno].nombre}.`:'Conversen antes de elegir una respuesta.';render();$('roll').focus();}
function iniciar(names,penalty){equipos=names.map((nombre,i)=>({nombre,ficha:seleccionFichas[i],pos:0,skip:0}));turno=0;modo=penalty;fase='roll';usadas.clear();$('setup').hidden=true;$('game').hidden=false;$('dice').textContent='?';$('dice').setAttribute('aria-label','Dado sin tirar');$('status').textContent='¡Todo listo! Tiren el dado para empezar.';render();$('roll').focus();}
$('names').addEventListener('input',configurarFichas);
configurarFichas();
$('setup-form').addEventListener('submit',event=>{event.preventDefault();const names=nombresConfigurados();if(names.length<2||names.length>6||names.some(n=>n.length>25)||new Set(names.map(n=>n.toLowerCase())).size!==names.length){$('setup-error').textContent='Escribí entre 2 y 6 nombres distintos, de hasta 25 caracteres cada uno.';return;}if(new Set(seleccionFichas.slice(0,names.length)).size!==names.length){$('setup-error').textContent='Elijan un emoji diferente para cada equipo, así pueden reconocer sus fichas.';return;}$('setup-error').textContent='';iniciar(names,$('penalty').value);});
$('roll').addEventListener('click',()=>{if(fase!=='roll')return;fase='question';const n=Math.floor(Math.random()*6)+1;anterior=equipos[turno].pos;equipos[turno].pos=Math.min(FIN,anterior+n);$('dice').textContent=String(n);$('dice').setAttribute('aria-label',`Resultado del dado: ${n}`);$('status').textContent=`Salió ${n}. ${equipos[turno].nombre} pasa de ${anterior} a ${equipos[turno].pos}.`;abrir(elegir(categoria(equipos[turno].pos)));});
$('continue').addEventListener('click',()=>{if(fase!=='feedback'&&fase!=='won')return;if(siguiente){const action=siguiente;siguiente=null;action();return;}$('question-dialog').close();if(fase==='won'){$('status').textContent='¡Recorrido completo! Pueden iniciar otra partida.';render();$('reset').focus();return;}avanzarTurno();});
$('question-dialog').addEventListener('cancel',e=>e.preventDefault());
$('reset').addEventListener('click',()=>{$('reset-confirm').hidden=false;});
$('reset-no').addEventListener('click',()=>{$('reset-confirm').hidden=true;});
$('reset-yes').addEventListener('click',()=>{fase='setup';document.body.classList.remove('playing','finished');$('reset-confirm').hidden=true;$('game').hidden=true;$('setup').hidden=false;$('names').focus();});
for(const cat of CATEGORIAS){const el=texto('span',cat.nombre);el.style.setProperty('--tile',cat.color);$('legend').append(el);}
