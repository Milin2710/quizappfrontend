import { useEffect, useState } from "react";
import Homequiz from "../components/homequiz";
import axios from "axios";

export default function Home() {
  const [quizes, setquizes] = useState([]);
  const [errornmessage, seterrornmessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://quizappbackend-ten.vercel.app/quizes", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setquizes(response.data);
      })
      .catch(() => {
        seterrornmessage("something went wrong please try after some time");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {errornmessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-md">
          <p className="text-red-700 font-medium">{errornmessage}</p>
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {quizes.map((quiz, index) => (
          <li
            key={index}
            className="h-full transform transition-transform hover:-translate-y-1 duration-200"
          >
            <Homequiz
              name={quiz.quizname}
              desc={quiz.quizdesc}
              qno={quiz.numQuestions}
              id={quiz._id}
              time="30 min"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
