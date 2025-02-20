import { NavLink } from "react-router-dom";

export default function Homequiz({ name, desc, qno, id, time }) {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg mb-4">
      <h1 className="text-2xl font-semibold text-gray-800 capitalize">
        {name}
      </h1>
      <p className="text-gray-600 mt-2">{desc}</p>
      <p className="mt-4 text-lg font-medium text-gray-700">{qno}</p>

      {/* NavLink with full width */}
      <NavLink
        to={`/quiz/${id}`}
        className="mt-6 block py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg text-center hover:bg-blue-600 transition duration-300"
      >
        START
      </NavLink>
    </div>
  );
}
