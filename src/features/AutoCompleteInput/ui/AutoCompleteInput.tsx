import cl from './AutoCompleteInput.module.scss';

import { useEffect, useRef, useState } from 'react';
import { AutoCompleteInputType, ListType } from '../types/AutoCompleteInputType';
import { Input } from '@/shared/ui/Input';
import { DefaultItem } from './DefaultItem';
import { OverlayTrigger} from 'react-bootstrap';

export function AutoCompleteInput(props: AutoCompleteInputType) {
    const {
        isDefaultValueAlreadySet = () => {},
        setDefaultValue = false,
        inValid = false,
        list,
        getItemLabel,
        getItemID,
        placeholder = "",
        isListLoad = false,
        setValues = () => {},
        defaultValue = null,
        CustomItem = undefined,
        disabled = false,
        onInput = () => {},
        offFilterList = false,
        emplyListLabel = 'Список пуст'
    } = props;
    
    
    const [inputValue, setInputValue] = useState<string | null>("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [value, setValue] = useState<null | ListType>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handlerItemClick = (id: string) => {
            let activeItem = list.find(el => el[getItemID] == id);
            if (activeItem) {
                setValues(activeItem);
                setValue(activeItem);
                setInputValue(activeItem[getItemLabel]);
                setShowDropdown(false);
            } else {
                setValues(null);
                setValue(null);
                // setInputValue("");
            }   
    }

    const closeModalByClick = (event: any) => {
        if (!event.target?.closest(`.refInput`) && !event.target?.closest(`.${cl.dropdownContainer}`)) {
            setShowDropdown(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', closeModalByClick);
        return () => document.removeEventListener('click', closeModalByClick)
    }, []);

    useEffect(() => {
        if (defaultValue && setDefaultValue && list.length > 0) {
            handlerItemClick(defaultValue[getItemID]);
            isDefaultValueAlreadySet();
        } else if (!defaultValue && list.length == 0) {
            handlerItemClick("");
        }
    }, [defaultValue, list, setDefaultValue]);

    return (
    <>
            
        <OverlayTrigger
          show={showDropdown}
          trigger="click"
          key={'bottom'}
          placement={'bottom'}
          overlay={
            
                <div
                id={`popover-positioned-bottom`}
                className={cl.dropdownContainer}
                style={{
                    width: inputRef.current ? inputRef.current?.getBoundingClientRect().width + "px" : 'fit-content',
                }}
                ref={dropdownRef}
                >
                    <div className={cl.dropdownList}>
                        {
                            list.length > 0 && list.map((item, index) => {

                                let isVisible = true;

                                if (!offFilterList) {
                                    item[getItemLabel].toLowerCase().includes(inputValue?.toLowerCase()) ? isVisible = true : isVisible = false;
                                }
                                if((isVisible && inputValue?.length) || !inputValue?.length) {
                                    if (CustomItem) {
                                        return <CustomItem 
                                        key={index}
                                        item={item} 
                                        active={value && value[getItemID] == item[getItemID] ? true : false} 
                                        handlerClick={(id: string) => handlerItemClick(id)}
                                        />
                                    } else {
                                        return <DefaultItem
                                        active={value && value[getItemID] == item[getItemID] ? true : false}
                                        key={item[getItemID]}
                                        label={item[getItemLabel]}
                                        id={item[getItemID]}
                                        item={item}
                                        onClick={handlerItemClick} />
                                    } 
                                }
                            })
                        }

                    </div>

                    {list.length == 0 && !isListLoad && (<div className={cl.listLoader}>{emplyListLabel}</div>)}
                    {isListLoad && (<div className={cl.listLoader}>Идет загрузка списка...</div>)}
                    {inputValue && inputValue?.length > 0 && offFilterList == false &&list.every(item => !item[getItemLabel].toLowerCase().includes(inputValue?.toLowerCase())) && (
                        <div className={cl.listLoader}>Совпадений не найдено...</div>
                    )}
                </div> 
          }
        >
       
          <Input
            inValid={inValid}
            className='refInput'
            disabled={disabled}
            placeholder={placeholder}
            handlerFocus={() => {
                setShowDropdown(true);
            }}
            handlerChange={(e) => {

            }}
            ref={inputRef}
            value={inputValue??""} 
            handlerInput={(str) => {
                console.log(str, 'kkk')
                if (value) {
                    if (value[getItemLabel] !== str) {
                        setValues(null);
                        setValue(null);
                    }
                }
                setInputValue(str);
                onInput(str);
                if (!showDropdown) {
                    setShowDropdown(true);
                }
            }} 
            />

        </OverlayTrigger>

    </>
    )
}
