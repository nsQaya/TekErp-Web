import { FormSelectItem } from "../../modals/DynamicModal";
import api from "../../utils/api";


const uniteSelect = async (): Promise<FormSelectItem[]> => {
  try {
    const { data: { value: { items } } } = await api.unite.getAll(0, 1000);
    return items.map(x => ({ label: x.kodu, value: String(x.id) }));
  } catch (error) {
    console.error("Üniteler alırken hata oluştu:", error);
    return [];
  }
};

export default uniteSelect;