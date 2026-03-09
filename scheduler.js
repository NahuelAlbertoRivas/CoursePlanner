function conflicto(a,b){

if(a.dia !== b.dia) return false

return !(a.fin <= b.inicio || b.fin <= a.inicio)

}

function compatible(lista){

for(let i=0;i<lista.length;i++){
for(let j=i+1;j<lista.length;j++){

if(conflicto(lista[i],lista[j])) return false

}
}

return true
}

function generarSubsets(arr){

const res=[]
const total=1<<arr.length

for(let i=1;i<total;i++){

let subset=[]

for(let j=0;j<arr.length;j++){
if(i & (1<<j)) subset.push(arr[j])
}

res.push(subset)

}

return res

}

function generarCombinaciones(materias){

return generarSubsets(materias).filter(compatible)

}