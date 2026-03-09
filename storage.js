function guardarMaterias(materias) {
    localStorage.setItem("materias", JSON.stringify(materias));
}

function cargarMaterias() {
    const data = localStorage.getItem("materias");

    if (!data) return {};

    const parsed = JSON.parse(data);

    /* si es formato viejo lo reiniciamos */

    if (Array.isArray(parsed)) return {};

    return parsed;

}
