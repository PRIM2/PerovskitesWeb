
// Lista de puntos   que se va rellenando
let plottedPoints = [];

const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Datos seleccionados',
            data: plottedPoints,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            pointRadius: 6
        }]
    },
    options: {
        scales: {
            x: { 
                type: 'linear', 
                position: 'bottom',
                title: { 
                    display: true,
                    text: 'Globularity', // 🔹 Cambiado para reflejar el eje correcto
                    font: { size: 16, weight: 'bold' }
                },
                min: 0.5, 
                max: 1 
            },
            y: { 
                beginAtZero: true,
                title: { 
                    display: true,
                    text: 'Tolerance', // 🔹 Cambiado para reflejar el eje correcto
                    font: { size: 16, weight: 'bold' }
                },
                min: 0.5, 
                max: 1.2 
            }
        }
    }
});



// ✅ Descargar la gráfica como imagen (PNG)
document.getElementById("downloadGrafpng").addEventListener("click", function() {
    let link = document.createElement('a');
    link.href = myChart.toBase64Image(); // Convertir a imagen PNG
    link.download = "grafica.png"; // Nombre del archivo
    link.click();
});

// ✅ Descargar los datos en formato CSV (Excel)
document.getElementById("downloadDatacsv").addEventListener("click", function() {
    let csvContent = "data:text/csv;charset=utf-8,Name,Globularity,Tolerance\n"; // Encabezado CSV

    plottedPoints.forEach(point => {
        csvContent += `${point.name},${point.x},${point.y}\n`; // Agregar datos con NameCalc
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.href = encodedUri;
    link.download = "datos.csv"; // Nombre del archivo
    link.click();
});

// ✅ Descargar los datos en formato CSV (Excel)
document.getElementById("downloadDataExcel").addEventListener("click", function() {
    let csvContent = "data:text/csv;charset=utf-8,Name;Globularity;Tolerance\n"; // Encabezado CSV con punto y coma

    plottedPoints.forEach(point => {
        csvContent += `${point.name};${point.x};${point.y}\n`; // Separado por `;`
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.href = encodedUri;
    link.download = "datos.csv"; // Nombre del archivo
    link.click();
});


// ✅ Descargar los datos en formato TXT (con separador de tabulaciones)
document.getElementById("downloadDatatxt").addEventListener("click", function() {
    let txtContent = "Name\tGlobularity\tTolerance\n"; // Encabezado TXT con tabulaciones

    plottedPoints.forEach(point => {
        txtContent += `${point.name}\t${point.x}\t${point.y}\n`; // Agregar datos con NameCalc
    });

    let blob = new Blob([txtContent], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "datos.txt"; // Nombre del archivo
    link.click();
});

