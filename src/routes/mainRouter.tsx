import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layouts/default";

import StockItems from "../pages/stok/items";
import StockGroupCode1Items from "../pages/stok/groupCode/items";
import StockCode1Items from "../pages/stok/code1/items";
import StockCode2Items from "../pages/stok/code2/items";
import StockCode3Items from "../pages/stok/code3/items";
import StockCode4Items from "../pages/stok/code4/items";
import StockCode5Items from "../pages/stok/code5/items";
import StockHareketlerNetsis from "../pages/stok/stokHarehetNetsis";
import Sayim from "../pages/stok/sayim/items";
import SayimYetki from "../pages/stok/sayimYetki/items";
import SayimDetay from "../pages/stok/sayimDetay/items";

import CariItems from "../pages/cari/cari";
import CariGrupKoduItems from "../pages/cari/cariGrupKod";
import CariKod1Items from "../pages/cari/cariKod1";
import CariKod2Items from "../pages/cari/cariKod2";
import CariKod3Items from "../pages/cari/cariKod3";
import CariKod4Items from "../pages/cari/cariKod4";
import CariKod5Items from "../pages/cari/cariKod5";

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
import BelgeSeriItem from "../pages/taminlamalar/belgeSeri/items";

import KullaniciItem from "../pages/kullanici/kullanici";
import KullaniciYetkiItem from "../pages/kullanici/kullaniciYetki";

import AmbarCikisFisiListe from "../pages/fatura/ambarCikisFisiListe";
import DepolarArasiTransferListe from "../pages/fatura/depolarArasiTransferListe";
import AmbarCikisFisi from "../pages/fatura/ambarCikisFisi";
import DepolarArasiTransferFisi from "../pages/fatura/depolarArasiTransferFisi"
import TalepTeklifListe from "../pages/fatura/talepTeklifListe";
import api from "../utils/api";
import SatinalmaTalepFisi from "../pages/fatura/satinalmaTalepFisi";
import Logout from "../pages/kullanici/logout";
import NetsisUretimSonuKaydiListe from "../pages/uretim/netsisUretimSonuKaydiListe";
import NetsisUretimSonuKaydi from "../pages/uretim/netsisUretimSonuKaydi";
import NetsisDepoIzin from "../pages/uretim/netsisDepoIzin";
import SatinalmaSiparisFisi from "../pages/fatura/satinalmaSiparisFisi";
import SatinalmaSiparisListe from "../pages/fatura/satinalmaSiparisListe";
import SiparisAcmaKapama from "../pages/fatura/siparisAcmaKapama";
import NetsisSiparisFaturaOnay from "../pages/fatura/netsisSiparisFaturaOnay";
import İthalatEkBilgiler from "../pages/fatura/ithalatEkBilgiler";






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
          {
            path: "belgeSeris",
            element: <BelgeSeriItem />,
          },
        ],
      },
      {
        path: "/kullanicilar",
        children: [
          {
            path: "kullanici",
            element: <KullaniciItem />,
          },
          {
            path: "kullaniciyetki",
            element: <KullaniciYetkiItem />,
          },
          {
            path: "logout",
            element: <Logout />,
          }
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
            path: "groupCode",
            element: <StockGroupCode1Items />,
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
          {
            path: "stokHareketler",
            element: <StockHareketlerNetsis />,
          },
          {
            path: "sayim",
            element: <Sayim/>,
          },
          {
            path: "sayimYetki",
            element: <SayimYetki/>,
          },
          {
            path: "sayimDetay",
            element: <SayimDetay/>,
          },
         
         
          
        ],
      },
      {
        path: "/cari",
        children: [
          {
            path: "caris",
            element: <CariItems />,
          },
          {
            path: "groupCode",
            element: <CariGrupKoduItems />,
          },
          {
            path: "code1",
            element: <CariKod1Items />,
          },
          {
            path: "code2",
            element: <CariKod2Items />,
          },
          {
            path: "code3",
            element: <CariKod3Items />,
          },
          {
            path: "code4",
            element: <CariKod4Items />,
          },
          {
            path: "code5",
            element: <CariKod5Items />,
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
            path: "depolararasitransferliste",
            element: <DepolarArasiTransferListe />,
          },
          {
            path: "depolararasitransferfisi",
            element: <DepolarArasiTransferFisi />,
          },
          {
            path: "netsisSiparisFaturaOnay",
            element: <NetsisSiparisFaturaOnay />,
          },
        ],
      },
      {
        path: "/talepsiparis",
        children: [
          {
            path: "satinalmatalepliste",
            element: <TalepTeklifListe baseApi={api.talepTeklif} navigatePath="/talepsiparis/satinalmatalepfisi" />,
          },
          {
            path: "satinalmatalepfisi",
            element:<SatinalmaTalepFisi/>,
          },
          {
            path: "satistalepliste",
            element: <TalepTeklifListe baseApi={api.talepTeklif} navigatePath="/talepsiparis/satistalepfisi" />,
          },
          {
            path: "satinalmasiparisfisi",
            element:<SatinalmaSiparisFisi/>,
          },
          {
            path: "satinalmasiparisliste",
            element: <SatinalmaSiparisListe baseApi={api.siparis} navigatePath="/talepsiparis/satinalmasiparisfisi" />,
          },
          {
            path: "siparisacmakapama",
            element: <SiparisAcmaKapama/>,
          },
          {
            path: "ithalatekbilgiler",
            element: < İthalatEkBilgiler/>,
          }
          
        ],
      },
      {
        path: "/uretim",
        children: [
          {
            path: "netsisUretimSonuKaydiListe",
            element: <NetsisUretimSonuKaydiListe baseApi={api.netsisUretimSonuKaydi} navigatePath="/uretim/netsisUretimSonuKaydi" />,
          },
          {
            path: "netsisUretimSonuKaydi",
            element:<NetsisUretimSonuKaydi/>,
          },
          {
            path: "netsisDepoIzin",
            element:<NetsisDepoIzin/>,
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
