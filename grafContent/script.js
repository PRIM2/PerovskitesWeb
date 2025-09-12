import { uploadData } from '../dataBase/dataHandler.js';

let allData = {};
let allCharts = {};
let currentMode = 'anion';

const ctx = document.getElementById('myChart').getContext('2d');

// Inicializa el gráfico vacío
let myChart = new Chart(ctx, {
  type: 'scatter',
  data: { datasets: [] },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          generateLabels: function (chart) {
            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            const allVisible = chart.data.datasets.every((ds, i) => chart.isDatasetVisible(i));
            const toggleLabel = {
              text: allVisible ? 'Hide all' : 'Show all',
              fillStyle: 'transparent',
              strokeStyle: 'black',
              lineWidth: 1,
              hidden: false,
              datasetIndex: -1
            };
            return [toggleLabel, ...original];
          }
        },
        onClick: function (e, legendItem, legend) {
          const chart = legend.chart;
          if (legendItem.datasetIndex === -1) {
            const allVisible = chart.data.datasets.every((ds, i) => chart.isDatasetVisible(i));
            chart.data.datasets.forEach((_, i) => {
              chart.setDatasetVisibility(i, !allVisible);
            });
            chart.update();
          } else {
            const index = legendItem.datasetIndex;
            chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
            chart.update();
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const p = context.raw;
            if (p.anion) { // datos principales
              const anion = p.anion || {};
              const catA = p.cationA || {};
              const catB = p.cationB || {};
              const anionName = cleanFormula(anion.textName);
              const catAName = cleanFormula(catA.textName);
              return [
                `${catAName}(${catB.ion})${anionName}`,
                `Anion: ${anion.abbreviature} (Radius: ${anion.radiusA}, Length: ${anion.lengthA})`,
                `Cation A: ${catA.abbreviature} (Radius UDC: ${catA.radiusA_UDC})`,
                `Cation B: ${catB.smiles} (Ionic Radius: ${catB.ionicRadius})`,
                `📍 Glob: ${p.x.toFixed(4)}, Tol: ${p.y.toFixed(4)}`
              ];
            } else { // punto personalizado
              return [`${p.name}: Glob ${p.x}, Tol ${p.y}`];
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Globularity', font: { size: 16, weight: 'bold' } }
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Tolerance', font: { size: 16, weight: 'bold' } }
      }
    }
  }
});

// ---------------- FUNCIONES GENERALES ----------------
function cleanFormula(text) {
  if (!text) return '';
  const subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎' };
  const toSubscript = str => str.replace(/[0-9+\-=\(\)]/g, d => subMap[d] || d);
  let plain = text.replace(/\\text{([^}]*)}/g, '$1');
  plain = plain.replace(/_([0-9]+)/g, (_, d) => toSubscript(d));
  plain = plain.replace(/([A-Za-z\)])([0-9]+)/g, (_, l, d) => l + toSubscript(d));
  return plain;
}

