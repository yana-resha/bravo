import cl from '../../createTaskModal.module.scss';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { useEffect, useState } from "react";
import { ACTIONTYPE } from "@/features/CreateTaskModal/libs/hooks/okr/useResponsible";
import { AutoCompleteInput } from "@/features/AutoCompleteInput";
import IResponsible from "@/entities/user/types/IResponsible";
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { userRoles } from '@/entities/user/types/userTypes';


type SelectProps = {
    list: IResponsible[],
    item: IResponsible | null,
    listInLoad: boolean,
    showValid: boolean | null,
    handlerItem: (obj : ACTIONTYPE) => void;
    index?: string | undefined,
    validError?: boolean| string,
    className?: string,
    requare?: boolean,
}

export function ResponsibleSelect(props : SelectProps) {
    const {
        list, 
        item, 
        listInLoad, 
        handlerItem, 
        showValid = null,
        index, 
        validError = undefined, 
        className = "", 
        requare = false
    } = props;

    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [value, setValue] = useState<any>(null);
    const maxUserComplexity = currentUser.role === userRoles.superUser ? 13 : 10;

    useEffect(() => {
        if (item && item.login && !value) {
            setValue(item);
            handlerItem({type: 'update', payload: {...item, index}});
        };
    }, [item]);

    const handler = (item: any) => {
        setValue(item);
        handlerItem({type: 'update', payload: {...item, index}});
    }

    return (
        <AutoCompleteInput 
            list={list}
            getItemLabel={'fio'}
            getItemID={'login'}
            placeholder={'Выберите владельца'}
            isListLoad={listInLoad}
            defaultValue={item}
            setValues={handler}
            CustomItem={({item, handlerClick, active}) => {
                return (
                    <div
                        aria-selected={active}
                        onClick={() => {
                            handlerClick(item.login);
                        }}
                        className={`${cl.respItem} d-flex flex-direction-row align-items-center ${active ? cl.respItemActive : ''}`}>
                        <img src={item.avatar ? item.avatar : defaultAvatar} alt="" className='rounded-circle avatar-xs me-2' />
                        <div>
                            <span className={cl.respName}>{item.fio}</span>
                            <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                                {item.cntComplexity ?? 0}/{maxUserComplexity}
                            </span>
                        </div>
                    </div>
                )
            }}
        >
        </AutoCompleteInput>
    )
}