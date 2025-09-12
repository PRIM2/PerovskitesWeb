function elegirCationes() {
    let inputs = ["volumenCationManualA", "cationManualB"];
    let selects = ["cationA", "cationB"];
 
    for (let i = 0; i < selects.length; i++) {
        let select = document.getElementById(selects[i]);
        let input = document.getElementById(inputs[i]);
        
        if (!select || !input) {
            console.error("Elementos no encontrados en el DOM");
            return;
        }

        // Deshabilitar el select2 si el input tiene un valor
        input.addEventListener("input", function() {
            if (input.value.trim() !== "") {
                $(select).prop("disabled", true);
            } else {
                $(select).prop("disabled", false);
            }
        });
// 
        // Deshabilitar el input si el select2 tiene un valor
        $(select).on("change", function() {
            if ($(select).val() !== null) {
                input.disabled = true;  
            } else {
                input.disabled = false;
            }
        });
    }
}


function elegirAniones() {
    // ¡¡¡ TIENE LOGICA OR PARA DISABLE Y AND PARA ENABLE !!!
    // Referencias a los elementos
    let select = document.getElementById("anion");
    let inputH = document.getElementById("anionManualH");
    let inputR = document.getElementById("anionManualR");


    // Deshabilitar el select si **cualquiera** de los inputs tiene valor
    function checkInputs() {
        if (inputH.value.trim() !== "" || inputR.value.trim() !== "") {
            $(select).prop("disabled", true);
        } else {
            $(select).prop("disabled", false);
        }
    }

    // Monitorear los cambios en los inputs
    inputH.addEventListener("input", checkInputs);
    inputR.addEventListener("input", checkInputs);

    // Deshabilitar los inputs si el select tiene un valor
    $(select).on("change", function() {
        if ($(select).val() !== null) {
            inputH.disabled = true;
            inputR.disabled = true;
        } else {
            inputH.disabled = false;
            inputR.disabled = false;
        }
    });
}


window.addEventListener("load", () => {    
        elegirAniones();

        elegirCationes();
});



