// archivo: formulario.js

function calculo() {
    // Script para manejar el envío del formulario
    document.getElementById("datosForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        let volumen = parseFloat(document.getElementById("volum").value);  // Obtener el valor del volumen
        let unidad = document.getElementById("units").value;  // Obtener el valor de la unidad seleccionada
          
        let suma = volumen * 0.5;

            // Mostrar el resultado
        document.getElementById("resultado").innerText = `El volumen ingresado es: ${suma} ${unidad}` //esto es lo mismo que "" + suma + " " + unidad;
        
    });
}




