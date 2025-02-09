    const AnionX = {
        F: { nombre: "Fluoruro", abreviatura: "F", xr: 1.285, xr: 2.57 },
        Cl: { nombre: "Cloruro", abreviatura: "Cl", xr: 1.81, xr: 3.62 },
        Br: { nombre: "Bromuro", abreviatura: "Br", xr: 1.96, xr: 3.92 },
        I: { nombre: "Ioduro", abreviatura: "I", xr: 2.2, xr: 4.4 },
        HCOO: { nombre: "Formiato", abreviatura: "HCOO", xr: 2.25, xr: 5.2 },
        CN: { nombre: "Cianuro", abreviatura: "CN", xr: 1.7575, xr: 4.464 },
        SCN: { nombre: "Tiocianato", abreviatura: "SCN", xr: 1.84, xr: 6.3 },
        BH4: { nombre: "Borohidruro", abreviatura: "BH4", xr: 2.03, xr: 4.06 },
        BF4: { nombre: "Tetrafluoroborato", abreviatura: "BF4", xr: 2.41, xr: 4.82 },
        HPOO: { nombre: "Hipofosfito", abreviatura: "HPOO", xr: 2.3, xr: 5.585 },
        ClO4: { nombre: "Perclorato", abreviatura: "ClO4", xr: 2.62, xr: 5.24 },
        N3: { nombre: "Azida", abreviatura: "N3", xr: 1.65, xr: 5.2 },
        DCA: { nombre: "Dicianamina", abreviatura: "DCA", xr: 1.9, xr: 7.56 },
        AgCN2: { nombre: "Dicianometalato (Ag)", abreviatura: "Ag(CN)2", xr: 1.95, xr: 9.52 },
        AuCN2: { nombre: "Dicianometalato (Au)", abreviatura: "Au(CN)2", xr: 2.04, xr: 9.49 },
        GaBr2: { nombre: "Dibromometalato (Ga)", abreviatura: "GaBr2", xr: 2.11, xr: 9.4 },
        InBr2: { nombre: "Dibromometalato (In)", abreviatura: "InBr2", xr: 2.25, xr: 9.43 },
        GaCl2: { nombre: "Diclorometalato (Ga)", abreviatura: "GaCl2", xr: 2.12, xr: 8.86 }
    };


    function llenarAnion() {
        const select = document.getElementById("ANIONX");
        
        // Limpiar select antes de llenar
        select.innerHTML = '';

        // Agregar una opción vacía
        let emptyOption = document.createElement("option");
        emptyOption.value = '';
        emptyOption.text = '';
        select.appendChild(emptyOption);

        // Llenar el select con las opciones de AnionX
        for (let key in AnionX) {
            if (AnionX.hasOwnProperty(key)) {
                let option = document.createElement("option");
                option.value = `${AnionX[key].xr}`;
                option.setAttribute('xh', `${AnionX[key].xr}`);  
                option.setAttribute('xr', `${AnionX[key].xr}`);  
                option.text = AnionX[key].nombre; 

                option.dataset.nombre = AnionX[key].nombre;
                option.dataset.xr = `r(${AnionX[key].abreviatura}) = ${AnionX[key].xr}`;
                option.dataset.xr = AnionX[key].xr;  // Guardamos xr en un nuevo dataset
                select.appendChild(option);
            }
        }
        // Inicializar Select2
        $('#ANIONX').select2({
            placeholder: "Selecciona un catión",
            allowClear: true,
            width: '100%',
            templateResult: function (data) {
                if (!data.id) {
                    return data.text;
                }
                return $(`
                    <div class="option-content">
                        <span class="nombre">${data.element.dataset.nombre}</span>
                        <span class="xr">${data.element.dataset.xr}</span>
                    </div>
                `);
            },
            templateSelection: function (data) {
                if (!data.id) {
                    return data.text;
                }
                return $(`
                    <div class="option-content">
                        <span class="nombre">${data.element.dataset.nombre}</span>
                        <span class="xr">${data.element.dataset.xr}</span>
                    </div>
                `);
            }
        });
    }
