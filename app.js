let materias = cargarMaterias()

let combinaciones=[]
let indice=0

function agregarMateria(){

const materia = {

nombre: document.getElementById("nombre").value,
dia: document.getElementById("dia").value,
inicio: document.getElementById("inicio").value,
fin: document.getElementById("fin").value,
color: randomColor()

}

materias.push(materia)

guardarMaterias(materias)

renderMaterias()

}

function renderMaterias(){

const ul=document.getElementById("listaMaterias")

ul.innerHTML=""

materias.forEach(m=>{

const li=document.createElement("li")

li.textContent=`${m.nombre} ${m.dia} ${m.inicio}-${m.fin}`

ul.appendChild(li)

})

}

function generarHorarios(){

combinaciones = generarCombinaciones(materias)

indice=0

document.getElementById("contador").textContent =
`Combinaciones posibles: ${combinaciones.length}`

renderHorario()

}

function renderHorario(){

const grid=document.getElementById("grid")

grid.innerHTML=""

const dias=["Hora","Lunes","Martes","Miércoles","Jueves","Viernes"]

dias.forEach(d=>{

const div=document.createElement("div")
div.className="cell header"
div.textContent=d

grid.appendChild(div)

})

for(let h=8;h<=22;h++){

const hora=document.createElement("div")
hora.className="cell header"
hora.textContent=h+":00"

grid.appendChild(hora)

for(let d=1;d<=5;d++){

const c=document.createElement("div")
c.className="cell"

grid.appendChild(c)

}

}

if(combinaciones.length===0) return

const horario=combinaciones[indice]

horario.forEach(m=>{

console.log(m)

})

}

function next(){

if(indice<combinaciones.length-1){

indice++
renderHorario()

}

}

function prev(){

if(indice>0){

indice--
renderHorario()

}

}

function randomColor(){

return "#"+Math.floor(Math.random()*16777215).toString(16)

}

renderMaterias()