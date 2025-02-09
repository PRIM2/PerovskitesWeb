const cationA = {
    TPrA: { nombre: "Tetrapropilamonio", abreviatura: "TPrA", ra: 4.00 },
    BTEA: { nombre: "Benciltrietilamonio", abreviatura: "BTEA", ra: 3.92 },
    BTBA: { nombre: "Benciltributilamonio", abreviatura: "BTBA", ra: 4.47 },
    TBA: { nombre: "Tetrabutilamonio", abreviatura: "TBA", ra: 4.54 },
    TBMA: { nombre: "Tributilmetilamonio", abreviatura: "TBMA", ra: 4.09 },
    TMA: { nombre: "Tetrametilamonio", abreviatura: "TMA", ra: 2.98 },
    DMA: { nombre: "Dimetilamonio", abreviatura: "DMA", ra: 2.58 },
    MA: { nombre: "Metilamonio", abreviatura: "MA", ra: 2.31 },
    TPCMA: { nombre: "TripropilClorometilamonio", abreviatura: "TPCMA", ra: 3.88 },
    TPBMA: { nombre: "TripropilBrorometilamonio", abreviatura: "TPBMA", ra: 3.91 },
    TECMA: { nombre: "TrietilClorometilAmonio", abreviatura: "TECMA", ra: 3.55 },
    TP2HPA: { nombre: "Tripropil2HidroxipropilAmonio", abreviatura: "TP2HPA", ra: 4.07 },
    TBA_2: { nombre: "TetrabutylAmonio", abreviatura: "TBA_2", ra: 4.36 },
    TBP: { nombre: "TetraButylfosfonioino", abreviatura: "TBP", ra: 4.42 },
    TP1M2HEA: { nombre: "Tripropil(1Metil2HidroxiEtil)Amonio", abreviatura: "TP1M2HEA", ra: 4.04 },
    TEBMA: { nombre: "TrietilBromometilAmonio", abreviatura: "TEBMA", ra: 3.61 },
    TECEP: { nombre: "Trietilcloroetilfosfonio", abreviatura: "TECEP", ra: 3.75 },
    TE2PeP: { nombre: "Trietil(2-propenil)fosfonio", abreviatura: "TE2PeP", ra: 3.68 },
    TEMOMP: { nombre: "Trietilmetoxidimetilfosfonio", abreviatura: "TEMOMP", ra: 3.72 },
    TEPP: { nombre: "Trietilpropilfosfonio", abreviatura: "TEPP", ra: 3.76 },
    TEFEP: { nombre: "Trietilfluoroetilfosfonio", abreviatura: "TEFEP", ra: 3.67 },
    DMFe: { nombre: "DecametilFerrocinio", abreviatura: "DMFe", ra: 4.47 },
    DMCo: { nombre: "DecametilCobaltocinio", abreviatura: "DMCo", ra: 4.44 },
    Cp2Co: { nombre: "Cobaltocinio", abreviatura: "Cp2Co", ra: 3.24 },
    Cp2Fe: { nombre: "Ferrocinio", abreviatura: "Cp2Fe", ra: 3.47 },
    TPhS: { nombre: "Trifenilsulfuro", abreviatura: "TPhS", ra: 4.12 },
    DABCO: { nombre: "1,4-Diazabicyclo[2.2.2]octane", abreviatura: "DABCO", ra: 3.21 }
};

function llenarCationA() {
    const select = document.getElementById("CATIONA");
    
    // Limpiar select antes de llenar
    select.innerHTML = '';

    // Agregar una opción vacía
    let emptyOption = document.createElement("option");
    emptyOption.value = '';
    emptyOption.text = 'Selecciona un catión';
    select.appendChild(emptyOption);

    // Llenar el select con las opciones de cationA
    for (let key in cationA) {
        if (cationA.hasOwnProperty(key)) {
            let option = document.createElement("option");
            option.value = cationA[key].ra; // Valor del radio iónico
            option.text = cationA[key].nombre; 
            option.dataset.nombre = cationA[key].nombre;
            option.dataset.ra = `r(${cationA[key].abreviatura}) = ${cationA[key].ra}`; // Consistencia en dataset
            select.appendChild(option);
        }
    }

    // Inicializar Select2
    $('#CATIONA').select2({
        placeholder: "Selecciona un catión",
        allowClear: true,
        width: '100%',
        templateResult: function (data) {
            if (!data.id || !data.element) {
                return data.text;
            }

            return $(`
                <div class="option-content">
                    <span class="nombre">${data.element.dataset.nombre}</span>
                    <span class="ra">${data.element.dataset.ra}</span> 
                </div>
            `);
        },
        templateSelection: function (data) {
            if (!data.id || !data.element) {
                return data.text;
            }

            return $(`
                <div class="option-content">
                    <span class="nombre">${data.element.dataset.nombre}</span>
                    <span class="ra">${data.element.dataset.ra}</span> 
                </div>
            `);
        }
    });
}
