import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [ setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  async function adminlogin(ev) {
    ev.preventDefault();
    setLoading(true);
    axios
      .post(
        "https://quizappbackend-ten.vercel.app/adminlogin",
        { username: username, password: password },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        // setIsAuthenticated(true);
        navigate("/admin");
      })
      .catch(() => {
        // setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Login
        </h1>

        <form onSubmit={adminlogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
