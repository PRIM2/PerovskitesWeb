import { uploadData } from '../../dataBase/dataHandler.js';

let cationAMap = new Map();
let cationBMap = new Map();

// ------------------------------------------------------------
// Función para limpiar fórmulas químicas (subíndices, eliminar \text)
function cleanFormula(text) {
    if (!text) return '';
    const sub = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎' };
    const toSub = s => s.replace(/[0-9+\-=()]/g, d => sub[d] || d);
    let t = text.replace(/\\text{([^}]*)}/g, '$1');      // Elimina \text{}
    t = t.replace(/_([0-9]+)/g, (_, d) => toSub(d));     // Subíndices con _
    t = t.replace(/([A-Za-z)])([0-9]+)/g, (_, l, d) => l + toSub(d)); // Subíndices pegados a letras
    return t;
}

// ------------------------------------------------------------
// Convierte número de carga a símbolo con subíndice
function formatCharge(charge) {
    if (!charge) return '';
    const supMap = { '1':'⁺', '2':'²⁺', '3':'³⁺', '4':'⁴⁺', '5':'⁵⁺', '6':'⁶⁺', '7':'⁷⁺', '8':'⁸⁺', '9':'⁹⁺' };
    return supMap[charge] || charge + '⁺';
}

// ------------------------------------------------------------
// Carga los datos desde la base de datos
(async () => {
    try {
        const [cationA, cationB] = await Promise.all([
            uploadData('cationA', '*'),
            uploadData('cationB', '*')
        ]);

        // Mapas de cationes
        cationAMap = new Map(cationA.map(a => [a.smiles, a]));
        cationBMap = new Map(cationB.map(b => [b.smiles, b]));

        // Poblar selects
        populateCationSelect('cationA', cationAMap, true);  // fuerza +
        populateCationSelect('cationB', cationBMap, false); // usa charge de la BD

        // Inicializar Select2
        initializeSelect2('#cationA');
        initializeSelect2('#cationB');

    } catch (error) {
        console.error("Error cargando datos de cationes:", error);
    }
})();

// ------------------------------------------------------------
// Funciones para llenar los selects
function populateCationSelect(id, dataMap, forcePlus) {
    const select = document.getElementById(id);
    if (!select) return console.error(`⚠️ No se encontró <select id='${id}'>.`);

    select.innerHTML = `<option value="" disabled selected>Seleccione un catión</option>`;

    dataMap.forEach(cation => {
        const option = document.createElement("option");
        const abreviatura = cation.abbreviature || cation.ion || 'N/A';

        // Aplicar formato de carga
        const carga = forcePlus ? '⁺' : formatCharge(cation.charge);
        const nombreLimpio = cleanFormula(cation.textName || cation.nombre || cation.ion) + carga;
        const radio = cation.radiusA_UDC || cation.ionicRadius || 'N/A';

        option.value = radio;
        option.setAttribute("data-nombre", nombreLimpio);
        option.setAttribute("data-abreviatura", abreviatura);
        option.setAttribute("data-radio", radio);
        option.setAttribute("data-smiles", cation.smiles || '');
        option.textContent = `${nombreLimpio} (${abreviatura})`;

        select.appendChild(option);
    });
}

// ------------------------------------------------------------
// Inicialización de Select2
function initializeSelect2(selector) {
    $(selector).select2({
        placeholder: "Seleccione un catión de la base de datos",
        allowClear: true,
        templateResult: function(data) {
            if (!data.id) return data.text;

            const nombre = $(data.element).attr("data-nombre");
            const abreviatura = $(data.element).attr("data-abreviatura");
            const radio = $(data.element).attr("data-radio");

            if (!nombre || !abreviatura || !radio) return data.text;

            return $(`
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span style="flex:1;">${nombre}</span>
                    <span style="flex:1; text-align:right; color: gray;">r = ${radio}</span>
                </div>
            `);
        },
        templateSelection: function(data) {
            if (!data.id) return data.text;

            const nombre = $(data.element).attr("data-nombre");
            const abreviatura = $(data.element).attr("data-abreviatura");
            const radio = $(data.element).attr("data-radio");

            if (!nombre || !abreviatura || !radio) return data.text;

            return $(`
                <div style="width: 100%;">
                    <span style="float: left;">${nombre}&nbsp;&nbsp;</span>
                    <span style="float: right; color: gray;">(${abreviatura}) r = ${radio}</span>
                    <div style="clear: both;"></div>
                </div>
            `);
        },
        escapeMarkup: markup => markup
    });
}
