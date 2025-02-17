async function cargarHeader() {
    const headerContainer = document.getElementById("header");

    const response = await fetch("baseLayout/comonPage/header.html");
    headerContainer.innerHTML = await response.text();

    if (!sessionStorage.getItem("headerActualizado")) {
        sessionStorage.setItem("headerActualizado", "Iniciar Sesión");
    }

    setTimeout(actualizarHeader, 30);
}

function actualizarHeader() {
    let headerUsuario = document.getElementById("Sesion");
    let nombreGuardado = sessionStorage.getItem("headerActualizado");

    if (nombreGuardado) headerUsuario.textContent = nombreGuardado;
}

cargarHeader();


import { uploadTolData, deleteTolData  } from "../../dataBase/dataHandler.js";  
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

        // ✅ Contenedor para NameCalc y botón
        let titleContainer = document.createElement("span");
        titleContainer.classList.add("title-container"); // Usamos la clase CSS

        // ✅ Agregar el NameCalc en negrita
        let title = document.createElement("strong");
        title.textContent = `🔹 ${item.NameCalc}`;

        // ✅ Crear botón de eliminar
        let btnDelete = document.createElement("button");
        btnDelete.textContent = "❌";
        btnDelete.title = "Eliminar";
        btnDelete.classList.add("mini-btn", "delete-btn");
        btnDelete.addEventListener("click", () => deleteTolData(item.NameCalc) );

        // ✅ Agregar elementos al contenedor
        titleContainer.appendChild(title);
        titleContainer.appendChild(btnDelete);
        listItem.appendChild(titleContainer);

        // ✅ Crear el bloque con Tolerance y Globularity
        let details = document.createElement("p");
        details.innerHTML = `Tolerance: ${item.Tolerance} <br> Globularity: ${item.Globularity}`;
        details.classList.add("detalles");

        listItem.appendChild(details);
        lista.appendChild(listItem);
    });

    output.innerHTML = "";
    output.appendChild(lista);
}


plotTolData1();







