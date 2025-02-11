// ________ *** STYLES.CSS *** ________

function loadCSS(href) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}


// Cargar estilos personalizados
directorio = "styles/"
archivosCSS = ["general.css", "contenedores.css", "body/forms.css", "body/select2.css"];
for (let i = 0; i < archivosCSS.length; i++) {
    loadCSS(directorio + archivosCSS[i]);
}


// ________ *** SCRIPTS .js *** ________
// Carga los scripts internos
document.write('<script src="scripts/selectBoton.js"><\/script>');
document.write('<script src="scripts/tolerancia.js"><\/script>');

// Carga los archivos de datos
document.write('<script src="datos/aniones.js"><\/script>');
document.write('<script src="datos/cationes.js"><\/script>');
