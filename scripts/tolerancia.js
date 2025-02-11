function calculo() {
    document.getElementById("datosForm").addEventListener("submit", function(event) {
        // ___ *** RESET DE TODO *** ___
        document.getElementById("rango").innerText = ``;
        document.getElementById("resultado").innerText = ``;
        document.getElementById("ecuacionVolumen").innerText = ``;
        document.getElementById("ecuacion").innerText = ``;




        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        
        let cationA = parseFloat(document.getElementById("cationA").value);
        let cationB = parseFloat(document.getElementById("cationB").value);
        let volumenCationA = parseFloat(document.getElementById("volumenCationManualA").value);

        if (isNaN(cationA)) {  
            cationA = ((volumenCationA * 3) / (4* 3.141592653589793))**(1/3);

        }
        if (isNaN(cationB)) {  
            cationB = parseFloat(document.getElementById("cationManualB").value);
        }

        let anionSelect = document.getElementById("anion");  // Seleccionar el <select> por su ID
        let anionh = parseFloat(anionSelect.selectedOptions[0].getAttribute('xh'));  // Obtener el valor de xh 
        let anionr = parseFloat(anionSelect.selectedOptions[0].getAttribute('xr'));  // Obtener el valor de xr 

        if (isNaN(anionh)) {  
            anionh = parseFloat(document.getElementById("anionManualH").value);
        }
        if (isNaN(anionr)) {  
            anionr = parseFloat(document.getElementById("anionManualR").value);
        }

        // Realizar el cálculo tolerancia
        let tolerancia = (cationA + anionr) / ((cationB + anionh / 2) * 2**(1/2));  

        // Mostrar el resultado
        if (isNaN(tolerancia)){
            document.getElementById("resultado").innerText = `Error en los datos ingresados, completa todos los campos`; 
        }
        if (!isNaN(tolerancia)){

            if (!isNaN(volumenCationA)){
                let latexCationA = `r_{A} = \\left( \\frac{3 \\cdot ${volumenCationA}}{4 \\pi} \\right)^{\\frac{1}{3}}`;
                document.getElementById("ecuacionVolumen").innerHTML = `\\[ ${latexCationA} \\] `;
            }

            let latexEcuacionTolerancia = `\\alpha = \\frac{${cationA} + ${anionr}}{(${cationB} + \\frac{${anionh}}{2}) \\cdot \\sqrt{2}}`;
            document.getElementById("ecuacion").innerHTML = `\\[ ${latexEcuacionTolerancia} \\] `;
            
            let latexTolerancia = `\\alpha = ${tolerancia}`;
            document.getElementById("resultado").innerHTML = `\\[ ${latexTolerancia} \\] `;

            // ___ *** RENDERIZADO LaTex IMPORTANTE *** ___
            MathJax.typeset();
            

            if (tolerancia >=0.8 && tolerancia <= 1) {
                document.getElementById("rango").innerText = `La tolerancia está DENTRO del rango [0.8, 1]`;

            }
            else {
                document.getElementById("rango").innerText = `La tolerancia está fuera del rango [0.8, 1] pero ten en cuenta otras aproximaciones y la globularidad`;

            }
        }
    });
}
