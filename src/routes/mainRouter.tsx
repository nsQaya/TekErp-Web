import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layouts/default";

import StockItems from "../pages/stok/items";
import StockCode1Items from "../pages/stok/code1/items";
import StockCode2Items from "../pages/stok/code2/items";

import UlkeItems from "../pages/taminlamalar/ulke/items";
import IlItems from "../pages/taminlamalar/il/items";
import IlceItems from "../pages/taminlamalar/ilce/items";

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
        path: "/tanimlamalar",
        children: [
          {
            path: "ulkes",
            element: <UlkeItems />,
          },
          {
            path: "ils",
            element: <IlItems />,
          },
          {
            path: "ilces",
            element: <IlceItems />,
          },
        ],
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
          {
            path: "code2",
            element: <StockCode2Items />,
          },
        ],
      },
    ],
  },
]);
