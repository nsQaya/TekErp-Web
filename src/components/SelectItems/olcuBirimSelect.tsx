import { FormSelectItem } from "../../modals/DynamicModal";
import api from "../../utils/api";


const olcuBirimSelect = async (): Promise<FormSelectItem[]> => {
  try {
    const { data: { value: { items } } } = await api.stokOlcuBirim.getAll(0, 1000);
    return items.map(x => ({ label: x.simge, value: String(x.id) }));
  } catch (error) {
    console.error("Ölçü Birimleri alırken hata oluştu:", error);
    return [];
  }
};

export default olcuBirimSelect;