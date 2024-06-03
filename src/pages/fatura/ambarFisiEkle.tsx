import { useMemo } from "react";
import { useSearchParams } from "react-router-dom"

export default ()=>{
    let [searchParams, _] = useSearchParams();
    const projectID= useMemo(()=>String(searchParams.get("proje")),[searchParams])
    const unitID= useMemo(()=>String(searchParams.get("unit")),[searchParams])
    const orijinalID= useMemo(()=>String(searchParams.get("Id")),[searchParams])

    return (<h1>{projectID} - {unitID} - {orijinalID}</h1>)
}