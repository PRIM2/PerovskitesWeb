const cationB = {
    Be: { nombre: "Berilio", abreviatura: "Be", rb: 0.45 },
    Mg: { nombre: "Magnesio", abreviatura: "Mg", rb: 0.72 },
    Ca: { nombre: "Calcio", abreviatura: "Ca", rb: 1.0 },
    Sr: { nombre: "Estroncio", abreviatura: "Sr", rb: 1.18 },
    Ba: { nombre: "Bario", abreviatura: "Ba", rb: 1.35 },
    Ti: { nombre: "Titanio", abreviatura: "Ti", rb: 0.86 },
    V: { nombre: "Vanadio", abreviatura: "V", rb: 0.79 },
    Cr: { nombre: "Cromo", abreviatura: "Cr", rb: 0.8 },
    Mn: { nombre: "Manganeso", abreviatura: "Mn", rb: 0.83 },
    Fe: { nombre: "Hierro", abreviatura: "Fe", rb: 0.78 },
    Co: { nombre: "Cobalto", abreviatura: "Co", rb: 0.745 },
    Ni: { nombre: "Niquel", abreviatura: "Ni", rb: 0.69 },
    Pd: { nombre: "Paladio", abreviatura: "Pd", rb: 0.86 },
    Pt: { nombre: "Platino", abreviatura: "Pt", rb: 0.8 },
    Cu: { nombre: "Cobre", abreviatura: "Cu", rb: 0.73 },
    Ag: { nombre: "Plata", abreviatura: "Ag", rb: 0.94 },
    Zn: { nombre: "Cinc", abreviatura: "Zn", rb: 0.74 },
    Cd: { nombre: "Cadmio", abreviatura: "Cd", rb: 0.95 },
    Hg: { nombre: "Mercurio", abreviatura: "Hg", rb: 1.02 },
    Ge: { nombre: "Germanio", abreviatura: "Ge", rb: 0.73 },
    Sn: { nombre: "Estroncio", abreviatura: "Sn", rb: 1.15 },
    Pb: { nombre: "Plomo", abreviatura: "Pb", rb: 1.19 },
    Eu: { nombre: "Europio", abreviatura: "Eu", rb: 1.17 },
    Dy: { nombre: "Disprosio", abreviatura: "Dy", rb: 1.07 },
    Tm: { nombre: "Tulio", abreviatura: "Tm", rb: 1.03 },
    Yb: { nombre: "Iterbio", abreviatura: "Yb", rb: 1.02 },
    Np: { nombre: "Neptunio", abreviatura: "Np", rb: 1.1 },
    No: { nombre: "Nobelio", abreviatura: "No", rb: 1.1 },
    Li: { nombre: "Litio", abreviatura: "Li", rb: 0.9 },
    Na: { nombre: "Sodio", abreviatura: "Na", rb: 1.16 },
    K: { nombre: "Potasio", abreviatura: "K", rb: 1.52 },
    Rb: { nombre: "Rubidio", abreviatura: "Rb", rb: 1.66 },
    Cs: { nombre: "Cesio", abreviatura: "Cs", rb: 1.81 }
};




function llenarCationB() {
    const select = document.getElementById("CATIONB");
    
    // Limpiar select antes de llenar
    select.innerHTML = '';

    // Agregar una opción vacía
    let emptyOption = document.createElement("option");
    emptyOption.value = '';
    emptyOption.text = 'Selecciona un catión'; // Se agrega texto para evitar problemas
    select.appendChild(emptyOption);

    // Llenar el select con las opciones de cationB
    for (let key in cationB) {
        if (cationB.hasOwnProperty(key)) {
            let option = document.createElement("option");
            option.value = cationB[key].rb; // Valor del radio iónico
            option.text = cationB[key].nombre; 
            option.dataset.nombre = cationB[key].nombre;
            option.dataset.rb = `r(${cationB[key].abreviatura}) = ${cationB[key].rb}`;
            select.appendChild(option);
        }
    }

    // Inicializar Select2
    $('#CATIONB').select2({
        placeholder: "Selecciona un catión",
        allowClear: true,
        width: '100%',
        templateResult: function (data) {
            if (!data.id || !data.element) {
                return data.text; // Filtrado correcto usando 'text'
            }
            
            return $(`
                <div class="option-content">
                    <span class="nombre">${data.element.dataset.nombre}</span>
                    <span class="rb">${data.element.dataset.rb}</span>
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
                    <span class="rb">${data.element.dataset.rb}</span>
                </div>
            `);
        }
    });
}
