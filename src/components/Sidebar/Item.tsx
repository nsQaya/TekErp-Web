import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

export default () => {
    const [isShowing, setShowing]= useState(false);
    return (
        <li className={isShowing ? 'active' : ''}>
            <a className={"has-arrow waves-effect waves-dark" + (isShowing && ' active')} onClick={()=>setShowing(!isShowing)}>
                <i className="icon-speedometer"></i>
                <span className="hide-menu">Dashboard
                    <span className="badge rounded-pill bg-cyan ms-auto">4</span>
                </span>
            </a>
            <Collapse in={isShowing}>
                <ul aria-expanded="false">
                    <li><a href="index.html">Minimal </a></li>
                    <li><a href="index2.html">Analytical</a></li>
                    <li><a href="index3.html">Demographical</a></li>
                    <li><a href="index4.html">Modern</a></li>
                </ul>
            </Collapse>
        </li>
    )
}