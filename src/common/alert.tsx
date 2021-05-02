import React, { useState, useEffect } from 'react'
import { Alert } from 'reactstrap';

export const AlertInfo = ({ message, color = 'primary', show, setAlert, children }:
  { message: string, color?: string, show: boolean, setAlert?: (flag: boolean) => any, children?: any }) => {
  useEffect(() => {

    setTimeout(() => {
      setAlert && setAlert(false)
    }, 3000)
  }, [show])

  if (show) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
        <Alert color={color} style={{ width: 800 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {message}
            {children}
          </div>
        </Alert >
      </div>
    )
  } else return null
}
