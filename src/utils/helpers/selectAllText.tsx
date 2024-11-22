import { InputNumber } from "primereact/inputnumber";

// Yardımcı fonksiyon
export const selectAllTextInputNumber = (inputNumberRef: React.MutableRefObject<InputNumber | null>) => {
    if (inputNumberRef?.current) {
      const inputElement = inputNumberRef.current.getInput() as unknown as HTMLInputElement; // Türü açıkça HTMLInputElement olarak belirt
      inputElement.select(); // Tüm metni seç
    }
  };

  export const selectAllTextInputText = (inputTextRef: React.MutableRefObject<HTMLInputElement | null>) => {
    if (inputTextRef?.current) {
      inputTextRef.current.select(); // Tüm metni seç
    }
  };