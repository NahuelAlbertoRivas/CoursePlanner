function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function conflicto(a, b) {
    if (a.dia !== b.dia) return false;

    return !(a.finMin <= b.inicioMin || b.finMin <= a.inicioMin);
}

function compatible(lista) {
    for (let i = 0; i < lista.length; i++) {
        for (let j = i + 1; j < lista.length; j++) {
            if (conflicto(lista[i], lista[j])) return false;
        }
    }

    return true;
}

function generarCombinacionesParcialesPorMateria(materias) {
  const nombres = Object.keys(materias)
  const res = []

  function backtrack(index, actual) {
    if (index === nombres.length) {
      if (actual.length > 0) res.push([...actual])
      return
    }

    const nombre = nombres[index]

    // Opción 1: No tomar ninguna comisión de esta materia (combinaciones parciales)
    backtrack(index + 1, actual)

    // Opción 2: Tomar una comisión de esta materia
    materias[nombre].forEach(c => {
      if (compatible([...actual, c])) {
        actual.push(c)
        backtrack(index + 1, actual)
        actual.pop()
      }
    })
  }

  backtrack(0, [])
  return res
}

