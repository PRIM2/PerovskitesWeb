document.addEventListener("DOMContentLoaded", function () {
    
  let dir ="/PerovskitesWeb/baseLayout/"

  // Cargar el header
    fetch(`${dir}header.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').innerHTML = data;
      });
  
    // Cargar el aside
    fetch(`${dir}aside.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('aside').innerHTML = data;
      });
  
    // Cargar el footer
    fetch(`${dir}footer.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });
  });
  

  // ________ *** STYLES.CSS *** ________
function loadCSS(href) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}


// Cargar estilos personalizados
directorio = "/PerovskitesWeb/baseLayout/styles/"
archivosCSS = ["text.css", "contenedores.css"];
for (let i = 0; i < archivosCSS.length; i++) {
  loadCSS(directorio + archivosCSS[i]);
}
