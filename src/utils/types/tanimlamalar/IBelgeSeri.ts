import { EBelgeTip } from "../enums/EBelgeTip";


export interface IBelgeSeri {
  id?: number;
  belgeTip: EBelgeTip;
  seri:string;
  no?:number;
  belgeNo?:string;
  gibBelgeNo?:string;
}
