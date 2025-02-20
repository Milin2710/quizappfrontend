import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 ">
      <div className="flex justify-between items-center w-[80vw] m-auto">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="w-32 h-auto" />
        </div>

        <ul className="flex space-x-8">
          <li>
            <NavLink
              to={"/"}
              className="text-white hover:bg-gray-600 px-4 py-2 rounded"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/result"}
              className="text-white hover:bg-gray-600 px-4 py-2 rounded"
            >
              History
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
