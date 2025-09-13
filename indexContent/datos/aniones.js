import { uploadData } from '../../dataBase/dataHandler.js';

let anionData = {};
let cationAMap = new Map();
let cationBMap = new Map();

// ------------------------------------------------------------
// Función para limpiar fórmulas químicas (subíndices, eliminar \text)
function cleanFormula(text) {
    if (!text) return '';
    const subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎' };
    const toSub = str => str.replace(/[0-9+\-=\(\)]/g, d => subMap[d] || d);
    let t = text.replace(/\\text{([^}]*)}/g, '$1');      // Elimina \text{}
    t = t.replace(/_([0-9]+)/g, (_, d) => toSub(d));     // Subíndices con _
    t = t.replace(/([A-Za-z)])([0-9]+)/g, (_, l, d) => l + toSub(d)); // Subíndices pegados a letras
    return t;
}

// ------------------------------------------------------------
// Ejecutamos todo directamente
(async () => {
    console.log("Ejecutando script de aniones...");

    try {
        // Traemos todos los datos necesarios
        const [anion, cationA, cationB] = await Promise.all([
            uploadData('anion', '*'),
            uploadData('cationA', '*'),
            uploadData('cationB', '*')
        ]);

        // Convertimos mapas para acceso rápido
        cationAMap = new Map(cationA.map(a => [a.smiles, a]));
        cationBMap = new Map(cationB.map(b => [b.smiles, b]));

        // Convertimos aniones en objeto clave: abreviatura
        anionData = anion.reduce((obj, item) => {
            if (item.abbreviature) {
                obj[item.abbreviature] = {
                    nombre: item.textName,
                    abreviatura: item.abbreviature,
                    xr: item.radiusA,
                    xh: item.lengthA || item.lenghtA,
                    smiles: item.smiles
                };
            }
            return obj;
        }, {});

        populateAnionSelect();
        initializeSelect2();

    } catch (error) {
        console.error("Error cargando aniones desde BD:", error);
    }
})();

// ------------------------------------------------------------
// Función para llenar el select con nombres limpios
function populateAnionSelect() {
    const select = document.getElementById("anion");
    if (!select) {
        console.error("⚠️ No se encontró <select id='anion'> en el HTML.");
        return;
    }

    // select.innerHTML = `<option value="" disabled selected>Seleccione un anión</option>`;

    Object.values(anionData).forEach(anion => {
        const option = document.createElement("option");

        // Aplicamos cleanFormula para mostrar nombres correctos
        const nombreLimpio = cleanFormula(anion.nombre) + "⁻";

        option.setAttribute("xh", anion.xh);
        option.setAttribute("xr", anion.xr);
        option.setAttribute("data-nombre", nombreLimpio);
        option.setAttribute("data-abreviatura", anion.abreviatura);
        option.setAttribute("data-smiles", anion.smiles);

        // Texto visible en el select
        option.textContent = `name = ${nombreLimpio}: r = ${anion.xr}, h = ${anion.xh}`;
        
        select.appendChild(option);
    });
}

// ------------------------------------------------------------
// Función para inicializar Select2
function initializeSelect2() {
    $("#anion").select2({
        placeholder: "Please select an anion from database",
        allowClear: true,
        templateResult: function (data) {
            if (!data.id) return data.text;

            const nombre = $(data.element).attr("data-nombre");
            const abreviatura = $(data.element).attr("data-abreviatura");
            const xh = $(data.element).attr("xh");
            const xr = $(data.element).attr("xr");

            if (!nombre || !abreviatura || !xr || !xh) return data.text;

            return $(
                `<div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span style="flex: 1;">${nombre}</span>
                    <span style="flex: 1; text-align: right; color: gray;">
                        r = ${xr}, h = ${xh}
                    </span>
                </div>`
            );
        },
        templateSelection: function (data) {
            if (!data.id) return data.text;

            const nombre = $(data.element).attr("data-nombre");
            const abreviatura = $(data.element).attr("data-abreviatura");
            const xh = $(data.element).attr("xh");
            const xr = $(data.element).attr("xr");

            if (!nombre || !abreviatura || !xr || !xh) return data.text;

            return $(
                `<div style="width: 100%;">
                    <span style="float: left;">${nombre} : &nbsp;&nbsp;</span>
                    <span style="float: right; color: gray;">
                        r = ${xr}, h = ${xh}
                    </span>
                    <div style="clear: both;"></div>
                </div>`
            );
        },
        escapeMarkup: function (markup) { return markup; }
    });
}
