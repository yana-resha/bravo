import cl from '../ui/button.module.scss';
import { ButtonPropsType } from '../types/buttonProps';
import React, { LegacyRef, forwardRef, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';



const btnTheme = {
  primary: cl.btnPrimary,
  'bright-pink': cl.btnBrightPink,
  success: cl.btnSuccess,
  'undefined': cl.btnPrimary,
  'outline-dark': cl.btnOutlineDark,
  clear: cl.btnClear,
  'outline-light': cl.btnOutlineLight,
  'light': cl.btnLight,
  'light-blue': cl.btnLigthBlue,
  'dark-blue': cl.btnDarkBlue,
  'danger': cl.btnDanger
}

const btnSize = {
  sm: cl.btnSm,
  lg: cl.btnLg,
}

const btnBorderRadius = {
  'default': cl.defaultRadius,
  'pill': cl.pillRadius,
  'circle': cl.circleRadius,
}

const voidFunc = () => {}


export const Button = forwardRef(function ({...props} : ButtonPropsType, ref : LegacyRef<HTMLButtonElement> | undefined) {
  const {children, active=false,color, onlyIcon, disabled, 
    title = '' ,
    size, className = '', 
    onClick = voidFunc, type = 'button',
    borderRadius = 'default',
  } = props;
  
  return (

      <button
      type={type}
      className={`${cl.btn} 
      ${color ? btnTheme[color] : ''} 
      ${size ? btnSize[size] : ''} ${active ? cl.active : ''} 
      ${btnBorderRadius[borderRadius]}
      ${onlyIcon ? cl.iconBtn : ''}
      ${className}
      `}
        onClick={onClick}
        title={title}
        disabled={disabled ? true : false}
        ref={ref}
      >
        {children}
        
      </button>
    

  )
})




