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

function generarCombinaciones(materias) {
    const nombres = Object.keys(materias);

    let resultados = [];

    function backtrack(i, actual) {
        if (i === nombres.length) {
            resultados.push([...actual]);
            return;
        }

        const materia = nombres[i];

        for (const comision of materias[materia]) {
            if (actual.every((a) => !conflicto(a, comision))) {
                actual.push(comision);
                backtrack(i + 1, actual);
                actual.pop();
            }
        }
    }

    backtrack(0, []);

    return resultados;
}
