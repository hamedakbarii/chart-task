"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const timeOptions = [
  { label: "1H", value: "1" },
  { label: "24H", value: "24" },
  { label: "1W", value: "7" },
  { label: "1M", value: "30" },
  { label: "3M", value: "90" },
  { label: "6M", value: "180" },
  { label: "1Y", value: "365" },
];

const BitcoinChart = () => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "USD",
  ]);
  const [selectedTime, setSelectedTime] = useState<string>("30");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedCurrencies((prev) => [...prev, value]);
    } else {
      setSelectedCurrencies((prev) =>
        prev.filter((currency) => currency !== value)
      );
    }
  };

  const fetchChartData = async () => {
    try {
      const datasets = await Promise.all(
        selectedCurrencies.map(async (currency) => {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
            {
              params: {
                vs_currency: currency.toLowerCase(),
                days: selectedTime,
              },
            }
          );

          const prices = response.data.prices;

          return {
            label: currency,
            data: prices.map(([, price]: [number, number]) => price),
            borderColor:
              currency === "USD" ? "rgba(75,192,192,1)" : "rgba(192,75,75,1)",
            backgroundColor:
              currency === "USD"
                ? "rgba(75,192,192,0.2)"
                : "rgba(192,75,75,0.2)",
            borderWidth: 2,
          };
        })
      );

      const labels = datasets.length
        ? datasets[0].data.map((_: number, index: number) => {
            const timestamp = datasets[0].data[index];
            return timestamp ? new Date(timestamp).toLocaleDateString() : "";
          })
        : [];

      setChartData({ labels, datasets });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedCurrencies, selectedTime, fetchChartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Bitcoin Price Chart",
        color: "white",
        font: {
          size: 16,
          weight: "bold" as const, // Ensure TypeScript recognizes "bold" as one of the valid options
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md">
      <div className="flex justify-between items-center p-5">
        {/* Currency Selection */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              value="USD"
              checked={selectedCurrencies.includes("USD")}
              onChange={(e) => handleCheckboxChange(e)}
              className="mr-2"
            />
            USD
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="ETH"
              checked={selectedCurrencies.includes("ETH")}
              onChange={(e) => handleCheckboxChange(e)}
              className="mr-2"
            />
            ETH
          </label>
        </div>

        {/* Time Range Buttons */}
        <div className="flex space-x-2 mb-4">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTime(option.value)}
              className={`px-4 py-2 rounded ${
                selectedTime === option.value ? "bg-blue-500" : "bg-gray-700"
              } hover:bg-blue-600`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BitcoinChart;
