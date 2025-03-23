async function cargarHeader() {
    const headerContainer = document.getElementById("header");

    const response = await fetch("baseLayout/comonPage/header.html");
    headerContainer.innerHTML = await response.text();

    if (!sessionStorage.getItem("headerActualizado")) {
        sessionStorage.setItem("headerActualizado", "Log In");
    }

    setTimeout(actualizarHeader, 30);
}

function actualizarHeader() {
    let headerUsuario = document.getElementById("Sesion");
    let nombreGuardado = sessionStorage.getItem("headerActualizado");

    if (nombreGuardado) headerUsuario.textContent = nombreGuardado;
}

cargarHeader();


import { uploadTolData, deleteTolData } from "../../dataBase/dataHandler.js";

// ✅ Función para agregar los datos a la lista
async function plotTolData1() {
    const data = await uploadTolData();
    const tol_data = data.tol_data;

    if (!tol_data || tol_data.length === 0) {
        console.log("No hay datos en la base de datos :)");
        return;
    }

    let output = document.getElementById('listaGuardado');

    // ✅ Crear una lista <ul> y agregar elementos <li>
    let lista = document.createElement("ul");
    lista.classList.add("mi-lista");

    tol_data.forEach(item => {
        let listItem = document.createElement("li");

        // ✅ Contenedor para NameCalc y botón de eliminar
        let titleContainer = document.createElement("span");
        titleContainer.classList.add("title-container");

        let title = document.createElement("strong");
        title.textContent = `🔹 ${item.NameCalc}`;

        let btnDelete = document.createElement("button");
        btnDelete.textContent = "❌";
        btnDelete.title = "Eliminar";
        btnDelete.classList.add("mini-btn", "delete-btn");
        btnDelete.addEventListener("click", () => deleteTolData(item.NameCalc));

        titleContainer.appendChild(title);
        titleContainer.appendChild(btnDelete);
        listItem.appendChild(titleContainer);

        // ✅ Agregar Tolerance y Globularity
        let details = document.createElement("p");
        details.innerHTML = `Tolerance: ${item.Tolerance} <br> Globularity: ${item.Globularity}`;
        details.classList.add("detalles");
        listItem.appendChild(details);

        // ✅ Llamar a la función para agregar el checkbox de ploteo
        addPlotCheckbox(listItem, item.NameCalc, item.Tolerance, item.Globularity);

        lista.appendChild(listItem);
    });

    output.innerHTML = "";
    output.appendChild(lista);
}

function addPlotCheckbox(listItem, nameCalc, tolerance, globularity) {
    if (window.location.pathname.endsWith("graf.html")) { 
        // ✅ Crear contenedor para el checkbox y el texto
        let checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("plot-checkbox-container");

        // ✅ Crear el checkbox
        let checkboxPlot = document.createElement("input");
        checkboxPlot.type = "checkbox";
        checkboxPlot.classList.add("plot-checkbox");

        // ✅ Crear la etiqueta alineada
        let labelPlot = document.createElement("label");
        labelPlot.textContent = "Incluir en gráfica";
        labelPlot.classList.add("plot-checkbox-label");

        // ✅ Asociar el checkbox con la etiqueta (accesibilidad)
        let checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
        labelPlot.htmlFor = checkboxId;
        checkboxPlot.id = checkboxId;

        // ✅ Evento para agregar o quitar puntos de la gráfica
        checkboxPlot.addEventListener("change", () => {
            let tol_data = {
                name: nameCalc,
                x: parseFloat(globularity), // 🔹 Ahora Globularity está en el eje X
                y: parseFloat(tolerance) // 🔹 Ahora Tolerance está en el eje Y
            };

            if (checkboxPlot.checked) {
                // ✅ Agregar si no está ya en la gráfica
                if (!plottedPoints.some(p => p.x === tol_data.x && p.y === tol_data.y)) {
                    plottedPoints.push(tol_data);
                }
            } else {
                // ✅ Eliminar si se desmarca
                plottedPoints = plottedPoints.filter(p => !(p.x === tol_data.x && p.y === tol_data.y));
            }

            // ✅ Asignar los nuevos datos al gráfico y actualizarlo
            myChart.data.datasets[0].data = [...plottedPoints]; 
            myChart.update();
        });

        // ✅ Agregar checkbox y etiqueta al contenedor
        checkboxContainer.appendChild(checkboxPlot);
        checkboxContainer.appendChild(labelPlot);

        // ✅ Agregar el contenedor al elemento de la lista
        listItem.appendChild(checkboxContainer);
    }
}

// ✅ Llamar a la función principal
plotTolData1();







