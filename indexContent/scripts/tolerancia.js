// import { agregarTolData, comprobarSesion } from "../../dataBase/dataHandler.js";

window.calculo = async function calculo(event) {
    console.log("⚡ Función calculo ejecutada");

    // ___ RESET ___
    document.getElementById("rango").innerText = ``;
    document.getElementById("resultado").innerText = ``;
    document.getElementById("ecuacionVolumen").innerText = ``;
    document.getElementById("ecuacion").innerText = ``;
    document.getElementById("errorInput").innerText = ``;

    // --- Cationes ---
    let cationA = parseFloat(document.getElementById("cationA").value);
    let cationB = parseFloat(document.getElementById("cationB").value);
    let volumenCationA = parseFloat(document.getElementById("volumenCationManualA").value);

    if (isNaN(cationA) && !isNaN(volumenCationA)) {  
        cationA = ((volumenCationA * 3) / (4 * Math.PI)) ** (1 / 3);
        console.log("📐 rA calculado desde volumen:", cationA);
    }

    if (isNaN(cationB)) {  
        cationB = parseFloat(document.getElementById("cationManualB").value);
        console.log("📐 rB manual:", cationB);
    }

    // --- Anión ---
    let anionSelect = document.getElementById("anion");
    let anionh = parseFloat(anionSelect?.selectedOptions[0]?.getAttribute("xh"));
    let anionr = parseFloat(anionSelect?.selectedOptions[0]?.getAttribute("xr"));

    if (isNaN(anionh)) {  
        anionh = parseFloat(document.getElementById("anionManualH").value);
    }
    if (isNaN(anionr)) {  
        anionr = parseFloat(document.getElementById("anionManualR").value);
    }

    console.log("📌 Datos recogidos:", { cationA, cationB, anionr, anionh });

    // --- Validación ---
    if (isNaN(cationA) || isNaN(cationB) || isNaN(anionr) || isNaN(anionh)) {
        document.getElementById("errorInput").textContent =
            "Inner data error, complete all fields (Cation A, Cation B, Anion).";
        console.warn("❌ Faltan datos para el cálculo");
        return;
    }

    // --- Cálculo ---
    let tolerancia = parseFloat(
        ((cationA + anionr) / ((cationB + anionh / 2) * Math.SQRT2)).toFixed(4)
    );
    console.log("✅ Tolerancia calculada:", tolerancia);

    // --- Globularity de Cation A ---
    let globularity = null;
    if (anionSelect) {
        const cationASelect = document.getElementById("cationA");
        if (cationASelect && cationASelect.selectedIndex >= 0) {
            const opt = cationASelect.options[cationASelect.selectedIndex];
            if (opt && opt.getAttribute("data-glob")) {
                globularity = parseFloat(opt.getAttribute("data-glob"));
            }
        }
    }
    console.log("🌐 Globularity extraída:", globularity);

    // --- Mostrar ---
    if (!isNaN(volumenCationA)) {
        let latexCationA = `r_{A} = \\left( \\frac{3 \\cdot ${volumenCationA}}{4 \\pi} \\right)^{\\frac{1}{3}}`;
        document.getElementById("ecuacionVolumen").innerHTML = `\\[ ${latexCationA} \\] `;
    }

    let latexEcuacionTolerancia = `\\alpha = \\frac{${cationA} + ${anionr}}{(${cationB} + \\frac{${anionh}}{2}) \\cdot \\sqrt{2}} `;
    document.getElementById("ecuacion").innerHTML = `\\[ ${latexEcuacionTolerancia} \\] `;
    
    let latexTolerancia = `\\alpha = ${tolerancia}`;
    document.getElementById("resultado").innerHTML = `\\[ ${latexTolerancia} \\] `;

    MathJax.typeset();

    if (tolerancia >= 0.8 && tolerancia <= 1) {
        document.getElementById("rango").innerText = `Tolerance in range >> [0.8, 1]`;
    } else {
        document.getElementById("rango").innerText =
            `Tolerance out of range [0.8, 1] but consider globularity and other approximations`;
    }

    // --- Guardar datos para Plot ---
    window.currentResults = {
        rows: [{
            compoundDisplay: "Manual Calculation",
            name: "Custom",
            rA: cationA,
            rB: cationB,
            xr: anionr,
            xh: anionh,
            tf: tolerancia,
            glob: globularity
        }],
        missing: "manual"
    };
    console.log("currentResults actualizado:", window.currentResults);
};

// --- Botón Plot ---
// --- Botón Plot ---
const form = document.getElementById("datosForm");
if (form) {
    form.addEventListener("submit", calculo);
    console.log("✅ Listener de submit añadido");
}

const plotBtn = document.getElementById("plotTable");
if (plotBtn) {
    console.log("✅ Botón Plot encontrado en el DOM");
    plotBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("👉 Botón Plot pulsado");
        console.log("window.currentResults:", window.currentResults);

        if (!window.currentResults) {
            console.warn("⚠️ No hay datos en currentResults");
            return;
        }

        localStorage.setItem("plotData", JSON.stringify(window.currentResults));
        console.log("✅ Datos guardados en localStorage:", window.currentResults);

        window.location.href = "graf.html";
    });
} else {
    console.error("❌ No se encontró #plotTable en el DOM");
}
