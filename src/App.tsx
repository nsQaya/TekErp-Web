import Login from "./pages/auth/Login";
import Home from "./pages/Home";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import Register from "./pages/auth/Register";

function App() {
  const userStore = useUserStore();

  const authRouter = createHashRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register/>,
    },
  ]);

  const mainRouter = createHashRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return (
    <>
      {userStore.isLogged() ? (
        <RouterProvider router={mainRouter} />
      ) : (
        <RouterProvider router={authRouter} />
      )}
    </>
  );
}

export default App;
