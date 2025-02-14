async function cargarHeader() {
    const headerContainer = document.getElementById("header");

    const response = await fetch("baseLayout/header.html");
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



import { uploadTolData } from "../dataBase/dataHandler.js";  // Ruta correcta a tu archivo

async function plotTolData1() {
    const tol_data = await uploadTolData();

    if (!tol_data || tol_data.length === 0) {
        console.warn("⚠️ No hay datos en tol_data.");
        return;
    }

    console.log("✅ Datos obtenidos en plotTolData1:", tol_data);

    let output = document.getElementById('listaGuardado');

    // ✅ Crear una lista <ul> y agregar elementos <li>
    let lista = document.createElement("ul");
    lista.classList.add("mi-lista"); // Agrega una clase CSS para personalización
    

    //  ___ *** PONERLO BONITO *** ___
    tol_data.forEach(item => {
        let listItem = document.createElement("li");
    
        // ✅ Agregar el NameCalc en negrita
        let title = document.createElement("strong");
        title.textContent = `🔹 ${item.NameCalc}`;
        listItem.appendChild(title);
    
        // ✅ Crear el bloque con Tolerance y Globularity
        let details = document.createElement("p");
        details.innerHTML = `Tolerance: ${item.Tolerance} <br> Globularity: ${item.Globularity}`;
        details.classList.add("detalles"); // Agregar clase CSS para estilo
    
        listItem.appendChild(details);
        lista.appendChild(listItem);
    });
    
    // ✅ Reemplazar el contenido con la nueva lista
    output.innerHTML = "";
    output.appendChild(lista);

    console.log("✅ Lista generada en formato <ul><li>:", lista);
}

// 🔹 Llamar la función después de asegurarte que todo está listo
plotTolData1();

