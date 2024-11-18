import { IBelge } from "./IBelge";
import { ISiparis } from "./ISiparis";
import { ISiparisStokHareket } from "./ISiparisStokHareket";

export interface ISiparisSaveData
{
    belge:IBelge,
    siparis:ISiparis,
    siparisStokHarekets:ISiparisStokHareket[]
}