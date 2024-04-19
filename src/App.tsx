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

  const updateBodyClasses = useCallback((classes: Set<string> | undefined) => {
    document.body.className = '';  // Clear all classes first
    classes?.forEach(className => document.body.classList.add(className));
  }, []);

  const onChangeSize = useCallback(() => {
    const width = window.innerWidth || screen.width;
    setBodyClasses(prevClasses => {
      const newClasses = new Set(prevClasses);
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
      pageWrapper.style.minHeight = `${height}px`;

      return newClasses;
    });
  }, []);



  const onToggleSidebar = useCallback(() => {
    setBodyClasses(prevClasses => {
      const newClasses = new Set(prevClasses);
      if (newClasses.has("show-sidebar")) {
        newClasses.delete("show-sidebar");
      } else {
        newClasses.add("show-sidebar");
      }
      return newClasses;
    });
  }, []);


  useEffect(() => {
    onChangeSize();
    window.addEventListener("resize", onChangeSize);
    window.addEventListener("toggleSidebar", onToggleSidebar);

    return () => {
      window.removeEventListener("resize", onChangeSize);
      window.removeEventListener("toggleSidebar", onToggleSidebar);
    };
  }, []);

  useEffect(() => {
    updateBodyClasses(bodyClasses);
  }, [bodyClasses]);


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
        <RouterProvider router={userStore.isLogged() ? mainRouter : authRouter} />
      </AppLayout>
    </>
  );
}

export default App;
