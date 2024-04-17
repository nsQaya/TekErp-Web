import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Ulke from "./pages/genel/Ulke";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import Register from "./pages/auth/Register";

import defaultLayout from "./layouts/default";
import noAuthLayout from "./layouts/noAuth";

import './assets/css/style.css'



document.body.className="skin-blue fixed-layout";

function App() {
  const layouts= [defaultLayout, noAuthLayout];

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
    {
      path: "/genel/ulkeler",
      element: <Ulke />,
    },
  ]);

  const AppLayout = layouts[userStore.isLogged() ? 0 : 1];
  
  return (
    <>
    <AppLayout>
      {userStore.isLogged() ? (
        <RouterProvider router={mainRouter} />
        ) : (
        <RouterProvider router={authRouter} />
      )}
    </AppLayout>
    </>
  );
}

export default App;
