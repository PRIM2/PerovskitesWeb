document.addEventListener("DOMContentLoaded", function () {
  let dir = "baseLayout/comonPage/";

  async function cargarFragmento(idElemento, url) {
      try {
          let finalUrl = url;

          // 🔹 Si es la primera sesión, agregamos `?nocache=` para forzar la actualización
          if (!sessionStorage.getItem("firstSession")) {
              const timestamp = new Date().getTime();
              finalUrl = `${url}?nocache=${timestamp}`;
          }

          const response = await fetch(finalUrl);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          document.getElementById(idElemento).innerHTML = await response.text();
      } catch (error) {
          console.error(`❌ Error cargando ${url}:`, error);
      }
  }

  // 🔹 Cargar los fragmentos de HTML
  cargarFragmento("header", `${dir}header.html`);
  cargarFragmento("aside", `${dir}aside.html`);
  cargarFragmento("footer", `${dir}footer.html`);

  // ✅ Marcar que la primera sesión ya ocurrió
  sessionStorage.setItem("firstSession", "true");
});

  // ________ *** STYLES.CSS *** ________
function loadCSS(href) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}


// Cargar estilos personalizados
const directorio = "baseLayout/styles/"
const archivosCSS = ["text.css", "contenedores.css", "asideSaved.css"];
for (let i = 0; i < archivosCSS.length; i++) {
  loadCSS(directorio + archivosCSS[i]);
}



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

// Cargar upheader.js como módulo
loadScript("./baseLayout/scripts/updates.js", true);
