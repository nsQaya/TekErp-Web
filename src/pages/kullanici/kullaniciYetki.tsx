import React, { useEffect, useState } from "react";
import { PickList } from "primereact/picklist";
import { IKullanici } from "../../utils/types/kullanici/IKullanici";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import api from "../../utils/api";
import { IKullaniciYetki } from "../../utils/types/kullanici/IKullaniciYetki";
import { Button } from "primereact/button";
import { IYetki } from "../../utils/types/kullanici/IYetki";

const KullaniciYetki: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<IKullanici | null>(null);
  const [users, setUsers] = useState<IKullanici[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<IYetki[]>(
    []
  );
  const [userPermissions, setUserPermissions] = useState<IKullaniciYetki[]>([]);

  // API'den kullanıcıları çekme
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.kullanici.getAll(0, 9999);
        setUsers(response.data.value.items);
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata oluştu", error);
      }
    };

    fetchUsers();
  }, []);

  // API'den yetkilerin tamamını çekiyorum. sol taraftaki kısım
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.yetki.getAll(0, 9999);
        setAvailablePermissions(response.data.value.items);
      } catch (error) {
        console.error("Yetkiler yüklenirken hata oluştu", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleUserChange = async (e: DropdownChangeEvent) => {
    const selectedUser = e.value as IKullanici;
    setSelectedUser(selectedUser);

    if (selectedUser && selectedUser.id) {
      try {
        const response = await api.kullaniciYetki.getListByUserId(
          selectedUser.id!
        );
        const userPermissionsData = response.data.value.items || [];
        setUserPermissions(userPermissionsData);

        // Mevcut yetkileri availablePermissions listesinden çıkar
        const remainingPermissions = availablePermissions.filter(
          (permission) =>
            !userPermissionsData.some(
              (up) => up.operationClaimId === permission.id
            )
        );
        setAvailablePermissions(remainingPermissions);
      } catch (error) {
        console.error("Kullanıcının yetkileri yüklenirken hata oluştu", error);
      }
    } else {
      setUserPermissions([]);
    }
  };

  const itemTemplate = (item: IYetki | undefined) => {
    return <span>{item?.name || "Yetki Adı Mevcut Değil"}</span>;
  };

  const handlePermissionsChange = (event: {
    source: IYetki[];
    target: IYetki[];
  }) => {
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
    if (selectedUser) {

      await api.kullaniciYetki.deleteByString(selectedUser.id!);


      const kullaniciYetkiler: IKullaniciYetki[] = userPermissions.map(
        (permission) => ({
          userId: selectedUser.id!,
          operationClaimId: permission.operationClaim.id,
          operationClaim: permission.operationClaim,
        })
      );

      try {
        for (const yetki of kullaniciYetkiler) {
          await api.kullaniciYetki.create(yetki);
        }
        alert("Yetkiler başarıyla kaydedildi!");
      } catch (error) {
        console.error("Yetkiler kaydedilirken hata oluştu", error);
        alert("Yetkiler kaydedilirken bir hata oluştu.");
      }
    } else {
      alert("Lütfen önce bir kullanıcı seçin.");
    }
  };
  return (
    <div className="container-fluid">
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
