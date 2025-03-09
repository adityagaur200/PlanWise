import React from 'react'
import { Tldraw } from "@tldraw/tldraw";

import 'tldraw/tldraw.css'
const WhiteBoard = () => {
  return (
    <div style={{position: 'fixed' ,inset:0}}>
      <Tldraw/>
    </div>
  )
}

export default WhiteBoard
