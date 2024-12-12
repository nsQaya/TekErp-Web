export interface ITalepStokForSiparis
{
    id: number;
    belgeId: number;
    belgeNo: string;
    stokKartiId: number;
    stokKodu: string;
    stokAdi: string;
    miktar: number;
    siparisMiktar: number;
    kalanMiktar: number;
    olcuBirimId: number;
    olcuBirimAdi: string;
    girisCikis: string;
    aciklama1?: string;
    aciklama2?: string;
    aciklama3?: string;
    sira: number;
    seriKodu?: string;
    teslimTarihi: Date;
    projeId: number;
    projeKodu: string;
    uniteId: number;
    uniteKodu: string;
}