function generateColors(n) {
  const colors = [];
  const saturation = 70, lightness = 50;
  for (let i = 0; i < n; i++) {
    const hue = Math.floor((360 / n) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

function agruparDatos(perovsData, cationAMap, cationBMap, anionMap, modoAgrupacion) {
  const grouped = new Map();

  perovsData.forEach(p => {
    const glob = cationAMap.get(p.smilesA)?.globularity;
    const tol = p.tolFactor;
    if (glob == null || tol == null) return;

    let key = '', label = '';

    if (modoAgrupacion === 'anion') {
      const anion = anionMap.get(p.smilesAnion) || {};
      key = p.smilesAnion;
      label = cleanFormula(anion?.textName || '') + '⁻';
    }
    else if (modoAgrupacion === 'cationB') {
      const catB = cationBMap.get(p.smilesB) || {};
      key = p.smilesB;
      label = cleanFormula(catB?.ion || '');
    }

    const punto = {
      x: parseFloat(glob),
      y: parseFloat(tol),
      anion: anionMap.get(p.smilesAnion) || {},
      cationA: cationAMap.get(p.smilesA) || {},
      cationB: cationBMap.get(p.smilesB) || {}
    };

    if (!grouped.has(key)) grouped.set(key, { label, puntos: [] });
    grouped.get(key).puntos.push(punto);
  });

  return grouped;
}

// ------------- CARGA DE DATOS PRINCIPALES -------------
async function cargarDatos() {
  const perovsData = await uploadData('perovsData', 'smilesA, smilesB, smilesAnion, tolFactor');
  const cationAData = await uploadData('cationA', 'smiles, abbreviature, radiusA_UDC, globularity, textName');
  const cationBData = await uploadData('cationB', 'smiles, ionicRadius, ion');
  const anionData = await uploadData('anion', 'smiles, abbreviature, radiusA, lenghtA, textName');

  const anionMap = new Map(anionData.map(a => [a.smiles, a]));
  const cationAMap = new Map(cationAData.map(a => [a.smiles, a]));
  const cationBMap = new Map(cationBData.map(b => [b.smiles, b]));

  allData = { perovsData, cationAMap, cationBMap, anionMap };

  ['anion', 'cationB'].forEach(modo => {
    const grouped = agruparDatos(perovsData, cationAMap, cationBMap, anionMap, modo);
    const colores = generateColors(grouped.size);
    const datasets = [];

    let i = 0;
    for (let [key, group] of grouped.entries()) {
      datasets.push({
        label: group.label,
        data: group.puntos,
        borderColor: colores[i],
        backgroundColor: colores[i],
        pointStyle: 'circle',
        pointRadius: 3
      });
      i++;
    }

    allCharts[modo] = datasets;
  });

  actualizarGrafico('anion');
}

function actualizarGrafico(modo) {
  currentMode = modo;

  let datasetsPrincipales = [];
  if (allCharts[modo]) {
    datasetsPrincipales = [...allCharts[modo]];
  }

  const points = loadUserPoints();
  if (points.length > 0) {
    datasetsPrincipales.push({
      label: "New Perovskites",
      data: points.map(p => ({ x: p.x, y: p.y, name: p.name })),
      borderColor: points.map(p => p.color),
      backgroundColor: points.map(p => p.color),
      pointStyle: points.map(p => p.shape || "rect"),
      pointRadius: points.map(p => p.size),
      parsing: false,
      showLine: false
    });
  }

  myChart.data.datasets = datasetsPrincipales;
  myChart.update();
}

// ----------------- PUNTOS PERSONALIZADOS -----------------

const USER_POINTS_KEY = "userPoints";

function loadUserPoints() {
  const data = localStorage.getItem(USER_POINTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUserPoints(points) {
  localStorage.setItem(USER_POINTS_KEY, JSON.stringify(points));
}

function renderUserPointsTable() {
  const points = loadUserPoints();
  const tableBody = document.getElementById("userPointsTableBody");
  tableBody.innerHTML = "";

  points.forEach((point, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" value="${point.name}" onchange="handleEdit(${index}, 'name', this.value)"></td>
      <td><input type="number" step="0.0001" value="${point.x}" onchange="handleEdit(${index}, 'x', parseFloat(this.value))"></td>
      <td><input type="number" step="0.0001" value="${point.y}" onchange="handleEdit(${index}, 'y', parseFloat(this.value))"></td>
      <td><input type="color" value="${point.color}" onchange="handleEdit(${index}, 'color', this.value)"></td>
      <td><input type="number" value="${point.size}" min="1" max="20" onchange="handleEdit(${index}, 'size', parseInt(this.value))"></td>
      <td>
        <select onchange="handleEdit(${index}, 'shape', this.value)">
          <option value="circle" ${point.shape === 'circle' ? 'selected' : ''}>\u25CF</option>
          <option value="rect" ${point.shape === 'rect' ? 'selected' : ''}>\u25A0</option>
          <option value="triangle" ${point.shape === 'triangle' ? 'selected' : ''}>\u25B2</option>
          <option value="star" ${point.shape === 'star' ? 'selected' : ''}>\u2605</option>
          <option value="cross" ${point.shape === 'cross' ? 'selected' : ''}>	+</option>
          <option value="crossRot" ${point.shape === 'crossRot' ? 'selected' : ''}>\u2715</option>
        </select>
      </td>
      <td><button onclick="handleDelete(${index})">✕</button></td>
    `;
    tableBody.appendChild(row);
  });

  actualizarPuntosEnGrafica();
}

window.handleEdit = function(index, field, value) {
  const points = loadUserPoints();
  points[index][field] = value;
  saveUserPoints(points);
  actualizarPuntosEnGrafica();
}

window.handleDelete = function(index) {
  const points = loadUserPoints();
  points.splice(index, 1);
  saveUserPoints(points);
  renderUserPointsTable();
}

document.getElementById("addUserPointForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("newPointName").value.trim();
  const x = parseFloat(document.getElementById("newPointX").value);
  const y = parseFloat(document.getElementById("newPointY").value);
  const color = document.getElementById("newPointColor").value;
  const size = parseInt(document.getElementById("newPointSize").value);
  const shape = document.getElementById("newPointShape").value;

  if (name === "" || isNaN(x) || isNaN(y) || isNaN(size)) {
    alert("Introduce valores válidos.");
    return;
  }

  const points = loadUserPoints();
  points.push({ name, x, y, color, size, shape });
  saveUserPoints(points);

  e.target.reset();
  document.getElementById("newPointColor").value = "#ff0000";
  document.getElementById("newPointSize").value = 5;

  renderUserPointsTable();
});
function actualizarPuntosEnGrafica() {
  actualizarGrafico(currentMode);
}

// ----------------- EVENTOS PRINCIPALES -----------------

document.getElementById("addDataButton").addEventListener("click", async () => {
  if (Object.keys(allData).length === 0) {
    await cargarDatos();
  } else {
    allData = {};
    allCharts = {};
  }

  actualizarGrafico(currentMode);
});


document.getElementById("groupBy").addEventListener("change", (e) => {
  if (Object.keys(allData).length === 0) return;
  actualizarGrafico(e.target.value);
});

// ----------------- DESCARGA PNG -----------------

document.getElementById("downloadGrafpng").addEventListener("click", () => {
  const visibleDatasets = myChart.data.datasets.filter((_, i) => myChart.isDatasetVisible(i));

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 800;
  tempCanvas.height = 600;
  const tempCtx = tempCanvas.getContext('2d');

  const tempChart = new Chart(tempCtx, {
    type: 'scatter',
    data: { datasets: visibleDatasets },
    options: {
      responsive: false,
      plugins: { legend: { display: true, position: 'bottom' } },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Globularity' } },
        y: { type: 'linear', title: { display: true, text: 'Tolerance' } }
      }
    }
  });

  setTimeout(() => {
    let link = document.createElement('a');
    link.href = tempChart.toBase64Image();
    link.download = "grafica.png";
    link.click();
    tempChart.destroy();
  }, 500);
});


document.getElementById("applyAxis").addEventListener("click", () => {
  const xMin = parseFloat(document.getElementById("xMin").value);
  const xMax = parseFloat(document.getElementById("xMax").value);
  const yMin = parseFloat(document.getElementById("yMin").value);
  const yMax = parseFloat(document.getElementById("yMax").value);

  myChart.options.scales.x.min = isNaN(xMin) ? undefined : xMin;
  myChart.options.scales.x.max = isNaN(xMax) ? undefined : xMax;
  myChart.options.scales.y.min = isNaN(yMin) ? undefined : yMin;
  myChart.options.scales.y.max = isNaN(yMax) ? undefined : yMax;

  myChart.update();
});

document.getElementById("resetAxis").addEventListener("click", () => {
  document.getElementById("xMin").value = "";
  document.getElementById("xMax").value = "";
  document.getElementById("yMin").value = "";
  document.getElementById("yMax").value = "";

  myChart.options.scales.x.min = undefined;
  myChart.options.scales.x.max = undefined;
  myChart.options.scales.y.min = undefined;
  myChart.options.scales.y.max = undefined;

  myChart.update();
});

renderUserPointsTable();


