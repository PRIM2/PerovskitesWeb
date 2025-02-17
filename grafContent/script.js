// Lista de puntos disponibles
const points = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 7 },
    { x: 4, y: 12 },
    { x: 5, y: 20 },
    { x: 6, y: 8 },
    { x: 7, y: 14 }
];

// Lista de puntos actualmente graficados
let plottedPoints = [];

// Configuración inicial de la gráfica
const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Puntos Seleccionados',
            data: plottedPoints,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            pointRadius: 6
        }]
    },
    options: {
        scales: {
            x: { type: 'linear', position: 'bottom' },
            y: { beginAtZero: true }
        }
    }
});

// Llenar la tabla de datos y los checkboxes
function populateData() {
    let tableBody = document.querySelector("#dataTable tbody");
    let checkboxContainer = document.getElementById("checkbox-container");

    tableBody.innerHTML = ""; // Limpiar tabla
    checkboxContainer.innerHTML = ""; // Limpiar checkboxes

    points.forEach((point, index) => {
        // Agregar a la tabla
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${point.x}</td><td>${point.y}</td>`;
        tableBody.appendChild(tr);

        // Agregar checkbox
        let div = document.createElement("div");
        div.classList.add("checkbox-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;
        checkbox.id = `checkbox-${index}`;

        let label = document.createElement("label");
        label.htmlFor = `checkbox-${index}`;
        label.textContent = `(${point.x}, ${point.y})`;

        div.appendChild(checkbox);
        div.appendChild(label);
        checkboxContainer.appendChild(div);
    });
}

// Función para agregar los puntos seleccionados a la gráfica
function addPointsToChart() {
    let checkboxes = document.querySelectorAll("#checkbox-container input[type='checkbox']:checked");

    checkboxes.forEach(checkbox => {
        let selectedPoint = points[checkbox.value];

        // Agregar el punto a la lista de graficados si no está ya
        if (!plottedPoints.some(p => p.x === selectedPoint.x && p.y === selectedPoint.y)) {
            plottedPoints.push(selectedPoint);
        }
    });

    myChart.update(); // Actualizar la gráfica
}

// Llenar la tabla y los checkboxes al cargar la página
populateData();
