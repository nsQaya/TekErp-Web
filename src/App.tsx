import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Ulke from "./pages/genel/Ulke";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import Register from "./pages/auth/Register";

import defaultLayout from "./layouts/default";
import noAuthLayout from "./layouts/noAuth";

import './assets/css/style.css'
import { useCallback, useEffect, useState } from "react";



function App() {
  const layouts = [defaultLayout, noAuthLayout];
  const [bodyClasses, setBodyClasses] = useState(new Set(["horizontal-nav", "skin-megna", "fixed-layout"]));

  const updateBodyClasses = useCallback((classes: Set<string>) => {
    document.body.className = '';  // Clear all classes first
    classes.forEach(className => document.body.classList.add(className));
  }, []);

  const onChangeSize = useCallback(() => {
    const width = window.innerWidth || screen.width;
    const newClasses = new Set(bodyClasses);

    if (width < 1170) {
      newClasses.add("mini-sidebar");
      document.querySelector(".sidebartoggler i")?.classList.add("ti-menu");
    } else {
      newClasses.delete("mini-sidebar");
      document.querySelector(".sidebartoggler i")?.classList.remove("ti-menu");
    }

    const topOffset = 190;
    let height = (window.innerHeight || screen.height) - 1 - topOffset;
    height = Math.max(height, 1);  // Ensure height is at least 1

    const pageWrapper = document.querySelector(".page-wrapper") as HTMLElement;
    if (pageWrapper) {
        pageWrapper.style.minHeight = `${height}px`;
    }

    setBodyClasses(newClasses);
  }, [bodyClasses]);



  const onToggleSidebar = useCallback(() => {
    const newClasses = new Set(bodyClasses);
    if (newClasses.has("show-sidebar")) {
      newClasses.delete("show-sidebar");
    } else {
      newClasses.add("show-sidebar");
    }
    setBodyClasses(newClasses);
  }, [bodyClasses]);


  useEffect(() => {
    onChangeSize();
    window.addEventListener("resize", onChangeSize);
    window.addEventListener("toggleSidebar", onToggleSidebar);

    return () => {
      window.removeEventListener("resize", onChangeSize);
      window.removeEventListener("toggleSidebar", onToggleSidebar);
    };
  }, [onChangeSize, onToggleSidebar]);

  useEffect(() => {
    updateBodyClasses(bodyClasses);
  }, [bodyClasses, updateBodyClasses]);


  const userStore = useUserStore();
  const authRouter = createHashRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
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
