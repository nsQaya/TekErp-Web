import AppHeader from "../components/AppHeader"
import AppSidebar from "../components/AppSidebar"

export default ({children} : any) => {
    return (
        <div id="main-wrapper">
            <AppHeader/>
            <AppSidebar/>
            
            <div className="page-wrapper">
                {children}
            </div>
        </div>
    )
}