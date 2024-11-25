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

export const CropChart = ({ labels = [], dataValues = [], label = '' }) => {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: dataValues,
        borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color del relleno de los puntos
        pointStyle: 'circle', // Estilo de los puntos siempre definido como círculo
        pointRadius: 6, // Radio del punto
        pointHoverRadius: 8, // Radio del punto al pasar el cursor
        borderWidth: 2, // Grosor de la línea
        showLine: true, // Oculta la línea para mostrar solo los puntos
      },
    ],
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
        display: false,
        text: 'Estadísticas del Cultivo',
      },
    },
  };

  return <Line data={data} options={options} />;
};
