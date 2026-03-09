let materias = cargarMaterias();

let combinaciones = [];
let indice = 0;

const diasIndex = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
};

function agregarComision() {
    const nombre = document.getElementById("nombre").value.trim();
    const dia = document.getElementById("dia").value;
    const inicio = document.getElementById("inicio").value;
    const fin = document.getElementById("fin").value;

    if (!nombre || !inicio || !fin) {
        alert("Completar todos los campos");
        return;
    }

    const inicioMin = timeToMinutes(inicio);
    const finMin = timeToMinutes(fin);

    if (finMin <= inicioMin) {
        alert("El horario es inválido");
        return;
    }

    const comision = {
        nombre,
        dia,
        inicio,
        fin,
        inicioMin,
        finMin,
        color: randomColor(),
    };

    if (!materias[nombre]) materias[nombre] = [];

    materias[nombre].push(comision);

    guardarMaterias(materias);

    renderMaterias();
}

function renderMaterias() {
    const ul = document.getElementById("listaMaterias");

    ul.innerHTML = "";

    Object.keys(materias).forEach((nombre) => {
        materias[nombre].forEach((c) => {
            const li = document.createElement("li");

            li.textContent = `${c.nombre} ${c.dia} ${c.inicio}-${c.fin}`;

            ul.appendChild(li);
        });
    });
}

function generarHorarios() {
    combinaciones = generarCombinaciones(materias);

    indice = 0;

    document.getElementById("contador").textContent = `Combinaciones posibles: ${combinaciones.length}`;

    renderHorario();
}

function renderHorario() {
    const grid = document.getElementById("grid");

    grid.innerHTML = "";

    const dias = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    dias.forEach((d) => {
        const div = document.createElement("div");
        div.className = "cell header";
        div.textContent = d;

        grid.appendChild(div);
    });

    for (let h = 8; h <= 22; h++) {
        const hora = document.createElement("div");
        hora.className = "cell header";
        hora.textContent = h + ":00";

        grid.appendChild(hora);

        for (let d = 1; d <= 5; d++) {
            const c = document.createElement("div");
            c.className = "cell";

            grid.appendChild(c);
        }
    }

    if (combinaciones.length === 0) return;

    const horario = combinaciones[indice];

    const celdas = [...grid.children];

    horario.forEach((m) => {
        const col = diasIndex[m.dia];

        const startRow = m.inicioMin / 60 - 8 + 1;
        const dur = (m.finMin - m.inicioMin) / 60;

        const index = startRow * 6 + col;

        const cell = celdas[index];

        if (!cell) return;

        const bloque = document.createElement("div");

        bloque.className = "bloque";
        bloque.style.background = m.color;
        bloque.style.height = dur * 40 + "px";

        bloque.textContent = m.nombre;

        cell.appendChild(bloque);
    });
}

function next() {
    if (indice < combinaciones.length - 1) {
        indice++;
        renderHorario();
    }
}

function prev() {
    if (indice > 0) {
        indice--;
        renderHorario();
    }
}

function randomColor() {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    );
}

renderMaterias();
