let chartTemp, chartVel, chartCorriente, chartVibracion;

export function initCharts() {
  const opts = (label, color) => ({
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        backgroundColor: color + "33",
        fill: true,
        tension: 0.4,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: false } }
    }
  });

  chartTemp      = new Chart(document.getElementById("chart-temp"),      opts("Temperatura (°C)", "#17a2b8"));
  chartVel       = new Chart(document.getElementById("chart-vel"),       opts("Velocidad (RPM)", "#28a745"));
  chartCorriente = new Chart(document.getElementById("chart-corriente"), opts("Corriente (A)", "#ffc107"));
  chartVibracion = new Chart(document.getElementById("chart-vibracion"), opts("Vibración (mm/s)", "#dc3545"));
}

export function updateCharts(registros) {
  const labels = registros.map(d =>
    d.fecha ? new Date(d.fecha.seconds * 1000).toLocaleTimeString("es-CO") : "—"
  );

  function setData(chart, values) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update();
  }

  setData(chartTemp,      registros.map(d => d.temperatura));
  setData(chartVel,       registros.map(d => d.velocidadMotor));
  setData(chartCorriente, registros.map(d => d.corriente));
  setData(chartVibracion, registros.map(d => d.vibracion));
}