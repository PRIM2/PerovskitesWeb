function elegirCationes() {
  let inputs = ["volumenCationManualA", "cationManualB"];
  let selects = ["cationA", "cationB"];

  for (let i = 0; i < selects.length; i++) {
    let select = document.getElementById(selects[i]);
    let input = document.getElementById(inputs[i]);

    if (!select || !input) {
      console.error("Elementos no encontrados en el DOM");
      continue;
    }

    // 🔹 Deshabilitar select si el input tiene valor
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        $(select).prop("disabled", true).trigger("change"); 
      } else {
        $(select).prop("disabled", false).trigger("change"); 
      }
    });

    // 🔹 Deshabilitar input si el select tiene valor
    $(select).on("change", function () {
      const val = $(select).val();
      if (val && val !== "") {
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    });

    // 🔹 Inicializar coherente
    $(select).trigger("change");
  }
}

function elegirAniones() {
  let select = document.getElementById("anion");
  let inputH = document.getElementById("anionManualH");
  let inputR = document.getElementById("anionManualR");

  if (!select || !inputH || !inputR) {
    console.error("Elementos de aniones no encontrados en el DOM");
    return;
  }

  function checkInputs() {
    if (inputH.value.trim() !== "" || inputR.value.trim() !== "") {
      $(select).prop("disabled", true).trigger("change");
    } else {
      $(select).prop("disabled", false).trigger("change");
    }
  }

  inputH.addEventListener("input", checkInputs);
  inputR.addEventListener("input", checkInputs);

  $(select).on("change", function () {
    const val = $(select).val();
    if (val && val !== "") {
      inputH.disabled = true;
      inputR.disabled = true;
    } else {
      inputH.disabled = false;
      inputR.disabled = false;
    }
  });

  // 🔹 Inicializar coherente
  $(select).trigger("change");
}

window.addEventListener("load", () => {
  elegirCationes();
  elegirAniones();
});
