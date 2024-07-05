import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layouts/default";

import StockItems from "../pages/stok/items";
import StockCode1Items from "../pages/stok/code1/items";
import StockCode2Items from "../pages/stok/code2/items";
import StockCode3Items from "../pages/stok/code3/items";
import StockCode4Items from "../pages/stok/code4/items";
import StockCode5Items from "../pages/stok/code5/items";

import IhtiyacPlanlama from "../pages/planlama/ihtiyacPlanlama"

import IhtiyacPlanlamaRapor from "../pages/rapor/ihtiyacPlanlamaRapor"

import UlkeItems from "../pages/taminlamalar/ulke/items";
import IlItems from "../pages/taminlamalar/il/items";
import IlceItems from "../pages/taminlamalar/ilce/items";
import DepoItems from "../pages/taminlamalar/depo/items";
import HucreItem from "../pages/taminlamalar/hucre/items";
import DovizTipiItem from "../pages/taminlamalar/dovizTipi/items";
import PlasiyerItem from "../pages/taminlamalar/plasiyer/items";
import ProjeItem from "../pages/taminlamalar/proje/items";
import UniteItem from "../pages/taminlamalar/unite/items";

import AmbarCikisFisiListe from "../pages/fatura/ambarCikisFisiListe";
import AmbarFisiEkle from "../pages/fatura/ambarFisiEkle";
import AmbarCikisFisi from "../pages/fatura/ambarCikisFisi";


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
          {
            path: "depoes",
            element: <DepoItems />,
          },
          {
            path: "hucres",
            element: <HucreItem />,
          },
          {
            path: "dovizTipis",
            element: <DovizTipiItem />,
          },
          {
            path: "plasiyers",
            element: <PlasiyerItem />,
          },
          {
            path: "projes",
            element: <ProjeItem />,
          },
          {
            path: "unites",
            element: <UniteItem />,
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
          {
            path: "code3",
            element: <StockCode3Items />,
          },
          {
            path: "code4",
            element: <StockCode4Items />,
          },
          {
            path: "code5",
            element: <StockCode5Items />,
          },
        ],
      },
      {
        path: "/fatura",
        children: [
          {
            path: "satisfatura",
            element: <IhtiyacPlanlama />,
          },
          {
            path: "alisfatura",
            element: <StockCode1Items />,
          },
          {
            path: "satisirsaliye",
            element: <StockCode2Items />,
          },
          {
            path: "alisirsaliye",
            element: <StockCode2Items />,
          },
          {
            path: "ambarcikisfisiliste",
            element: <AmbarCikisFisiListe />,
          },
          {
            path: "ambarcikisfisi",
            element: <AmbarCikisFisi />,
          },
          {
            path: "ambargirisfisi",
            element: <AmbarCikisFisi />,
          },
          {
            path: "depolararasitransfer",
            element: <StockCode2Items />,
          },
          {
            path: "ambarfisiekle",
            element: <AmbarFisiEkle />,
          },
        ],
      },
      {
        path: "/planlama",
        children: [
          {
            path: "ihtiyacplanlama",
            element: <IhtiyacPlanlama />,
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
      {
        path: "/rapor",
        children: [
          {
            path: "ihtiyacPlanlamaRapor",
            element: <IhtiyacPlanlamaRapor />,
          },
        ],
      },
    ],
  },
]);
