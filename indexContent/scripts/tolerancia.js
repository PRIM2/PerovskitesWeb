// import { agregarTolData, comprobarSesion } from "../../dataBase/dataHandler.js";


window.calculo = async function calculo(event) {
    console.log(" Función calculo ejecutada");
    // ___ *** RESET DE TODO *** ___
    document.getElementById("rango").innerText = ``;
    document.getElementById("resultado").innerText = ``;
    document.getElementById("ecuacionVolumen").innerText = ``;
    document.getElementById("ecuacion").innerText = ``;
    document.getElementById("errorInput").innerText = ``;


    // Cojo valores del form
    let cationA = parseFloat(document.getElementById("cationA").value);
    let cationB = parseFloat(document.getElementById("cationB").value);
    let volumenCationA = parseFloat(document.getElementById("volumenCationManualA").value);

    
    if (isNaN(cationA)) {  
        // Calculo el radio si introducen el volumen
        cationA = ((volumenCationA * 3) / (4* Math.PI))**(1/3);
    }
    if (isNaN(cationB)) {  
        cationB = parseFloat(document.getElementById("cationManualB").value);
    }

    let anionSelect = document.getElementById("anion");  
    let anionh = parseFloat(anionSelect.selectedOptions[0].getAttribute('xh'));  
    let anionr = parseFloat(anionSelect.selectedOptions[0].getAttribute('xr'));  

    if (isNaN(anionh)) {  
        anionh = parseFloat(document.getElementById("anionManualH").value);
    }
    if (isNaN(anionr)) {  
        anionr = parseFloat(document.getElementById("anionManualR").value);
    }

    // Realizar el cálculo tolerancia
    let tolerancia = parseFloat(((cationA + anionr) / ((cationB + anionh / 2) * Math.SQRT2)).toFixed(4));


    // ___ *** MOSTRAR RESULTADO POR PANTALLA *** ___
    if (isNaN(tolerancia)) {
        document.getElementById("errorInput").innerHTML = `Inner data error, complete all: <br> Anion, Cation A, Cation B`; 
        return;
    }

    if (!isNaN(tolerancia)) {
        if (!isNaN(volumenCationA)) {
            let latexCationA = `r_{A} = \\left( \\frac{3 \\cdot ${volumenCationA}}{4 \\pi} \\right)^{\\frac{1}{3}}`;
            document.getElementById("ecuacionVolumen").innerHTML = `\\[ ${latexCationA} \\] `;
        }

        let latexEcuacionTolerancia = `\\alpha = \\frac{${cationA} + ${anionr}}{(${cationB} + \\frac{${anionh}}{2}) \\cdot \\sqrt{2}} `;
        document.getElementById("ecuacion").innerHTML = `\\[ ${latexEcuacionTolerancia} \\] `;
        
        let latexTolerancia = `\\alpha = ${tolerancia}`;
        document.getElementById("resultado").innerHTML = `\\[ ${latexTolerancia} \\] `;

        // ___ *** RENDERIZADO LaTex IMPORTANTE *** ___
        MathJax.typeset();


        if (tolerancia >= 0.8 && tolerancia <= 1) {
            document.getElementById("rango").innerText = `Tolerance in range >> [0.8, 1]`;
        } else {
            document.getElementById("rango").innerText = `Tolerance out of range [0.8, 1] but consider globularity and other approximations`;
        }
        
    }
}



function createButtonAndInput(tolerancia) {
    let container = document.getElementById("savings"); 

    // Eliminar el contenido del div
    container.innerHTML = "";

    // Crear input y botton
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nombre para guardar XD ...";
    input.classList.add("mi-input");
    
    input.style.backgroundColor = "white";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    input.style.padding = "12px";
    input.style.fontSize = "14px";
    input.style.color = "#555";
    input.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
    input.style.marginRight = "20px";
    input.style.setProperty("width", "70%", "important");

    input.addEventListener("focus", function() {
        input.style.borderColor = "#aaa";
        input.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
    });
    
    let button = document.createElement("button");
    button.textContent = "Guardar";
    button.type = "button";
    button.style.setProperty("width", "115px", "important");

    button.onclick = function() { takeData(input.value, tolerancia); }


    container.appendChild(input);
    container.appendChild(button);

    
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";
    container.style.flexWrap = "wrap"; // Permite salto de línea en pantallas pequeñas
    container.style.width = "100%";

}





document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("datosForm").addEventListener("submit", calculo);
});


