import React, { useEffect, useRef, useState } from "react";
import { PickList } from "primereact/picklist";
import { IKullanici } from "../../utils/types/kullanici/IKullanici";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import api from "../../utils/api";
import { IKullaniciYetki } from "../../utils/types/kullanici/IKullaniciYetki";
import { Button } from "primereact/button";
import { IYetki } from "../../utils/types/kullanici/IYetki";
import { Toast } from "primereact/toast";

const KullaniciYetki: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<IKullanici | null>(null);
  const [users, setUsers] = useState<IKullanici[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<IYetki[]>([]);
  const [userPermissions, setUserPermissions] = useState<IKullaniciYetki[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const toast = useRef<Toast>(null);

  // API'den kullanıcıları çekme
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.kullanici.getAll(0, 9999);
        setUsers(response.data.value.items);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Kullanıcılar yüklenirken bir hata oluştu",
        });
      }
    };

    fetchUsers();
  }, []);

  // Kullanıcı değiştiğinde yetkileri yeniden çekme işlemi
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!selectedUser) {
        setUserPermissions([]);
        return;
      }

      try {
        // Kullanıcının mevcut yetkilerini çekme
        const response = await api.kullaniciYetki.getListByUserId(selectedUser.id!);
        const userPermissionsData = response.data.value.items || [];
        setUserPermissions(userPermissionsData);

        // Tüm yetki listesini tekrar çek ve kullanıcının mevcut yetkilerini düş
        const permissionResponse = await api.yetki.getAll(0, 9999);
        const allPermissions = permissionResponse.data.value.items || [];

        const remainingPermissions = allPermissions.filter(
          (permission) =>
            !userPermissionsData.some(
              (up) => up.operationClaimId === permission.id
            )
        );

        setAvailablePermissions(remainingPermissions);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Yetkiler yüklenirken bir hata oluştu",
        });
      }
    };

    // Her kullanıcı değiştiğinde yetkileri yeniden yükle
    fetchUserPermissions();
  }, [selectedUser]);

  const handleUserChange = (e: DropdownChangeEvent) => {
    const selectedUser = e.value as IKullanici;
    setSelectedUser(selectedUser);
  };

  const itemTemplate = (item: IYetki | undefined) => {
    return <span>{item?.name || "Yetki Adı Mevcut Değil"}</span>;
  };

  const handlePermissionsChange = (event: { source: IYetki[]; target: IYetki[] }) => {
    setAvailablePermissions(event.source);

    // Eklenecek yeni yetkiler ve mevcut userPermissions arasında karşılaştırma yap
    const updatedUserPermissions: IKullaniciYetki[] = event.target.map(
      (yetki) => {
        const existingPermission = userPermissions.find(
          (up) => up.operationClaim.id === yetki.id
        );
        if (existingPermission) {
          // Eğer yetki zaten varsa, onu koruyun
          return existingPermission;
        } else {
          // Yeni yetkileri ekleyin
          return {
            userId: selectedUser?.id!,
            operationClaimId: yetki.id,
            operationClaim: yetki,
          };
        }
      }
    );

    setUserPermissions(updatedUserPermissions);
  };

  const handleSave = async () => {
    if (!selectedUser) {
      toast.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen önce bir kullanıcı seçin.",
      });
      return;
    }

    setLoadingSave(true);
    try {
      await api.kullaniciYetki.deleteByString(selectedUser.id!);
      const kullaniciYetkiler: IKullaniciYetki[] = userPermissions.map(
        (permission) => ({
          userId: selectedUser.id!,
          operationClaimId: permission.operationClaim.id,
          operationClaim: permission.operationClaim,
        })
      );

      for (const yetki of kullaniciYetkiler) {
        await api.kullaniciYetki.create(yetki);
      }

      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Yetkiler başarıyla kaydedildi!",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Yetkiler kaydedilirken bir hata oluştu.",
      });
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <Dropdown
                  value={selectedUser}
                  options={users}
                  onChange={handleUserChange}
                  optionLabel="firstName"
                  placeholder="Kullanıcı Seçin"
                />
                {selectedUser && (
                  <div style={{ marginTop: "20px" }}>
                    <h3>
                      {selectedUser.firstName} {selectedUser.lastName} Yetkileri
                    </h3>
                    <PickList
                      filter
                      filterBy="name"
                      source={availablePermissions}
                      target={userPermissions.map((up) => up.operationClaim)}
                      itemTemplate={itemTemplate}
                      showSourceControls={false}
                      showTargetControls={false}
                      sourceHeader="Mevcut Yetkiler"
                      targetHeader="Kullanıcı Yetkileri"
                      sourceStyle={{ height: "400px" }}
                      targetStyle={{ height: "400px" }}
                      onChange={handlePermissionsChange}
                      dataKey="id"
                      sourceFilterPlaceholder="İsme göre arama"
                      targetFilterPlaceholder="İsme göre arama"
                    />
                    <Button
                      label="Kaydet"
                      icon="pi pi-save"
                      onClick={handleSave}
                      style={{ marginTop: "20px" }}
                      loading={loadingSave}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KullaniciYetki;
