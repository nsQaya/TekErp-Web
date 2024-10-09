
import { RouterProvider } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import { locale, addLocale,} from 'primereact/api';
import tr from "./utils/languages/tr";
import "./assets/css/style.css";
import { useCallback, useEffect, useState } from "react";
import 'primeicons/primeicons.css'; // PrimeIcons css dosyasını dahil et
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact tema
import 'primereact/resources/primereact.min.css'; // PrimeReact CSS
import 'primeflex/primeflex.css'; // PrimeFlex için (isteğe bağlı)

import mainRouter from "./routes/mainRouter";
import authRouter from "./routes/authRouter";

function App() {
  const [bodyClasses, setBodyClasses] = useState(
    new Set(["horizontal-nav", "skin-megna", "fixed-layout"])
  );

  const updateBodyClasses = useCallback((classes: Set<string> | undefined) => {
    document.body.className = ""; // Clear all classes first
    classes?.forEach((className) => document.body.classList.add(className));
  }, []);

  const onChangeSize = useCallback(() => {
    const width = window.innerWidth || screen.width;
    setBodyClasses((prevClasses) => {
      const newClasses = new Set(prevClasses);
      if (width < 1170) {
      newClasses.add("mini-sidebar");
      document.querySelector(".sidebartoggler i")?.classList.add("ti-menu");
      } else {
        newClasses.delete("mini-sidebar");
        document
          .querySelector(".sidebartoggler i")
          ?.classList.remove("ti-menu");
      }

      const topOffset = 190;
      let height = (window.innerHeight || screen.height) - 1 - topOffset;
      height = Math.max(height, 1); // Ensure height is at least 1

      const pageWrapper = document.querySelector(
        ".page-wrapper"
      ) as HTMLElement;
      if (pageWrapper) {
        pageWrapper.style.minHeight = `${height}px`;
      }

      return newClasses;
    });
  }, []);

  const onToggleSidebar = useCallback(() => {
    setBodyClasses((prevClasses) => {
      const newClasses = new Set(prevClasses);
      if (newClasses.has("show-sidebar")) {
        newClasses.delete("show-sidebar");
      } else {
        newClasses.add("show-sidebar");
      }
      return newClasses;
    });
  }, []);

  const handleScroll = useCallback(() => {
    setBodyClasses((prevClasses) => {
      const newClasses = new Set(prevClasses);
      if (scrollY < 80) {
        newClasses.delete("fixed-sidebar");
      } else {
        newClasses.add("fixed-sidebar");
      }
      return newClasses;
    });
  }, []);

  useEffect(() => {
    onChangeSize();
    window.addEventListener("resize", onChangeSize);
    window.addEventListener("toggleSidebar", onToggleSidebar);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener("resize", onChangeSize);
      window.removeEventListener("toggleSidebar", onToggleSidebar);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    updateBodyClasses(bodyClasses);
  }, [bodyClasses]);

  const userStore = useUserStore();

  addLocale('tr', tr);
  locale('tr');
  // Türkçe yerelleştirme ekle
addLocale("tr", {
  firstDayOfWeek: 1,
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
  today: "Bugün",
  clear: "Temizle",
  dateFormat: "dd/mm/yy",
  weekHeader: "Hf",
});

// Calendar bileşenlerini Türkçe yapmak için varsayılan locale ayarını ayarla
locale("tr");
  return (
    <RouterProvider router={userStore.isLogged() ? mainRouter : authRouter} />
  );
}

export default App;
