function calculo() {
    // Script para manejar el envío del formulario
    document.getElementById("datosForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        
        let cationA = parseFloat(document.getElementById("cationA").value);
        let cationB = parseFloat(document.getElementById("cationB").value);
        
        if (isNaN(cationA)) {  
            let volumenCationA = parseFloat(document.getElementById("volumenCationManualA").value);
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

        // Realizar el cálculo
        let tolerancia = (cationA + anionr) / ((cationB + anionh / 2) ** 2);  // Calcular la tolerancia

        // Mostrar el resultado
        if (isNaN(tolerancia)){
            document.getElementById("resultado").innerText = `Error en los datos ingresados, completa todos los campos`; 
        }
        if (!isNaN(tolerancia)){
        document.getElementById("resultado").innerText = `Tolerancia = ${tolerancia}`;  // Mostrar el resultado en el formato adecuado
            if (tolerancia >=0.8 && tolerancia <= 1) {
                document.getElementById("rango").innerText = `La tolerancia está dentro del rango [0.8, 1]`;
            }
            else {
                document.getElementById("rango").innerText = `La tolerancia está fuera del rango [0.8, 1] pero ten en cuenta otras aproximaciones y la globularidad`;
            }
        }
    });
}
