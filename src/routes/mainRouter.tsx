import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layouts/default";

import StockItems from "../pages/stok/items";

export default createHashRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/stok",
        children: [
          {
            path: "stoks",
            element: <StockItems />,
          },
        ],
      },
    ],
  },
]);
