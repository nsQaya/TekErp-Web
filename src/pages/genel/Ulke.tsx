import { FormEventHandler, useState } from "react";
import api from "../../utils/api";


interface UlkeFormValues {
    id: number;
    adi: string;
    kodu: string;
  }

const Ulke = () => {
    const [formValues, setFormValues] = useState<UlkeFormValues>({
        id:0,
      adi: "",
      kodu: "",
    });

    const [updateValues, setUpdateValues] = useState<UlkeFormValues>({
        id: 0,
        adi: "",
        kodu: "",
      });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

        var response= await api.genel_ulke.createUlke(formValues);;
        if(!response.status){
            alert("Ulke oluşturulurken bir hata oluştu!");
            return;
        }
        setFormValues({id:0, adi: "", kodu: "" });
        alert("Ulke oluşturuldu!");
    };

    const handleUpdateSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        var response= await api.genel_ulke.updateUlke(updateValues);
        console.log(response);
        if (!response.status) {
            alert("Ulke güncellenirken bir hata oluştu!" + response.data.detail);
            console.error(response.data.detail);
            return;
        }
        setUpdateValues({ id: 0, adi: "", kodu: "" });
        alert("Ulke güncellendi!");
      };

    return (
      <>
        <h1>Ulkeler</h1>
        <h1>Ülke Ekle</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="adi">Adı:</label>
            <input
              type="text"
              id="adi"
              value={formValues.adi}
              onChange={(e) =>
                setFormValues({ ...formValues, adi: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="kodu">Kodu:</label>
            <input
              type="text"
              id="kodu"
              value={formValues.kodu}
              onChange={(e) =>
                setFormValues({ ...formValues, kodu: e.target.value })
              }
            />
          </div>
          <button type="submit">Oluştur</button>
        </form>

        <h1>Ülke Değiştir</h1>

        <form onSubmit={handleUpdateSubmit}>
      <div>
        <label htmlFor="updateId">Değiştirilecek Ülke ID'si:</label>
        <input
          type="number"
          id="updateId"
          value={updateValues.id}
          onChange={(e) => 
            setUpdateValues({ ...updateValues, id: Number(e.target.value) })

          }
        />
      </div>
      <div>
        <label htmlFor="updateAdi">Yeni Adı:</label>
        <input
          type="text"
          id="updateAdi"
          value={updateValues.adi}
          onChange={(e) =>
            setUpdateValues({ ...updateValues, adi: e.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="updateKodu">Yeni Kodu:</label>
        <input
          type="text"
          id="updateKodu"
          value={updateValues.kodu}
          onChange={(e) =>
            setUpdateValues({ ...updateValues, kodu: e.target.value })
          }
        />
      </div>
      <button type="submit">Değiştir</button>
      </form>



        <h1>Ülke Değiştir</h1>

        <h1>Ülke Listesi</h1>



        <h1>Tek ülke</h1>
      </>
    );
  };

export default Ulke;