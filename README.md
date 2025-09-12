================================

_____ACTUALIZAR PÁGINA WEB_____

================================


git add .

git commit -m "Escribir aquí mensaje"

git push origin {BRANCH}

Para crear Branch => git branch -m {NEW_BRANCH}


================================

_____________URLs______________

================================

PeroWeb:	https://prim2.github.io/PerovskitesWeb/

DataBase:	https://slcmugpuaomtuucyaiia.supabase.co



python -m http.server 8000
http://localhost:8000/index.html

# 🧪 HyPer Tolkit – PerovskitesWeb

**HyPer Tolkit** es una aplicación web interactiva diseñada para el estudio de perovskitas.  
Incluye herramientas para visualizar, calcular y analizar propiedades estructurales mediante el **factor de tolerancia extendido** y otros parámetros derivados.

🌐 **Demo online**: [PerovskitesWeb](https://prim2.github.io/PerovskitesWeb/)

---

## 🚀 Características principales

- **Cálculo del factor de tolerancia extendido**  
  Implementa la fórmula extendida de Goldschmidt para evaluar la estabilidad de perovskitas.

- **Tabla periódica interactiva**  
  Permite seleccionar cationes y aniones directamente desde una tabla periódica visual.

- **Visualización de datos**  
  Gráficas interactivas (basadas en **Chart.js**) para explorar la relación entre globularidad y tolerancia.

- **Búsqueda y exploración de materiales**  
  Diferentes interfaces de búsqueda (`Search Commons`, `Search v3`) para explorar la base de datos.

- **Gestión de base de datos**  
  Conexión con un backend en **Supabase** para almacenar y recuperar información de compuestos.

---

## 📂 Estructura del proyecto

- `index.html` → Página principal: cálculo del **factor de tolerancia extendido**:contentReference[oaicite:0]{index=0}  
- `periodicTable.html` → Tabla periódica interactiva:contentReference[oaicite:1]{index=1}  
- `dataTable.html` → Visualización tabular de la base de datos:contentReference[oaicite:2]{index=2}  
- `graf.html` → Gráficas interactivas con control de ejes y puntos personalizados:contentReference[oaicite:3]{index=3}  
- `v3.html` → Nueva versión de búsqueda avanzada:contentReference[oaicite:4]{index=4}  
- `searchCommons.html` → Página de búsquedas comunes:contentReference[oaicite:5]{index=5}  
- `template.html` → Plantilla base para nuevas páginas:contentReference[oaicite:6]{index=6}  
- `baseLayout/` → Scripts y estilos compartidos (header, footer, aside).  
- `README.txt` → Instrucciones rápidas para actualizar la web:contentReference[oaicite:7]{index=7}  

---

## ⚙️ Instalación y uso local

Clona el repositorio y levanta un servidor local:

```bash
git clone https://github.com/PRIM2/PerovskitesWeb.git
cd PerovskitesWeb
git checkout HyperTolKit3.0.2

# Iniciar servidor local
python -m http.server 8000


