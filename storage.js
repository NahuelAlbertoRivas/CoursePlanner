function guardarMaterias(materias){

localStorage.setItem(
"materias",
JSON.stringify(materias)
)

}

function cargarMaterias(){

const data = localStorage.getItem("materias")

if(!data) return []

return JSON.parse(data)

}