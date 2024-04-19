import Login from "../pages/auth/Login";
import NoAuthLayout from "../layouts/noAuth";
import { createHashRouter } from "react-router-dom";

export default createHashRouter([
  {
    path: "/",
    element: <NoAuthLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
]);
