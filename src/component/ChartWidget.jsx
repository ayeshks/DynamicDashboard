import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ChartWidget = ({ content }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!content?.data || !content?.options) {
      console.error("Chart content must include `data` and `options`.");
      return;
    }

    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: content.type || "line", // Default to "line" if no type is provided
      data: content.data,
      options: content.options,
    });

    // Cleanup to destroy the chart instance when the component unmounts
    return () => {
      chart.destroy();
    };
  }, [content]); // Re-run effect if content changes

  return <canvas ref={chartRef} className="w-full h-64"></canvas>;
};

const initialWidgets = [
  {
    id: 1,
    type: "chart",
    content: {
      type: "bar",
      data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Sales",
            data: [12, 19, 3, 5, 2],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    },
  },
];


export default ChartWidget;
