// ________ *** STYLES.CSS *** ________

function loadCSS(href) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}


// Cargar estilos personalizados
directorio = "styles/"
archivosCSS = ["general.css", "contenedores.css", "body/forms.css", "body/generalbody.css", "body/select2.css"];
for (let i = 0; i < archivosCSS.length; i++) {
    loadCSS(directorio + archivosCSS[i]);
}


// ________ *** SCRIPTS .js *** ________
// Carga MathJax para LaTeX
document.write('<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>');

// Carga los scripts internos
document.write('<script src="scripts/selectBoton.js"><\/script>');
document.write('<script src="scripts/tolerancia.js"><\/script>');

// Carga los archivos de datos
document.write('<script src="datos/aniones.js"><\/script>');
document.write('<script src="datos/cationes.js"><\/script>');
