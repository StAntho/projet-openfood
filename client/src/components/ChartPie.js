import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartPie({ plat, dessert }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const data = {
      labels: ["Desserts", "Plats"],
      datasets: [
        {
          data: [dessert, plat],
          backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 0.2)"],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    };

    // Créez un nouveau graphique
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: options,
    });

    // Assurez-vous de détruire le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dessert, plat]);

  return (
    <div style={{ width: "30%", margin: "0 auto" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
