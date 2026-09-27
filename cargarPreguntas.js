'use strict';
// Adaptador independiente: File local o URL -> banco normalizado, sin modificar el juego.
const BancoCSV = (() => {
 const columnas=['id','tema','situacion','pregunta','opcionA','opcionB','opcionC','correcta','explicacion','consecuencia','dificultad'];
 const temas=['ciudadania_digital','informacion_sensible','phishing','ciberbullying','grooming','fake_news_ia','ludopatia'];
 const efectos=['back1','back2','skip','return','rebound','retry'];
 const normalizar=s=>s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
 function parsear(texto,separador){
  const filas=[];let campos=[],campo='',estado=0,linea=1,inicio=1;
  function fila(){campos.push(campo);if(campos.some(c=>c.trim()))filas.push({campos,linea:inicio});campos=[];campo='';estado=0;inicio=linea+1;}
  for(let i=0;i<texto.length;i++){
   const ch=texto[i];
   if(estado===1){if(ch==='"'){if(texto[i+1]==='"'){campo+='"';i++;}else estado=2;}else {campo+=ch;if(ch==='\n')linea++;}continue;}
   if(ch===separador){campos.push(campo);campo='';estado=0;continue;}
   if(ch==='\n'||ch==='\r'){if(ch==='\r'&&texto[i+1]==='\n')i++;fila();linea++;continue;}
   if(estado===2){if(ch===' '||ch==='\t')continue;throw Error(`Línea ${linea}: hay texto después de cerrar comillas. Revisá el separador y las comillas.`);}
   if(ch==='"'){if(campo.length)throw Error(`Línea ${linea}: comillas dentro de un campo sin entrecomillar. Exportá el archivo desde la planilla.`);estado=1;}else campo+=ch;
  }
  if(estado===1)throw Error(`Línea ${inicio}: faltan comillas de cierre.`);
  fila();return filas;
 }
 function validar(texto){
  const errores=[];const limpio=texto.replace(/^\uFEFF/,'');
  let filas;
  // El encabezado define el separador: se admite coma o punto y coma.
  for(const sep of [',',';']){try{const intento=parsear(limpio,sep);if(intento[0]?.campos.length===11){filas=intento;break;}}catch(e){errores.push(e.message);}}
  if(!filas)return {errores:errores.length?[errores[0]]:['Encabezado: usá las 11 columnas de la plantilla, separadas por coma o punto y coma.']};
  errores.length=0;
  const cab=filas.shift().campos.map(s=>normalizar(s));
  const esperadas=columnas.map(normalizar);
  if(new Set(cab).size!==11||esperadas.some(c=>!cab.includes(c)))return {errores:['Encabezado: deben figurar una vez las 11 columnas: '+columnas.join(', ')+'. Eliminá columnas extra de Forms, como marca temporal o correo.']};
  if(filas.length>1000)return {errores:['El archivo supera las 1000 preguntas. Dividilo en bancos más pequeños.']};
  const ids=new Set(),cuenta=Array(7).fill(0),preguntas=[];
  for(const fila of filas){
   const pref=`Línea ${fila.linea}: `;const antes=errores.length;
   if(fila.campos.length!==11){errores.push(pref+'cantidad incorrecta de campos. Exportá como CSV; las comas del texto deben quedar entre comillas.');continue;}
   const d=Object.fromEntries(cab.map((k,i)=>[k,fila.campos[i].trim()]));
   for(const k of esperadas){if(!d[k])errores.push(pref+`completá «${k}».`);if(d[k].length>4000)errores.push(pref+`«${k}» supera los 4000 caracteres.`);}
   if(ids.has(normalizar(d.id)))errores.push(pref+`ID repetido: ${d.id}. Asigná uno único.`);ids.add(normalizar(d.id));
   const cat=temas.indexOf(normalizar(d.tema));if(cat<0)errores.push(pref+'tema no reconocido. Usá uno de los códigos de la plantilla.');else cuenta[cat]++;
   const ops=[d.opciona,d.opcionb,d.opcionc];if(new Set(ops.map(normalizar)).size!==3)errores.push(pref+'las tres opciones deben ser diferentes.');
   const correcta=d.correcta.toUpperCase();if(!['A','B','C'].includes(correcta))errores.push(pref+'correcta debe ser A, B o C.');
   if(!/^[1-6]$/.test(d.consecuencia))errores.push(pref+'consecuencia debe ser un número del 1 al 6.');
   const dif=normalizar(d.dificultad);if(!['facil','media','intermedia','dificil'].includes(dif))errores.push(pref+'dificultad debe ser facil, media o dificil.');
   if(antes===errores.length)preguntas.push({id:d.id,categoria:cat,situacion:d.situacion,pregunta:d.pregunta,opciones:ops,correcta:'ABC'.indexOf(correcta),explicacion:d.explicacion,consecuencia:efectos[Number(d.consecuencia)-1],dificultad:({facil:'Fácil',media:'Intermedia',intermedia:'Intermedia',dificil:'Difícil'})[dif]});
  }
  cuenta.forEach((n,i)=>{if(n<2)errores.push(`Banco: «${temas[i]}» tiene ${n} preguntas; necesita al menos 2.`);});
  return errores.length?{errores}:{errores:[],preguntas,cuenta};
 }
 async function cargarPreguntas(fuente){
  try{
   let bytes;
   if(typeof fuente==='string'){const r=await fetch(fuente);if(!r.ok)throw Error('No se pudo descargar el CSV.');bytes=await r.arrayBuffer();}
   else {if(!fuente||!fuente.name.toLowerCase().endsWith('.csv'))throw Error('Seleccioná un archivo con extensión .csv, no una planilla XLSX ni un PDF.');if(fuente.size>2*1024*1024)throw Error('El CSV debe pesar como máximo 2 MB.');bytes=await fuente.arrayBuffer();}
   if(bytes.byteLength>2*1024*1024)throw Error('El CSV debe pesar como máximo 2 MB.');
   let texto;try{texto=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw Error('Guardá el archivo como CSV UTF-8 para conservar tildes y eñes.');}
   return validar(texto);
  }catch(e){return {errores:[e.message||'No se pudo leer el archivo. Volvé a seleccionarlo.']};}
 }
 return {validar,cargarPreguntas,columnas,temas};
})();

