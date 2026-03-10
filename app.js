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

function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function agregarComision() {
    const nombreForm = document.getElementById("nombre").value.trim();
    const dia = document.getElementById("dia").value;
    const inicio = document.getElementById("inicio").value;
    const fin = document.getElementById("fin").value;

    if (!nombreForm || !inicio || !fin) {
        alert("Completar todos los campos");
        return;
    }

    // Validar si existe comisión idéntica (mismo nombre, día, inicio y fin)
    if(materias[nombreForm]){
        const duplicado = materias[nombreForm].some(c => 
        c.dia === dia && c.inicio === inicio && c.fin === fin
        )
        if(duplicado){
        alert("La comisión ya existe con ese horario y día")
        return
        }
    }

    const inicioMin = timeToMinutes(inicio);
    const finMin = timeToMinutes(fin);

    if (finMin <= inicioMin) {
        alert("Horario inválido");
        return;
    }

    // Crear nueva comisión
    const comision = {
        id: Date.now() + Math.random(),
        nombre: nombreForm,
        dia,
        inicio,
        fin,
        inicioMin,
        finMin,
        color: randomColor()
    }

    if(!materias[nombreForm]) materias[nombreForm] = []
    materias[nombreForm].push(comision)

    guardarMaterias(materias)
    renderMaterias()

    // Limpiar formulario
    document.getElementById("nombre").value = ""
    document.getElementById("inicio").value = ""
    document.getElementById("fin").value = ""

    guardarMaterias(materias);
    renderMaterias();

    // Limpiar formulario
    document.getElementById("nombre").value = "";
    document.getElementById("inicio").value = "";
    document.getElementById("fin").value = "";
}

// ------------------------
// Renderizar materias en la lista
// ------------------------
function renderMaterias() {
    const ul = document.getElementById("listaMaterias");
    ul.innerHTML = "";

    Object.keys(materias).forEach((nombre) => {
        materias[nombre].forEach((c) => {
            const li = document.createElement("li");
            li.textContent = `${c.nombre} ${c.dia} ${c.inicio}-${c.fin}`;

            // Botón borrar
            const borrar = document.createElement("span");
            borrar.textContent = " ✖";
            borrar.className = "borrar";
            borrar.addEventListener("click", () => eliminarComision(nombre, c.id));
            li.appendChild(borrar);

            // Botón editar
            const editar = document.createElement("span");
            editar.textContent = " ✎";
            editar.className = "borrar";
            editar.style.marginLeft = "5px";
            editar.style.color = "blue";
            editar.addEventListener("click", () => abrirModalEditar(nombre, c.id));
            li.appendChild(editar);

            ul.appendChild(li);
        });
    });
}

// ------------------------
// Eliminar comisión
// ------------------------
function eliminarComision(nombre, id) {
    if (!materias[nombre]) return;
    materias[nombre] = materias[nombre].filter((c) => c.id !== id);
    if (materias[nombre].length === 0) delete materias[nombre];
    guardarMaterias(materias);
    renderMaterias();
}

// ------------------------
// Modal edición
// ------------------------
function abrirModalEditar(nombre, id) {
    const comision = materias[nombre].find((c) => c.id === id);
    if (!comision) return;

    comisionEditando = { nombre, id };

    document.getElementById("editNombre").value = comision.nombre;
    document.getElementById("editDia").value = comision.dia;
    document.getElementById("editInicio").value = comision.inicio;
    document.getElementById("editFin").value = comision.fin;

    document.getElementById("modalEditar").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalEditar").style.display = "none";
    comisionEditando = null;
}

document.getElementById("cerrarModal").addEventListener("click", cerrarModal);

document.getElementById("guardarEdicion").addEventListener("click", () => {
    const nombreForm = document.getElementById("editNombre").value.trim();
    const dia = document.getElementById("editDia").value;
    const inicio = document.getElementById("editInicio").value;
    const fin = document.getElementById("editFin").value;

    if (!nombreForm || !inicio || !fin) {
        alert("Completar todos los campos");
        return;
    }

    const inicioMin = timeToMinutes(inicio);
    const finMin = timeToMinutes(fin);

    if (finMin <= inicioMin) {
        alert("Horario inválido");
        return;
    }

    const lista = materias[comisionEditando.nombre];
    const index = lista.findIndex((c) => c.id === comisionEditando.id);
    if (index !== -1) {
        lista[index] = {
            ...lista[index],
            nombre: nombreForm,
            dia,
            inicio,
            fin,
            inicioMin,
            finMin,
        };

        // Mover si cambió nombre
        if (comisionEditando.nombre !== nombreForm) {
            if (!materias[nombreForm]) materias[nombreForm] = [];
            materias[nombreForm].push(lista.splice(index, 1)[0]);
            if (lista.length === 0) delete materias[comisionEditando.nombre];
        }
    }

    guardarMaterias(materias);
    renderMaterias();
    cerrarModal();
});

function generarHorarios() {
    combinaciones = generarCombinacionesParcialesPorMateria(materias);

    // ordena por cantidad de materias de mayor a menor
    combinaciones.sort((a,b) => b.length - a.length)

    indice = 0;

    // Mostramos cuántas combinaciones y la máxima cantidad de materias
    if(combinaciones.length>0){
        document.getElementById("contador").textContent = `Combinaciones posibles: ${combinaciones.length} (máx ${combinaciones[0].length} materias)`
    } else {
        document.getElementById("contador").textContent = `No hay combinaciones posibles`
    }

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
