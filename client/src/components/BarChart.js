import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BarChart({ nombre, produits, title }) {
  console.log(nombre);
  console.log(produits);
  const chartContainer = useRef(null);
  let barChart = null;

  const labs = [];
  const code = [];
  const nb = [];

  {
    Object.keys(produits).map(
      (key) => (
        labs.push(produits[key].product_name_fr), code.push(produits[key].id)
      )
    );
  }
  code.map((key) => nb.push(nombre[key]));

  console.log(labs);
  console.log(code);
  console.log(nb);
  useEffect(() => {
    const data = {
      labels: labs,
      datasets: [
        {
          label: "Rechercher pour le substituer",
          data: nb, // Les données de votre graphique
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    if (barChart) {
      barChart.destroy();
    }

    const ctx = chartContainer.current.getContext("2d");
    barChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    // Retour de la fonction pour nettoyer le graphique lors du démontage du composant
    return () => {
      if (barChart) {
        barChart.destroy();
      }
    };
  }, [nb, labs, code]);

  return (
    <div>
      <h2>{title}</h2>
      <canvas ref={chartContainer} width="400" height="200" />
    </div>
  );
}
