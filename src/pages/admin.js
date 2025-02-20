import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Admin() {
  // const [admindata, setAdmindata] = useState({});
  const [errornmessage, seterrornmessage] = useState("");
  const [successnmessage, setsuccessnmessage] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [quizname, setquizname] = useState("");
  const [quizdesc, setquizdesc] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizData, setQuizData] = useState([]);

  // const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Fetch quiz data from the backend
    axios
      .get("https://quizappbackend-ten.vercel.app/quiz-attempts") // Make sure this endpoint returns the quiz attempt data
      .then((response) => {
        setQuizData(response.data);
        console.log(quizData);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  const processData = () => {
    const result = {};
    quizData.forEach((item) => {
      const date = new Date(item.submittedAt).toLocaleDateString(); // Get the date part only
      if (result[date]) {
        result[date]++;
      } else {
        result[date] = 1;
      }
    });

    // Convert the result to an array format for Recharts
    return Object.keys(result).map((date) => ({
      date,
      attempts: result[date],
    }));
  };

  const chartData = processData();

  async function addquiz(ev) {
    ev.preventDefault();
    setLoading(true);
    axios
      .post(
        "https://quizappbackend-ten.vercel.app/addquiz",
        {
          quizname,
          quizdesc,
          numQuestions,
          questions,
        },
        { withCredentials: true }
      )
      .then((response) => {
        setsuccessnmessage("NEW QUIZ CREATED SUCCESSFULLY");
        seterrornmessage("");
        console.log(response.data);
      })
      .catch(() => {
        seterrornmessage("SOMETHING WENT WRONG PLEASE TRY AGAIN");
        setsuccessnmessage("");
        console.log("qkuebfq", errornmessage);
      })
      .finally(() => setLoading(false));
  }

  const handleNumQuestionsChange = (e) => {
    let num = parseInt(e.target.value);
    if (isNaN(num) || num <= 0) {
      num = 0;
    }
    setNumQuestions(num);
    const newQuestions = Array.from({ length: num }, () => ({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
    }));
    setQuestions(newQuestions);
  };
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };
  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };
  const handleAnswerChange = (index, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = answerIndex;
    setQuestions(updatedQuestions);
  };
  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const calculateAverageScore = () => {
    let totalScore = 0;
    let totalMaxScore = 0;

    quizData.forEach((item) => {
      totalScore += item.score;
      totalMaxScore += item.maxScore;
    });

    return totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0; // Return the percentage
  };

  // Usage
  const averageScore = Math.round(calculateAverageScore() * 100) / 100;


  return (
    <>
      <div className="font-sans bg-gray-100 h-screen">
        <nav className="bg-blue-500 text-white p-4">
          {!loading ? (
            <ul className="flex space-x-6">
              <li
                className="cursor-pointer hover:bg-blue-700 p-2 rounded"
                onClick={() => handleTabClick("home")}
              >
                Add Quiz
              </li>
              <li
                className="cursor-pointer hover:bg-blue-700 p-2 rounded"
                onClick={() => handleTabClick("about")}
              >
                Analytics
              </li>
              <li
                className="cursor-pointer hover:bg-blue-700 p-2 rounded"
                onClick={() => handleTabClick("contact")}
              >
                Contact
              </li>
            </ul>
          ) : (
            <p className="text-center text-xl font-semibold">
              Creating new quiz...
            </p>
          )}
        </nav>
        <div className="p-6">
          {/* New Quiz */}
          <div
            className={`${
              activeTab === "home" ? "block" : "hidden"
            } bg-white p-6 rounded shadow-lg`}
          >
            {errornmessage && (
              <p className="text-center text-red-600 font-bold border border-red-500 my-4 mb-6">
                {errornmessage}
              </p>
            )}
            {successnmessage && (
              <p className="text-center text-green-600 font-bold border border-green-500 my-4 mb-6">
                {successnmessage}
              </p>
            )}
            <h2 className="text-2xl font-bold">New Quiz</h2>
            <br />
            <form onSubmit={addquiz}>
              <label
                htmlFor="quizname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                QUIZ NAME:
              </label>
              <input
                type="text"
                id="quizname"
                placeholder="Quiz name"
                onChange={(ev) => {
                  setquizname(ev.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
              />

              <label
                htmlFor="quizdesc"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                QUIZ DESCRIPTION:
              </label>
              <input
                type="text"
                id="quizdesc"
                placeholder="Quiz description"
                onChange={(ev) => {
                  setquizdesc(ev.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
              />

              {/* Input for number of questions */}
              <label htmlFor="numQuestions" className="block mb-2">
                Enter the number of questions:
              </label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                className="p-2 border border-gray-300 rounded mb-4"
                min="0"
              />

              {/* Dynamic question inputs */}
              {questions.map((question, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Question {index + 1}
                  </h3>

                  {/* Question input */}
                  <input
                    type="text"
                    placeholder={`Enter question ${index + 1}`}
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded mb-2 w-full"
                  />

                  {/* Options inputs */}
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        className={`p-2 border ${
                          optionIndex === question.answer
                            ? "border-green-500"
                            : "border-gray-300"
                        } rounded mr-2 w-1/3`}
                      />
                      <button
                        type="button"
                        onClick={() => handleAnswerChange(index, optionIndex)}
                        className={`p-1 border ${
                          optionIndex === question.answer
                            ? "border-green-500"
                            : "border-gray-300"
                        } rounded`}
                      >
                        {optionIndex === question.answer
                          ? "Correct"
                          : "Set as Correct"}
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              {/* Submit button to view all data (just for demo purposes) */}
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>

          {/* About */}
          <div
            className={`${
              activeTab === "about" ? "block" : "hidden"
            } bg-white p-6 rounded shadow-lg mt-6`}
          >
            <h2 className="text-2xl font-bold">About</h2>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Quiz Attempt Analytics
                </h2>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Quizzes Attempted Over Time
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="attempts"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* You can add other analytics like score distributions, max scores, etc. here */}
                {/* For example: */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Average Score
                    </h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {averageScore}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Total Quizzes Attempted
                    </h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {quizData.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div
            className={`${
              activeTab === "contact" ? "block" : "hidden"
            } bg-white p-6 rounded shadow-lg mt-6`}
          >
            <h2 className="text-2xl font-bold">Contact</h2>
            <p>contact</p>
          </div>
        </div>
      </div>
    </>
  );
}

// import { useEffect, useState } from "react";
// import {
//   addItem,
//   getAllItems,
//   updateItem,
//   deleteItem,
// } from "../IndexedDBHelper";

// export default function Result() {
//   const [items, setItems] = useState([]);
//   useEffect(() => {
//     loadItems();
//   }, []);
//   const loadItems = () => {
//     getAllItems()
//       .then((data) => setItems(data))
//       .catch(console.error);
//   };
//   console.log(items);
//   return (
//     <>
//       <h1>You scored</h1>
//     </>
//   );
// }
