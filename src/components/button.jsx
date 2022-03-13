import { CircularProgress } from '@material-ui/core';
import React from 'react'
import "./button.css";

export default function OnmenuButton({children,loading,className,...rop}) {
    return (
        <button className={`default-button onmenu-button ${className}`} {...rop} >
            {loading?<CircularProgress size={18} style={{color:'white'}} />:children}
        </button>
    )
}
