interface AppBreadCrumbProps{
    title: string;
}

export default (props: AppBreadCrumbProps) => {
    return (
        <div className="row page-titles">
            <div className="col-md-5 align-self-center">
                <h4 className="text-themecolor">{props.title}</h4>
            </div>
        </div>
    )
}