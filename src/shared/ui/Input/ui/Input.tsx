import { LegacyRef, forwardRef } from "react";
import { InputType } from "../types/InputType";
import cl from './Input.module.scss';

export const Input = forwardRef(function ({...props} : InputType, ref : LegacyRef<HTMLInputElement> | undefined) { 
    const {
        className="",
        placeholder = "",
        value="",
        handlerInput = () => {},
        handlerBlur = () => {},
        handlerFocus = () => {},
        handlerChange = () => {},
        inValid = false,
        type = 'text',
        disabled=false,
        iconLeft=false,
        iconRigth=false,
        maxLength=undefined,
        readonly=false,
        size,
        borderRadius = 'middle',
        deleteArrow=true,
    } = props;
    
    return (
        <div className={cl.inputContainer}>
            <input
            readOnly={readonly}
            value={value}
            onChange={(e:any) => handlerChange(e)}
            onFocus={(e: any) => {
                handlerFocus(e); 
            }}
            onBlur={(e: any) => handlerBlur(e)}
            type={type}
            maxLength={maxLength}
            onInput={(e: any) => handlerInput(e.target.value)}
            placeholder={placeholder}
            className={`${cl.input} ${className} ${inValid ? cl.invalid : ""} ${iconLeft ? cl.iconLeft : ""} ${iconRigth ? cl.iconRigth : ""} ${size ? cl.inputSM : ""} ${cl[borderRadius]} ${deleteArrow ? cl.delArrow : ""}`}
            disabled={disabled}
            ref={ref}
            >
            </input>
            {
                iconLeft && (
                    <div className={`${size ? cl.sm : ''} ${cl.iconLeftContainer}`}>
                        {iconLeft}
                    </div>
                )
                
            }
            {
                iconRigth && (
                    <div className={`${size ? cl.sm : ''}   ${cl.iconRigthContainer}`}>
                        {iconRigth}
                    </div>
                )
            }
        </div>
    )
});