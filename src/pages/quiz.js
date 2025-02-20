import { useState, useEffect } from "react";
import Questions from "../components/questions";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  addItem,
//   getAllItems,
//   updateItem,
//   deleteItem,
} from "../IndexedDBHelper";

export default function Quiz() {
  const [quizData, setQuizData] = useState({
    quizname: "",
    quizdesc: "",
    totalques: 0,
    questions: [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const quizId = window.location.pathname.split("/").pop(); // Get quiz ID from URL
    if (!quizId) {
      setError("Quiz ID not found");
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:4000/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        setQuizData({
          quizname: data.quizname,
          quizdesc: data.quizdesc,
          totalques: data.numQuestions,
          questions: data.questions,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []); // Run once on component mount

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    const quizId = window.location.pathname.split("/").pop();
    try {
      const answersArray = Array.from(
        { length: quizData.questions.length },
        (_, i) => userAnswers[i] || null
      );
      console.log(answersArray);

      const response = await fetch(
        `http://localhost:4000/quiz/${quizId}/submit-answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: answersArray }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      addItem(result).catch(console.error);
      console.log("Quiz submitted:", result);
      navigate("/result");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];
  const hasAnswer = userAnswers[currentIndex] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Quiz Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              {quizData.quizname}
            </h1>
            <p className="mt-2 text-gray-600 text-center">
              {quizData.quizdesc}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2">
            <div
              className="bg-blue-500 h-2 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / quizData.totalques) * 100}%`,
              }}
            />
          </div>

          {/* Question Counter */}
          <div className="px-6 py-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} of {quizData.totalques}
            </p>
          </div>

          {/* Question Component */}
          <Questions
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedAnswer={userAnswers[currentIndex]}
            onAnswerChange={handleAnswerChange}
          />

          {/* Navigation Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentIndex === quizData.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!hasAnswer}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  disabled={!hasAnswer}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
