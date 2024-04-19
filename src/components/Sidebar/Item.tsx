import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';

interface NavbarItem{
    title: string;
    href: string;
}
interface NavbarItemProps{
    icon?: string;
    name: string;
    href?: string;
    count?: number;
    items?: NavbarItem[]
}

export default (props: NavbarItemProps) => {
    const [isShowing, setShowing]= useState(false);
    return (
        <li className={isShowing ? 'active' : ''}>
            {
                props.items && (
                    <a className={"has-arrow waves-effect waves-dark" + (isShowing && ' active')} onClick={()=>setShowing(!isShowing)}>
                        {props.icon && <i className={props.icon}></i>}
                        <span className="hide-menu">{props.name}
                            {props.count && <span className="badge rounded-pill bg-cyan ms-auto">{props.count}</span>}
                        </span>
                    </a>
                )
            }

            {
                (!props.items && props.href) && (
                    <Link className={"has-arrow waves-effect waves-dark"} to={props.href}>
                        {props.icon && <i className={props.icon}></i>}
                        <span className="hide-menu">{props.name}</span>
                    </Link>
                )
            }
            
            { props.items && <Collapse in={isShowing}>
                <ul aria-expanded="false">
                    {
                        props.items?.map((x,i)=>
                            <li key={i}>
                                <Link to={x.href}>{x.title}</Link>
                            </li>
                        )
                    }
                </ul>
            </Collapse> }
        </li>
    )
}