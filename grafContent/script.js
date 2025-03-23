import { uploadData } from '../dataBase/dataHandler.js';

let dataPlotted = [];
const ctx = document.getElementById('myChart').getContext('2d');

let myChart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [] // ← se llenará dinámicamente por anión
  },
  options: {
    plugins: {
      responsive: true,           
      maintainAspectRatio: false, 
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          generateLabels: function(chart) {
            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
      
            const allVisible = chart.data.datasets.every((ds, i) => chart.isDatasetVisible(i));
            const toggleLabel = {
              text: allVisible ? 'Eliminar todo'  :  'Seleccionar todo',
              fillStyle: 'transparent',
              strokeStyle: 'black',
              lineWidth: 1,
              hidden: false,
              datasetIndex: -1 // marcador especial
            };
      
            return [toggleLabel, ...original];
          }
        },
        onClick: function(e, legendItem, legend) {
          const chart = legend.chart;
        
          if (legendItem.datasetIndex === -1) {
            // Se hizo clic en "Mostrar/Ocultar todo"
            const allVisible = chart.data.datasets.every((ds, i) => chart.isDatasetVisible(i));
            chart.data.datasets.forEach((_, i) => {
              chart.setDatasetVisibility(i, !allVisible);
            });
            chart.update();
          } else {
            // 🔧 CORRECTO: alternar visibilidad de uno solo
            const index = legendItem.datasetIndex;
            chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
            chart.update();
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const p = context.raw;
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
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Globularity',
          font: { size: 16, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Tolerance',
          font: { size: 16, weight: 'bold' }
        }
      }
    }
  }
});

// Limpia LaTeX y convierte subíndices a Unicode
function cleanFormula(text) {
  if (!text) return '';

  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
  };

  const toSubscript = (str) => str.replace(/[0-9+\-=\(\)]/g, d => subMap[d] || d);

  let plain = text.replace(/\\text{([^}]*)}/g, '$1');
  plain = plain.replace(/_([0-9]+)/g, (_, d) => toSubscript(d));
  plain = plain.replace(/([A-Za-z\)])([0-9]+)/g, (_, l, d) => l + toSubscript(d));

  return plain;
}

// Genera N colores distintos para graficar
function generateColors(n) {
  const colors = [];
  const saturation = 70;
  const lightness = 50;

  for (let i = 0; i < n; i++) {
    const hue = Math.floor((360 / n) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

// Función principal para cargar y graficar
async function plotMorePoints() {
  console.log("🔥 Ejecutando plotMorePoints");
  if (myChart.data.datasets.length > 0) {
    // Quitar todos los datasets
    myChart.data.datasets = [];
    myChart.update();
    dataPlotted = false;
    return;
  }
  const perovsData = await uploadData('perovsData', 'smilesA, smilesB, smilesAnion, tolFactor');
  const cationAData = await uploadData('cationA', 'smiles, abbreviature, radiusA_UDC, globularity, textName');
  const cationBData = await uploadData('cationB', 'smiles, ionicRadius, ion');
  const anionData   = await uploadData('anion',   'smiles, abbreviature, radiusA, lenghtA, textName');

  const anionMap = new Map(anionData.map(a => [a.smiles, a]));
  const cationAMap = new Map(cationAData.map(a => [a.smiles, a]));
  const cationBMap = new Map(cationBData.map(b => [b.smiles, b]));

  // Agrupar puntos por tipo de anión
  const groupedByAnion = new Map();

  perovsData.forEach(p => {
    const glob = cationAMap.get(p.smilesA)?.globularity;
    const tol = p.tolFactor;
    if (glob != null && tol != null) {
      const anionKey = p.smilesAnion;
      const anionInfo = anionMap.get(anionKey) || {};
      const catAInfo = cationAMap.get(p.smilesA) || {};
      const catBInfo = cationBMap.get(p.smilesB) || {};

      const punto = {
        x: parseFloat(glob),
        y: parseFloat(tol),
        anion: {
          abbreviature: anionInfo.abbreviature || '',
          radiusA: anionInfo.radiusA || '',
          lengthA: anionInfo.lenghtA || '',
          textName: anionInfo.textName || ''
        },
        cationA: {
          abbreviature: catAInfo.abbreviature || '',
          radiusA_UDC: catAInfo.radiusA_UDC || '',
          textName: catAInfo.textName || ''
        },
        cationB: {
          smiles: catBInfo.smiles || '',
          ionicRadius: catBInfo.ionicRadius || '',
          ion: catBInfo.ion || ''
        }
      };

      if (!groupedByAnion.has(anionKey)) groupedByAnion.set(anionKey, []);
      groupedByAnion.get(anionKey).push(punto);
    }
  });

  // Limpiar los datasets existentes
  myChart.data.datasets = [];

  const anionKeys = Array.from(groupedByAnion.keys());
  const colores = generateColors(anionKeys.length);

  anionKeys.forEach((anionKey, i) => {
    const puntos = groupedByAnion.get(anionKey);
    const anion = anionMap.get(anionKey);

    myChart.data.datasets.push({
      label: `${cleanFormula(anion?.textName || '')}⁻`,
      data: puntos,
      borderColor: colores[i],
      backgroundColor: colores[i],
      pointStyle: 'circle',
      pointRadius: 3
    });
  });

  myChart.update();
  dataPlotted = true;
}
document.getElementById("addDataButton").addEventListener("click", plotMorePoints);


// ✅ Descargar la gráfica como imagen (PNG)
document.getElementById("downloadGrafpng").addEventListener("click", function() {
    let link = document.createElement('a');
    link.href = myChart.toBase64Image(); // Convertir a imagen PNG
    link.download = "grafica.png"; // Nombre del archivo
    link.click();
});

