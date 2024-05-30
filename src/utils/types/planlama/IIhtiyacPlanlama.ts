export interface IIhtiyacPlanlama {
    id: number;
    projeId: number;
    projeKodu?:string;
    uniteId: number;
    uniteKodu?:string;
    mamulAdi?: string;
    stokKartiId: number;
    stokKartiKodu?:string;
    stokKartiAdi?:string;
    miktar: number;
    stokOlcuBirimId: number;
    stokOlcuBirimString: string;
    tarih: Date;
    durum: string;
}
