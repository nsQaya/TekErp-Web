import { useMemo } from "react";
import { useSearchParams } from "react-router-dom"

export default ()=>{
    let [searchParams, _] = useSearchParams();

    const recordID= useMemo(()=>String(searchParams.get("Id")),[searchParams])

    return (
        <div>

        
    <h1 hidden>{recordID}</h1>

    </div>

)
}