import { FormSelectItem } from "../../modals/DynamicModal";
import api from "../../utils/api";


const stokKartiSelect = async (): Promise<FormSelectItem[]> => {
  try {
    const { data: { value: { items } } } = await api.stok.getAll(0, 1000);
    return items.map(x => ({ label: x.adi, value: String(x.id) }));
  } catch (error) {
    console.error("Stok Kartı alırken hata oluştu:", error);
    return [];
  }
};

export default stokKartiSelect;