// ________ *** STYLES.CSS *** ________

function loadCSS(href) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}


// Cargar estilos personalizados
directorio = "indexContent/styles/"
archivosCSS = ["forms.css", "select2.css"];
for (let i = 0; i < archivosCSS.length; i++) {
    loadCSS(directorio + archivosCSS[i]);
}


// ________ *** SCRIPTS .js *** ________
// Carga los scripts internos
document.write('<script src="indexContent/scripts/selectBoton.js"><\/script>');
document.write('<script src="indexContent/scripts/tolerancia.js"><\/script>');

// Carga los archivos de datos
document.write('<script src="indexContent/datos/aniones.js"><\/script>');
document.write('<script src="indexContent/datos/cationes.js"><\/script>');
