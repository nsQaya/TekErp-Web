import { Outlet, Route, Router } from "react-router-dom"
import AppHeader from "../components/AppHeader"
import AppSidebar from "../components/AppSidebar"

export default () => {
    return (
        <div id="main-wrapper">
            <AppHeader/>
            <AppSidebar/>
            
            <div className="page-wrapper">
                <Outlet/>
            </div>
        </div>
    )
}