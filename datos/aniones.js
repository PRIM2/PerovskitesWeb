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



select = document.getElementById("anion");
document.getElementById("anion").innerHTML = `<option value="" disabled selected></option>`;

// Iteramos sobre las claves del objeto cationB y creamos opciones
Object.keys(anion).forEach((key) => {
    const elemento = anion[key];
    const option = document.createElement("option");

    option.setAttribute("xh", elemento.xh); 
    option.setAttribute("xr", elemento.xr); 
    option.setAttribute("data-nombre", elemento.nombre); 
    option.setAttribute("data-abreviatura", elemento.abreviatura); 


    option.textContent = `${elemento.nombre} (${elemento.abreviatura})`; 
    select.appendChild(option);
});



$(document).ready(function () {
    $("#anion").select2({
        placeholder: "Elige aquí un anión de la base de datos",
        allowClear: true,
        templateResult: function (data) {
            if (!data.id) {
                return data.text; // Para el placeholder
            }

            let nombre = $(data.element).attr("data-nombre");
            let abreviatura = $(data.element).attr("data-abreviatura");
            let xh = $(data.element).attr("xh");
            let xr = $(data.element).attr("xr");
            

            if (!nombre || !abreviatura || !xr || !xh) {
                return data.text;
            }

            // Solución: Usar `display: block; text-align: right;` en la parte derecha
            return $(
                `<div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span style="flex: 1;">${nombre};</span>
                    <span style="flex: 1; text-align: right; color: gray;">r(${abreviatura}) = ${xr},&nbsp; h(${abreviatura}) = ${xh}</span>
                </div>`
            );
        },
        templateSelection: function (data) {
            if (!data.id) {
                return data.text;
            }

            let nombre = $(data.element).attr("data-nombre");
            let abreviatura = $(data.element).attr("data-abreviatura");
            let xh = $(data.element).attr("xh");
            let xr = $(data.element).attr("xr");

            if (!nombre || !abreviatura || !xr || !xh) {
                return data.text;
            }

            // Solución: Usar `display: block; text-align: right;` en la parte derecha
            return $(
                `<div style="width: 100%;">
                    <span style="float: left;">${nombre}&nbsp;&nbsp;</span>
                    <span style="float: right; color: gray;">(${abreviatura}) &nbsp;&nbsp; r = ${xr},&nbsp;  h = ${xh}</span>
                    <div style="clear: both;"></div> <!-- Corrige el flotado -->
                </div>`
            );
        
        },
        escapeMarkup: function (markup) {
            return markup; // Permitir HTML en Select2
        }
    });
});