import React, { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatLabel } from "primereact/floatlabel";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { Dropdown } from "primereact/dropdown";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { transformFilter } from "../../utils/transformFilter";
import api from "../../utils/api";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";

// Form verileri için bir tip tanımı
type FormData = {
  seri?: string;
  numara?: string;
  tarih?: Date | null;
  hareketTuruId?: number;
  hareketTuru?: string;
  cikisYeriId?: number;
  cikisYeri?: string;
  cikisKodId?: number;
  cikisKod?: string;
  aciklama1?: string;
  aciklama2?: string;
  aciklama3?: string;
  projeKoduId?: number;
  projeKodu?: string;
  uniteKoduId?: number;
  uniteKodu?: string;
  ozelKod1Id?: number;
  ozelKod1?: string;
  eIrsaliye?: boolean;
  stokKoduId?: number;
  stokKodu?: string;
  stokAdi?:string;
  miktar?: number;
  istenilenMiktar?:number;
  fiyat?: number;
  hucreKoduId?: number;
  hucreKodu?: string;
};

// Grid verileri için bir tip tanımı
type GridData = FormData & { id: number };

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    seri: "",
    numara: "",
    tarih: null,
    hareketTuruId: 0,
    hareketTuru: "",
    cikisYeriId: 0,
    cikisYeri: "",
    cikisKodId: 0,
    cikisKod: "",
    aciklama1: "",
    aciklama2: "",
    aciklama3: "",
    projeKoduId: 0,
    projeKodu: "",
    uniteKoduId: 0,
    uniteKodu: "",
    ozelKod1Id: 0,
    ozelKod1: "",
    eIrsaliye: false,
    stokKoduId: 0,
    stokKodu: "",
    stokAdi:"",
    istenilenMiktar:0,
    miktar: 0,
    fiyat: 0,
    hucreKoduId: 0,
    hucreKodu: "",
  });


  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    cikisYeri: false,
  });

  const [gridData, setGridData] = useState<GridData[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    if (formData.stokKodu) {
        handleKeyPress({ key: 'Enter', preventDefault: () => {}, type: 'manual' } as React.KeyboardEvent<HTMLInputElement>);
    }
}, [formData.stokKodu]);

  const handleKeyPress = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.type === 'manual') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          stokAdi: "",
        }));
        e.preventDefault();
        const { stokKodu } = formData;

        if (stokKodu == undefined || stokKodu=="") {
          const stokKoduInput = e.target as HTMLInputElement;
          stokKoduInput.select();
          stokKoduInput.focus();
          return;
        }

        try {
          const response = await api.stok.getByKod(stokKodu);
          if (response.data && response.data.value.adi && response.data.value.kodu==stokKodu) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              stokAdi: response.data.value.adi,
            }));
            
          } else {
            const stokKoduInput = e.target as HTMLInputElement;
            stokKoduInput.select();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          const stokKoduInput = e.target as HTMLInputElement;
          stokKoduInput.select();
          stokKoduInput.focus();
        }
      }
    },
    [formData]
  );

  const handleDialogSelect = useCallback(
    (fieldName: string, selectedValue: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: selectedValue,
        }));
    },
    []
);

  const handleGetir = async () => {
    const sortColumn = "Id"; 
    const sortDirection = 1; 

    const filters = {
      projeKodu: { value: formData.projeKodu, matchMode: "equals" },
      plasiyerKodu: { value: formData.uniteKodu, matchMode: "equals" },
      miktar: { value: '0', matchMode: "gt" },
    };

    console.log(filters);

    const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

    try {
      const response = await api.ihtiyacPlanlamaRapor.getAllForGrid(
        0,
        9999,
        dynamicQuery
      );
      console.log(response.data);

      const data = response.data.value;
      const maxId = gridData.length > 0 ? Math.max(...gridData.map(item => item.id)) : 0;
      const newGridData: GridData[]  = data.items.map((item,index) => ({
        id: maxId  + index+ 1,
        projeKodu: item.projeKodu,
        uniteKodu: item.plasiyerKodu,
        numara: item.belgeNo,
        stokKodu: item.stokKodu,
        stokAdi:item.stokAdi,
        miktar:0,
        istenilenMiktar: item.miktar,
      }));

      setGridData(newGridData);

    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToGrid = useCallback(async() => {
    var nStoK = formData.stokKodu;

    if (!nStoK || formData.miktar === 0) {
      alert("Stok Kodu ve Miktar alanlarını doldurmalısınız.");
      return;
    }
    
    alert(formData.miktar);

    var alreadyHas= gridData.find(x=>x.stokKodu==nStoK);
    alert((Number(alreadyHas?.istenilenMiktar) + Number(alreadyHas?.miktar)));
    if(alreadyHas && (Number(formData.miktar) > (Number(alreadyHas.istenilenMiktar) + Number(alreadyHas.miktar) ))){
      return alert("Var olan miktardan fazla çıkış ekleyemezsin.");
    }
    const maxId = gridData.length > 0 ? Math.max(...gridData.map(item => item.id)) : 0;

    const newGridData: GridData= ({
      id: maxId  +  1,
      projeKodu: formData.projeKodu,
      uniteKodu: formData.uniteKodu,
      numara: formData.numara,
      stokKodu: formData.stokKodu,
      stokAdi:formData.stokAdi,
      miktar:formData.miktar,
      istenilenMiktar: 0,
    });

    setGridData((prevGridData) => [...prevGridData, newGridData]);


    // var {data} =  await api.stokHareket.create({
    //   kod: formData.stokKodu,
    //   miktar: formData.miktar,
    // });

    // var newAdded= data.value as GridData;
    // setGridData((prevGridData) => [...prevGridData, newAdded]);
    //setGridData([...gridData, newAdded ]);

    setFormData({
      seri: "",
      numara: "",
      tarih: null,
      hareketTuruId: 0,
      hareketTuru: "",
      cikisYeriId: 0,
      cikisYeri: "",
      cikisKodId: 0,
      cikisKod: "",
      aciklama1: "",
      aciklama2: "",
      aciklama3: "",
      ozelKod1Id: 0,
      ozelKod1: "",
      eIrsaliye: false,
      stokKoduId: 0,
      stokKodu: "",
      stokAdi:"",
      miktar: 0,
      istenilenMiktar:0,
      fiyat: 0,
      hucreKoduId: 0,
      hucreKodu: "",
    });
  },[formData]);


  const deleteItem = useCallback(async (item: IAmbarFisi) => {
    if (!window.confirm("Emin misin ?")) return;
    try {
      await api.il.delete(item.id as number);
      setGridData((prevGridData) => prevGridData.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, []);

  const [selectedItem, setSelectedItem] = useState<IAmbarFisi>();

  return (
<div className="container-fluid">

    <div className="p-fluid p-formgrid p-grid">
    <Accordion activeIndex={0}>
      <AccordionTab header="İhtiyaç Sorgulama">
      <div className="row">
        <div className="col-md-3 col-sm-6 mt-4">
          <FloatLabel>
            <label htmlFor="projeKodu">Proje Kodu</label>
            <div className="p-inputgroup">
              <InputText
                id="projeKodu"
                name="projeKodu"
                value={formData.projeKodu}
                readOnly
              />
              <Button
                label="..."
                onClick={() =>
                  setDialogVisible({ ...dialogVisible, proje: true })
                }
              />
              <ProjeRehberDialog
                isVisible={dialogVisible.proje}
                onHide={() =>
                  setDialogVisible({ ...dialogVisible, proje: false })
                }
                onSelect={(selectedValue) =>
                  handleDialogSelect("projeKodu", selectedValue)
                }
              />
            </div>
            <InputText
              id="projeKoduId"
              name="projeKoduId"
              value={formData.projeKoduId?.toString()}
              type="hidden"
            />
          </FloatLabel>
        </div>
        <div className="col-md-3 col-sm-6 mt-4">
          <FloatLabel>
            <label htmlFor="uniteKodu">Ünite Kodu</label>
            <div className="p-inputgroup">
              <InputText
                id="uniteKodu"
                name="uniteKodu"
                value={formData.uniteKodu}
                readOnly
              />
              <Button
                label="..."
                onClick={() =>
                  setDialogVisible({ ...dialogVisible, unite: true })
                }
              />
              <UniteRehberDialog
                isVisible={dialogVisible.unite}
                onHide={() =>
                  setDialogVisible({ ...dialogVisible, unite: false })
                }
                onSelect={(selectedValue) =>
                  handleDialogSelect("uniteKodu", selectedValue)
                }
              />
            </div>
            <InputText
              id="uniteKoduId"
              name="uniteKoduId"
              value={formData.uniteKoduId?.toString()}
              type="hidden"
            />
          </FloatLabel>
        </div>
        <div className="col-md-3 col-sm-6 mt-4">
          <div className="p-inputgroup">
            <Button label="Getir" onClick={handleGetir} />
          </div>
        </div>
      </div>
      </AccordionTab>
      </Accordion>
      {/* <Divider /> */}

      <Accordion activeIndex={1}>
        <AccordionTab header="Üst Bilgiler">
          <div className="row">
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <Dropdown
                    showClear
                    placeholder="Seri"
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="seri">Seri</label>
                </FloatLabel>

                <FloatLabel>
                  <InputText
                    id="numara"
                    name="numara"
                    value={formData.numara}
                    onChange={handleInputChange}
                    style={{ width: "100%", minWidth: "250px" }}
                  />
                  <label htmlFor="numara">Numara</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <Dropdown
                    showClear
                    placeholder="Hareket Türü2"
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="hareketTuru">Hareket Türü</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <Dropdown
                    showClear
                    placeholder="Çıkış Yer"
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="cikisYeri">Çıkış Yeri</label>
                </FloatLabel>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mt-4">
              <FloatLabel>
                <label htmlFor="cikisYeri">Çıkış Yeri</label>
                <div className="p-inputgroup">
                  <InputText
                    id="cikisYeri"
                    name="cikisYeri"
                    value={formData.cikisYeri}
                    readOnly
                  />
                  <Button
                    label="..."
                    onClick={() =>
                      setDialogVisible({ ...dialogVisible, cikisYeri: true })
                    }
                  />
                  <StokRehberDialog
                    isVisible={dialogVisible.cikisYeri}
                    onHide={() =>
                      setDialogVisible({ ...dialogVisible, cikisYeri: false })
                    }
                    onSelect={(selectedValue) =>
                      handleDialogSelect("cikisYeri", selectedValue)
                    }
                  />
                </div>
                <InputText
                  id="cikisYeriId"
                  name="cikisYeriId"
                  value={formData.cikisYeriId?.toString()}
                  type="hidden"
                />
              </FloatLabel>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <InputText
                    id="aciklama1"
                    name="aciklama1"
                    value={formData.aciklama1}
                    onChange={handleInputChange}
                    style={{ width: "100%", minWidth: "250px" }}
                  />
                  <label htmlFor="aciklama1">Açıklama 1</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <InputText
                    id="aciklama2"
                    name="aciklama2"
                    value={formData.aciklama2}
                    onChange={handleInputChange}
                    style={{ width: "100%", minWidth: "250px" }}
                  />
                  <label htmlFor="aciklama2">Açıklama 2</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <InputText
                    id="aciklama3"
                    name="aciklama3"
                    value={formData.aciklama3}
                    onChange={handleInputChange}
                    style={{ width: "100%", minWidth: "250px" }}
                  />
                  <label htmlFor="aciklama3">Açıklama 3</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <Dropdown
                    showClear
                    placeholder="Özel Kod 1"
                    value={formData.ozelKod1}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="ozelKod1">Özel Kod 1</label>
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-1 col-sm-6 mt-4">
              <div className="p-inputgroup flex">
                <Checkbox
                  inputId="eIrsaliye"
                  name="eIrsaliye"
                  value="eIrsaliye"
                  checked={formData.eIrsaliye||false}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  eİrsaliye
                </label>
              </div>
            </div>
          </div>
          <Divider />
        </AccordionTab>
      </Accordion>
      <div className="row">
        <div className="col-md-3 col-sm-6 mt-4">
          <FloatLabel>
            <label htmlFor="stokKodu">Stok Kodu</label>
            <div className="p-inputgroup">
              <InputText
                id="stokKodu"
                name="stokKodu"
                 value={formData.stokKodu}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <Button
                label="..."
                onClick={() =>
                  setDialogVisible({ ...dialogVisible, stok: true })
                }
              />
              <StokRehberDialog
                isVisible={dialogVisible.stok}
                onHide={() =>
                  setDialogVisible({ ...dialogVisible, stok: false })
                }
                onSelect={(selectedValue) =>
                  handleDialogSelect("stokKodu", selectedValue)
                }
              />
            </div>
            <InputText
              id="stokKoduId"
              name="stokKoduId"
              value={formData.stokKoduId?.toString()}
              type="hidden"
            />
          </FloatLabel>
        </div>
        <div className="col-md-6 col-sm-6 mt-4">
          <FloatLabel>
          <label htmlFor="stokAdi">Stok Adı</label>
              <InputText
                id="stokAdi"
                name="stokAdi"
                value={formData.stokAdi}
                disabled
              />
            </FloatLabel>
        </div>
        <div className="col-md-2 col-sm-6 mt-4">
          <FloatLabel>
            <label htmlFor="miktar">Miktar</label>
            <InputNumber
              id="miktar"
              name="miktar"
              value={formData.miktar}
              min={0}
              onChange={(e)=>{
                setFormData({ ...formData, miktar: Number(e.value) });
              }}
            />
          </FloatLabel>
        </div>
        <div className="col-md-1 col-sm-6 mt-4">
          <FloatLabel>
            <label htmlFor="hucre">Hucre</label>
            <InputText
              id="hucre"
              name="hucre"
              value={formData.hucreKodu}
              onChange={handleInputChange}
            />
          </FloatLabel>
        </div>
      </div>
      <div className="p-col-12  mt-3">
        <Button label="Ekle" icon="pi pi-plus" onClick={handleAddToGrid} />
      </div>
      <div className="p-col-12">
        <DataTable
          value={gridData}
          //paginator
          rows={100}
          dataKey="id"
          scrollable 
          scrollHeight="400px"
          //rowsPerPageOptions={[5, 10, 25, 50,100,500,1000]}
          emptyMessage="Kayıt yok."
        >
          <Column field="id" header="#" />
          <Column field="stokKodu" header="Stok Kodu" />
          <Column field="stokAdi" header="Stok Adı" />
          <Column field="miktar" header="Miktar" />
          <Column field="istenilenMiktar" header="İstenilen Miktar" />
          <Column field="refKodu" header="Raf Kodu" />
          <Column field="depoBakiye" header="Depo Bakiye" />
          <Column
              body={(rowData) => (
                <>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-mr-2"
                    onClick={() => setSelectedItem(rowData)}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteItem(rowData)}
                  />
                </>
              )}
              header="İşlemler"
            />
        </DataTable>
      </div>
    </div>
    </div>
  );
};

export default App;
