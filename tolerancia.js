function calculo() {
    // Script para manejar el envío del formulario
    document.getElementById("datosForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        let volumen = parseFloat(document.getElementById("volum").value);  // Obtener el valor del volumen
        let unidad = document.getElementById("units").value;  // Obtener el valor de la unidad seleccionada
        let cationb = parseFloat(document.getElementById("CATIONB").value);  // Obtener el valor del cation b
        let cationa = parseFloat(document.getElementById("CATIONA").value);  // Obtener el valor del cation b

        let anionxSelect = document.getElementById("ANIONX");  // Seleccionar el <select> por su ID
        let anionxh = parseFloat(anionxSelect.selectedOptions[0].getAttribute('xh'));  // Obtener el valor de xh 
        let anionxr = parseFloat(anionxSelect.selectedOptions[0].getAttribute('xr'));  // Obtener el valor de xr 

        // Realizar el cálculo
        let tolerancia = (cationa + anionxr) / ((cationb + anionxh/2)**2);  // Calcular la tolerancia

        // Mostrar el resultado
        document.getElementById("resultado").innerText = ` Tolerancia ${tolerancia}`;  // Mostrar el resultado en el formato adecuado
    });
}
