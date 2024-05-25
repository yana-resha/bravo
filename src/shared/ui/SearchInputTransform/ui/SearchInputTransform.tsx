import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../Button';
import { Input } from '../../Input';
import cl from './SearchInputTransform.module.scss';
import { useState } from 'react';

type SearchInputTransformProps = {
    containerClassName?: string,
    inputClassName?: string,
    handlerInput: (value: string) => void,
    inputValue: string,
    
}
export function SearchInputTransform(props: SearchInputTransformProps) {
    const [showInput, setShowInput] = useState<number>(0);

    const setShow = (value: number) => {
        setShowInput(prev => {
            let newVal = prev += value;
            if (newVal < 0) {
                newVal = 0;
            } else if (newVal > 2) {
                newVal = 2;
            }
            return newVal;
        })
    }

    return (
        <div
        className={`${cl.container} ${props.containerClassName??""}`}
        onMouseOver={() => {
            setShow(1);
        }}
        onMouseOut={() => {
            if (props.inputValue.length == 0) {
                setShow(-1);
            }
        }}
        >   
        <AnimatePresence>
            <motion.div
            initial={'hide'}
            transition={{ duration: 0.5 }}
            animate={showInput > 0 ? 'show' : 'hide'}
            variants={{
                show:{
                    opacity: 1,
                },
                hide: {
                    opacity: 0,
                }
            }}
            >
            <Input
            handlerFocus={() => {
                setShow(1);
            }}
            handlerBlur={() => {
                setShow(-1);
            }}
            value={props.inputValue}
            handlerInput={(target) => {
                props.handlerInput(target)
            }} 
            className={`${props.inputClassName??""}`}
            size='sm'
            
            />
            </motion.div>
        </AnimatePresence>
        <motion.div
        initial={'big'}
        transition={{ duration: 0.5 }}
        animate={showInput ? 'small' : 'big'}
        variants={{
            big:{
                scale: 1,
            },
            small: {
                scale: 0.8,
            }
        }}
        className={`${cl.clickBtn}`}
        role='button'
        >
            <svg width="29" height="31" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.9167 20.5221C17.9102 20.5221 21.9583 16.7387 21.9583 12.0716C21.9583 7.40451 17.9102 3.62109 12.9167 3.62109C7.92309 3.62109 3.875 7.40451 3.875 12.0716C3.875 16.7387 7.92309 20.5221 12.9167 20.5221Z" stroke="#979797" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M27.125 25.3507L19.375 18.1074" stroke="#979797" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </motion.div>
        </div>
    )
}