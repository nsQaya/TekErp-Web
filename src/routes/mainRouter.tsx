import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layouts/default";

import StockItems from "../pages/stok/items";
import StockCode1Items from "../pages/stok/code1/items";

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
          {
            path: "code1",
            element: <StockCode1Items />,
          },
        ],
      },
    ],
  },
]);
