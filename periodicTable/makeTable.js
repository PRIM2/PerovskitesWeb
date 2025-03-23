
function cargarTabla(url, tablaId) {
    fetch(url)
        .then(response => response.json())
        .then(periodicTable => {
            const tabla = document.getElementById(tablaId);
            tabla.innerHTML = ""; // Limpiar antes de agregar elementos
            periodicTable.forEach(el => {
                if (!el.Column || !el.Row) {
                    console.error("Error: Falta Column o Row en", el);
                    return;
                }
                const celda = document.createElement("div");
                celda.classList.add("elemento");
                celda.textContent = el.symbol;
                celda.style.gridColumn = el.Column;
                celda.style.gridRow = el.Row;


                let areCation = Object.keys(cationB).includes(el.symbol);  // 🔹 Verifica si el símbolo está en los cationes
                let areAnion = Object.keys(elementosAniones).includes(el.symbol);  // 🔹 Verifica si el símbolo está en los aniones

                if ( areAnion || areCation) {
                    celda.classList.add("celdaLlena") //Aqui quiero ponerle un estilo propio
                }

                celda.onclick = () => {
                    

                    document.querySelectorAll(".elemento").forEach(el => el.classList.remove("seleccionado"));

                    // Modificar contenido del modal
                    actualizarModal(el.symbol, [el.Row, el.Column]);

                    // Abrir modal
                    document.getElementById('modalSelect').showModal();
                };
                tabla.appendChild(celda);
            });
        })
}


document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("tabla") && document.getElementById("tabla2")) {
        cargarTabla('periodicTable/tableData.json', 'tabla');
        cargarTabla('periodicTable/tableAct.json', 'tabla2');
    } else {
        console.error("No se encontraron los elementos de la tabla en el DOM.");
    }
});

function openModal() {
    document.getElementById('modalSelect').showModal();
}

function closeModal() {
    document.getElementById('modalSelect').close();
}

const elementosAniones = {
    // ESTO ESTA FATAL HEHO
    F: ["F"],
    Cl: ["Cl", "ClO4", "GaCl2"],
    Br: ["Br", "InBr2"],
    I: ["I"],
    H: ["HCOO", "CN", "SCN", "BH4", "HPOO", "DCA"],
    C: ["HCOO", "HPOO", "ClO4", "DCA", "Ag(CN)2", "Au(CN)2"],
    O: ["HCOO"],
    N: ["N3", "CN", "SCN", "DCA", "Ag(CN)2", "Au(CN)2"],
    S: ["SCN"],
    B: ["BH4", "BF4", "GaBr2"],
    F: ["BF4"],
    P: ["HPOO"],
    Ag: ["Ag(CN)2"],
    Au: ["Au(CN)2"],
    Ga: ["GaBr2", "GaCl2"],
    In: ["InBr2"]


};

const cationB = {
    Be: { nombre: "Berilio", abreviatura: "Be", r: 0.45 },
    Mg: { nombre: "Magnesio", abreviatura: "Mg", r: 0.72 },
    Ca: { nombre: "Calcio", abreviatura: "Ca", r: 1.0 },
    Sr: { nombre: "Estroncio", abreviatura: "Sr", r: 1.18 },
    Ba: { nombre: "Bario", abreviatura: "Ba", r: 1.35 },
    Ti: { nombre: "Titanio", abreviatura: "Ti", r: 0.86 },
    V: { nombre: "Vanadio", abreviatura: "V", r: 0.79 },
    Cr: { nombre: "Cromo", abreviatura: "Cr", r: 0.8 },
    Mn: { nombre: "Manganeso", abreviatura: "Mn", r: 0.83 },
    Fe: { nombre: "Hierro", abreviatura: "Fe", r: 0.78 },
    Co: { nombre: "Cobalto", abreviatura: "Co", r: 0.745 },
    Ni: { nombre: "Niquel", abreviatura: "Ni", r: 0.69 },
    Pd: { nombre: "Paladio", abreviatura: "Pd", r: 0.86 },
    Pt: { nombre: "Platino", abreviatura: "Pt", r: 0.8 },
    Cu: { nombre: "Cobre", abreviatura: "Cu", r: 0.73 },
    Ag: { nombre: "Plata", abreviatura: "Ag", r: 0.94 },
    Zn: { nombre: "Cinc", abreviatura: "Zn", r: 0.74 },
    Cd: { nombre: "Cadmio", abreviatura: "Cd", r: 0.95 },
    Hg: { nombre: "Mercurio", abreviatura: "Hg", r: 1.02 },
    Ge: { nombre: "Germanio", abreviatura: "Ge", r: 0.73 },
    Sn: { nombre: "Estroncio", abreviatura: "Sn", r: 1.15 },
    Pb: { nombre: "Plomo", abreviatura: "Pb", r: 1.19 },
    Eu: { nombre: "Europio", abreviatura: "Eu", r: 1.17 },
    Dy: { nombre: "Disprosio", abreviatura: "Dy", r: 1.07 },
    Tm: { nombre: "Tulio", abreviatura: "Tm", r: 1.03 },
    Yb: { nombre: "Iterbio", abreviatura: "Yb", r: 1.02 },
    Np: { nombre: "Neptunio", abreviatura: "Np", r: 1.1 },
    No: { nombre: "Nobelio", abreviatura: "No", r: 1.1 },
    Li: { nombre: "Litio", abreviatura: "Li", r: 0.9 },
    Na: { nombre: "Sodio", abreviatura: "Na", r: 1.16 },
    K: { nombre: "Potasio", abreviatura: "K", r: 1.52 },
    R: { nombre: "Rubidio", abreviatura: "Rb", r: 1.66 },
    Cs: { nombre: "Cesio", abreviatura: "Cs", r: 1.81 }
};

