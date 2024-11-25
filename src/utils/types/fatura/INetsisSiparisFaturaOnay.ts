export interface INetsisSiparisFaturaOnay
{
    id:number;
    netsisIncKeyNo: number;
    siparisTarih: string; 
    siparisBelgeNo: string;
    siparisCariKodu: string;
    siparisCariIsim: string;
    stokKodu: string;
    stokAdi: string;
    siparisMiktari: number;
    siparisOlcuBirim: string;
    siparisNetFiyat: number;
    siparisBrutFiyat: number;
    siparisIskonto: number;
    siparisKur?: number | null; 
    siparisDovizTip: string;
    faturaTarih: string;
    faturaFisno: string;
    faturaMiktar: number;
    faturaOlcuBirim: string;
    faturaNetFiyat: number;
    faturaBrutFiyat: number;
    faturaKur?: number | null; 
    faturaDovizTip?: string | null; 
    faturaNetFiyatTL: number;
    faturaBrutFiyatTL: number;
    faturaDovizTipTL: string;
    faturaTutar: number;
    kayitYapanKullanici?: string | null; 
    oran: number;
    onay?: number | null; 
    aciklama?: string | null; 
    createdUserId?: string | null; 
    updatedUserId?: string | null; 
    deletedUserId?: string | null; 
    durum:string;

    

}