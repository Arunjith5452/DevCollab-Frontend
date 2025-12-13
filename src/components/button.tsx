"use client"

import React from 'react'

export const Button = ({name}:{name:string}) => {
  return (
    <button onClick={()=>{
        alert(`name is: ${name}`)
    }}>
      See name
    </button>
  )
}

