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


const cationA = {
    TPrA: { nombre: "Tetrapropilamonio", abreviatura: "TPrA", r: 4.00 },
    BTEA: { nombre: "Benciltrietilamonio", abreviatura: "BTEA", r: 3.92 },
    BTBA: { nombre: "Benciltributilamonio", abreviatura: "BTBA", r: 4.47 },
    TBA: { nombre: "Tetrabutilamonio", abreviatura: "TBA", r: 4.54 },
    TBMA: { nombre: "Tributilmetilamonio", abreviatura: "TBMA", r: 4.09 },
    TMA: { nombre: "Tetrametilamonio", abreviatura: "TMA", r: 2.98 },
    DMA: { nombre: "Dimetilamonio", abreviatura: "DMA", r: 2.58 },
    MA: { nombre: "Metilamonio", abreviatura: "MA", r: 2.31 },
    TPCMA: { nombre: "TripropilClorometilamonio", abreviatura: "TPCMA", r: 3.88 },
    TPBMA: { nombre: "TripropilBrorometilamonio", abreviatura: "TPBMA", r: 3.91 },
    TECMA: { nombre: "TrietilClorometilAmonio", abreviatura: "TECMA", r: 3.55 },
    TP2HPA: { nombre: "Tripropil2HidroxipropilAmonio", abreviatura: "TP2HPA", r: 4.07 },
    TBA_2: { nombre: "TetrabutylAmonio", abreviatura: "TBA_2", r: 4.36 },
    TBP: { nombre: "TetraButylfosfonioino", abreviatura: "TBP", r: 4.42 },
    TP1M2HEA: { nombre: "Tripropil(1Metil2HidroxiEtil)Amonio", abreviatura: "TP1M2HEA", r: 4.04 },
    TEBMA: { nombre: "TrietilBromometilAmonio", abreviatura: "TEBMA", r: 3.61 },
    TECEP: { nombre: "Trietilcloroetilfosfonio", abreviatura: "TECEP", r: 3.75 },
    TE2PeP: { nombre: "Trietil(2-propenil)fosfonio", abreviatura: "TE2PeP", r: 3.68 },
    TEMOMP: { nombre: "Trietilmetoxidimetilfosfonio", abreviatura: "TEMOMP", r: 3.72 },
    TEPP: { nombre: "Trietilpropilfosfonio", abreviatura: "TEPP", r: 3.76 },
    TEFEP: { nombre: "Trietilfluoroetilfosfonio", abreviatura: "TEFEP", r: 3.67 },
    DMFe: { nombre: "DecametilFerrocinio", abreviatura: "DMFe", r: 4.47 },
    DMCo: { nombre: "DecametilCobaltocinio", abreviatura: "DMCo", r: 4.44 },
    Cp2Co: { nombre: "Cobaltocinio", abreviatura: "Cp2Co", r: 3.24 },
    Cp2Fe: { nombre: "Ferrocinio", abreviatura: "Cp2Fe", r: 3.47 },
    TPhS: { nombre: "Trifenilsulfuro", abreviatura: "TPhS", r: 4.12 },
    DABCO: { nombre: "1,4-Diazabicyclo[2.2.2]octane", abreviatura: "DABCO", r: 3.21 }
};

const cationes = [cationA, cationB];
const select = [document.getElementById("cationA"), document.getElementById("cationB")];
const dir = ["#cationA", "#cationB"];



for (let i = 0; i < select.length; i++) {
    select[i].innerHTML = `<option value="" disabled selected></option>`; // Línea vacía sin seleccionar

    Object.keys(cationes[i]).forEach((key) => {
        const elemento = cationes[i][key];

        // Crear opción con datos
        const option = document.createElement("option");
        option.value = elemento.r;
        option.setAttribute("data-nombre", elemento.nombre);
        option.setAttribute("data-abreviatura", elemento.abreviatura);
        option.setAttribute("data-radio", elemento.r);
        option.textContent = `${elemento.nombre} (${elemento.abreviatura})`;
        select[i].appendChild(option);
    });

    // ___ *** SELECT2 *** ___
    $(document).ready(function () {
        $(dir[i]).select2({
            placeholder: "Elige aquí un anión de la base de datos",
            allowClear: true,
            templateResult: function (data) {
                if (!data.id) {
                    return data.text; // Para el placeholder
                }

                let nombre = $(data.element).attr("data-nombre");
                let abreviatura = $(data.element).attr("data-abreviatura");
                let radio = $(data.element).attr("data-radio");

                if (!nombre || !abreviatura || !radio) {
                    return data.text;
                }

                return $(
                    `<div style="display: flex; justify-content: space-between; width: 100%;">
                        <span>${nombre}</span>
                        <span style="color: gray;">(${abreviatura}) = ${radio}</span>
                    </div>`
                );
            },
            templateSelection: function (data) {
                if (!data.id) {
                    return data.text;
                }

                let nombre = $(data.element).attr("data-nombre");
                let abreviatura = $(data.element).attr("data-abreviatura");
                let radio = $(data.element).attr("data-radio");

                if (!nombre || !abreviatura || !radio) {
                    return data.text;
                }

                return $(
                    `<div style="display: flex; justify-content: space-between; width: 100%;">
                        <span>${nombre}&nbsp;&nbsp;</span>
                        <span style="color: gray;">(${abreviatura}) &nbsp; r = ${radio}</span>
                    </div>`
                );
            },  
            escapeMarkup: function (markup) {
                return markup; // Permitir HTML en Select2
            }
        });
    });
}

