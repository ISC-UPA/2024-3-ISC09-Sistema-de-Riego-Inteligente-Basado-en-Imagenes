import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const CropChart = ({ labels = [], datasets = [] }) => {
  const data = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      pointStyle: 'circle', // Estilo de los puntos (círculo)
      pointRadius: 6, // Radio del punto
      pointHoverRadius: 8, // Radio del punto al pasar el cursor
      borderWidth: 2, // Grosor de la línea
      showLine: true, // Asegura que se dibujen líneas entre los puntos
      tension: 0.4, // Controla la suavidad de las líneas
    })),
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};