const anion = {
    F: { nombre: "Fluoruro", abreviatura: "F", xr: 1.285, xh: 2.57 },
    Cl: { nombre: "Cloruro", abreviatura: "Cl", xr: 1.81, xh: 3.62 },
    Br: { nombre: "Bromuro", abreviatura: "Br", xr: 1.96, xh: 3.92 },
    I: { nombre: "Ioduro", abreviatura: "I", xr: 2.2, xh: 4.4 },
    HCOO: { nombre: "Formiato", abreviatura: "HCOO", xr: 2.25, xh: 5.2 },
    CN: { nombre: "Cianuro", abreviatura: "CN", xr: 1.7575, xh: 4.464 },
    SCN: { nombre: "Tiocianato", abreviatura: "SCN", xr: 1.84, xh: 6.3 },
    BH4: { nombre: "Borohidruro", abreviatura: "BH4", xr: 2.03, xh: 4.06 },
    BF4: { nombre: "Tetrafluoroborato", abreviatura: "BF4", xr: 2.41, xh: 4.82 },
    HPOO: { nombre: "Hipofosfito", abreviatura: "HPOO", xr: 2.3, xh: 5.585 },
    ClO4: { nombre: "Perclorato", abreviatura: "ClO4", xr: 2.62, xh: 5.24 },
    N3: { nombre: "Azida", abreviatura: "N3", xr: 1.65, xh: 5.2 },
    DCA: { nombre: "Dicianamina", abreviatura: "DCA", xr: 1.9, xh: 7.56 },
    AgCN2: { nombre: "Dicianometalato (Ag)", abreviatura: "Ag(CN)2", xr: 1.95, xh: 9.52 },
    AuCN2: { nombre: "Dicianometalato (Au)", abreviatura: "Au(CN)2", xr: 2.04, xh: 9.49 },
    GaBr2: { nombre: "Dibromometalato (Ga)", abreviatura: "GaBr2", xr: 2.11, xh: 9.4 },
    InBr2: { nombre: "Dibromometalato (In)", abreviatura: "InBr2", xr: 2.25, xh: 9.43 },
    GaCl2: { nombre: "Diclorometalato (Ga)", abreviatura: "GaCl2", xr: 2.12, xh: 8.86 }
};


window.selectAnion = function(formula, coordenates, event) {

    let [row, column] = coordenates;

    // 🔹 Buscar la celda en la tabla usando `grid-area`
    let celda = document.querySelector(`.elemento[style*="grid-area: ${row} / ${column}"]`);


    // 🔹 Remover selección previa y resaltar la celda del anión
    document.querySelectorAll(".elemento").forEach(e => e.classList.remove("selAnion"));
    celda.classList.add("selAnion");


    // 🔹 Mostrar el anión seleccionado en la interfaz
    let valor = document.getElementById('anionSelected');

    let anionEncontrado = Object.values(anion).find(el => el.abreviatura === formula);
    valor.innerHTML = `<strong>Selected Anion: </strong>${anionEncontrado.nombre} ${anionEncontrado.abreviatura}____ r = ${anionEncontrado.xr}___  h = ${anionEncontrado.xh}`;
   
    document.getElementById('modalSelect').close();
};


window.selectCation = function(formula, coordenates, event) {

    let [row, column] = coordenates;

    //  Buscar la celda en la tabla usando `grid-area`
    let celda = document.querySelector(`.elemento[style*="grid-area: ${row} / ${column}"]`);

    //  Remover selección previa y resaltar la celda seleccionada
    document.querySelectorAll(".elemento").forEach(e => e.classList.remove("selCation"));
    celda.classList.add("selCation");

    let valor = document.getElementById('cationSelected');
    const cationSelected = cationB[formula];

    valor.innerHTML = `<strong>Selected Cation: </strong>${cationSelected.nombre} ${cationSelected.abreviatura}___ r = ${cationSelected.r}`;

    document.getElementById('modalSelect').close();
};


function actualizarModal(element, coordenates) {

    const aniones = elementosAniones[element] || [];
    const cationBboton = cationB[element] || null;

    const modalSelect = document.getElementById("modalSelect");

    // 🔹 Iniciar contenido del modal vacío
    let contenidoModal = ``;

    // 🔹 Mostrar los aniones si existen
    if (aniones.length > 0) {
        contenidoModal += `<strong>Anion:</strong><br><br>` + 
            aniones.map(a => `<button onclick="selectAnion('${a}', JSON.parse('${JSON.stringify(coordenates)}'), event)">${a}</button>`).join("<br><br>") + "<br><br>";
    }

    if (cationBboton) {
        contenidoModal +=  `<strong>Cation:</strong><br><br> <button onclick="selectCation('${cationBboton.abreviatura}', JSON.parse('${JSON.stringify(coordenates)}'), event)">${cationBboton.abreviatura}</button><br>`;

    } 

    if ( !cationBboton && aniones.length === 0) {
        contenidoModal += `<strong>No tiene aniones registrados.</strong><br><br>`;
        contenidoModal += `<strong>No hay catión registrado.</strong>`;
    }

    // 🔹 Insertamos el contenido en el modal
    modalSelect.innerHTML = contenidoModal;
}

