import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllItems } from "../IndexedDBHelper";

export default function Result() {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getAllItems();
        setResults(data);
        console.log("Loaded items:", data);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };

    loadItems();
  }, []);

  const latestResult = results[results.length - 1];
  const percentage = latestResult
    ? (latestResult.score / latestResult.totalQuestions) * 100
    : 0;
  const chartData = results.map((result) => ({
    id: `Quiz ${result.id}`,
    percentage: (result.score / result.totalQuestions) * 100,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-blue-600 px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-white text-center">
              Quiz Results
            </h1>
          </div>

          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600">
                        {Math.round(percentage)}%
                      </div>
                      <div className="text-blue-600 mt-1">Score</div>
                    </div>
                  </div>
                </div>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-blue-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-blue-600"
                    strokeDasharray={`${percentage * 5.52} 552`}
                  />
                </svg>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xl text-gray-600">
                  You scored{" "}
                  <span className="font-bold text-blue-600">
                    {latestResult ? latestResult.score : 0}
                  </span>{" "}
                  out of{" "}
                  <span className="font-bold text-blue-600">
                    {latestResult ? latestResult.totalQuestions : 0}
                  </span>{" "}
                  questions correctly!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quiz History
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="id" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="percentage"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  name="Score Percentage"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
