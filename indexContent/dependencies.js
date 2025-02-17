// ________ *** STYLES.CSS *** ________

function loadCSS(href) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}


// Cargar estilos personalizados
const directorio = "indexContent/styles/"
const archivosCSS = ["forms.css", "select2.css"];
for (let i = 0; i < archivosCSS.length; i++) {
    loadCSS(directorio + archivosCSS[i]);
}


// ________ *** SCRIPTS .js *** ________
// Carga los scripts internos

function loadScript(src, isModule = false) {
    let script = document.createElement("script");
    script.src = src;
    if (isModule) {
      script.type = "module"; // Permite usar import/export
    } else {
      script.type = "text/javascript";
    }
    script.async = true;
    document.head.appendChild(script);
  }
  
// Calculos e interfaz
loadScript("indexContent/scripts/selectBoton.js");
loadScript("indexContent/scripts/tolerancia.js", true);

// Datos predeterminados
loadScript("indexContent/datos/aniones.js");
loadScript("indexContent/datos/cationes.js");


