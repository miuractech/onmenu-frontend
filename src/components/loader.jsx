import { CircularProgress } from '@material-ui/core'
import React from 'react'

export default function Loader() {
    return (
        <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'}} >
          <CircularProgress />
        </div>
    )
}
