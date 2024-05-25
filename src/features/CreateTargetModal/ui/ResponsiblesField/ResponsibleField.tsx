import { ResponsibleType } from "@/shared/types/responsibleType"
import { useEffect, useState } from "react";
import { ResponsibleSelectType } from "./ResponsibleSelect";
import { Button } from "@/shared/ui/Button";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { Select } from '@consta/uikit/Select';
import cl from '../CreateTargetModal.module.scss';
import { AutoCompleteInput } from "@/features/AutoCompleteInput";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";

type PropsType = {
    changeFunc: (value: IFormResponsible) => void,
    closeBtn?: boolean
    closeFunc?: (index: string | number) => void,
    responsibleList: IFormResponsible[],
    index: string | false,
    initialValue?: ResponsibleType | null,
    className?: string,
}

export function ResponsibleField({className="", changeFunc, closeBtn, closeFunc = () => {}, responsibleList, index , initialValue} : PropsType) {
    
    const [value, setValue] = useState<IFormResponsible | null>(null);

    const changeInputValue = (item: IFormResponsible | null) => {
            let data: IFormResponsible = item ? {...item} : {};
            // if (!item?.login && initialValue?.login) data = {...initialValue};
            data.index = index;
            changeFunc(data);
            if (data && data.login !== undefined) {
                let newData: IFormResponsible ={
                    fio: "",
                    cntComplexity: 0,
                    cntPriority: 0,
                    avatar: null,
                    login: "",
                    ...data
                };
                setValue(newData)
            } else {
                setValue(null);
            }    
    }
    useEffect(() => {
        if (!value) {
            changeInputValue(null);
        }
    }, [value]);

    useEffect(() => {
        
        if (!value && initialValue && responsibleList.length > 0) {
            let item = responsibleList.find(resp => resp.login == initialValue.login)??null;
            if (!item) {
                if (index) {
                    closeFunc(index);
                }
            }
        }
    }, [initialValue, responsibleList])
    return (
        <div className='d-flex mb-2'>
        <AutoCompleteInput 
        key={index ? index : undefined}
        list={responsibleList}
        getItemLabel={'fio'}
        getItemID={'login'}
        placeholder={'Выберите ответственного'}
        isListLoad={false}
        defaultValue={initialValue??null}
        setValues={(item) => {
            setValue(item);
            changeInputValue(item);
        }}
        CustomItem={({item, handlerClick, active}) => {
            return (
                <div
                    aria-selected={active}
                    onClick={() => {
                        handlerClick(item.login)
                    }}
                    className={`${cl.respItem} d-flex flex-direction-row align-items-center ${active ? cl.respItemActive : ''}`}>
                    <img src={item.avatar ? item.avatar : defaultAvatar} alt="" className='rounded-circle avatar-xs me-2' />
                    <div>
                        <span className={cl.respName}>{item.fio}</span>
                        <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                            {item.cntComplexity ?? 0}/10
                        </span>
                    </div>
                </div>
            )
        }}
        >

        </AutoCompleteInput>

        {
            closeBtn && (
                <Button
                    color='clear'
                    onClick={() => {
                        if (index) {
                            changeFunc({ index: index });
                            closeFunc(index)
                        }
                    }}
                >
                    <i className="ri-close-line"></i>
                </Button>
            )
        }
        </div> 
    )
    
}