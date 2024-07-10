import { FormSelectItem } from "../../modals/DynamicModal";
import api from "../../utils/api";


const projeSelect = async (): Promise<FormSelectItem[]> => {
  try {
    const { data: { value: { items } } } = await api.proje.getAll(0, 1000);
    return items.map(x => ({ label: x.kodu, value: String(x.id) }));
  } catch (error) {
    console.error("Proje alırken hata oluştu:", error);
    return [];
  }
};

export default projeSelect;