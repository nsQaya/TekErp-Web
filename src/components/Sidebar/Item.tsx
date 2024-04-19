import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

interface NavbarItem{
    title: string;
    href: string;
}
interface NavbarItemProps{
    icon: string;
    name: string;
    count?: number;
    items: NavbarItem[]
}

export default (props: NavbarItemProps) => {
    const [isShowing, setShowing]= useState(false);
    return (
        <li className={isShowing ? 'active' : ''}>
            <a className={"has-arrow waves-effect waves-dark" + (isShowing && ' active')} onClick={()=>setShowing(!isShowing)}>
                <i className={props.icon}></i>
                <span className="hide-menu">{props.name}
                    {props.count && <span className="badge rounded-pill bg-cyan ms-auto">{props.count}</span>}
                </span>
            </a>
            <Collapse in={isShowing}>
                <ul aria-expanded="false">
                    {
                        props.items?.map((x,i)=>
                            <li key={i}><a href={x.href}>{x.title}</a></li>
                        )
                    }
                </ul>
            </Collapse>
        </li>
    )
}