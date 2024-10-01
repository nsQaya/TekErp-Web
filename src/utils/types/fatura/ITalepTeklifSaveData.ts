import { IBelge } from "./IBelge";
import { ITalepTeklif } from "./ITalepTeklif";
import { ITalepTeklifStokHareket } from "./ITalepTeklifStokHareket";
export interface ITalepTeklifSaveData
{
    belge:IBelge,
    talepTeklif:ITalepTeklif,
    talepTeklifStokHarekets:ITalepTeklifStokHareket[]
}