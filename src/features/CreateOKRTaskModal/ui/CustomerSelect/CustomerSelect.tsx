import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import IResponsible from "@/entities/user/types/IResponsible"
import { getEmplyeerList } from "@/shared/api/User/UserAPI";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import cl from './CustomerSelect.module.scss';
import { AutoCompleteInput } from "@/features/AutoCompleteInput";

type CustomerSelectProps = {
    responsible: IResponsible | null,
    customer: IResponsible | null,
    setCustomer: (resp : IResponsible | null) => void;
    defaultValue?: IResponsible,
}
export function CustomerSelect({customer, setCustomer, responsible, defaultValue = undefined} : CustomerSelectProps) {

    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const isResponsibleLoading = useSelector((state: StoreReducerType) => state?.userData?.isListLoading);
    const isResponsibleError = useSelector((state: StoreReducerType) => state?.userData?.error);
    const responsiblesList = useSelector((state: StoreReducerType) => {
        return [state?.userData?.user.manager, {fio: state?.userData?.user.fio, login: state?.userData?.user.login, avatar: state?.userData?.user.avatar}]
    });
    const [emptyListLabel, setEmptyListLabel] = useState<string>("Не смогли получить список заказчиков")
    const [setDefaultValue, isSetDefaultValue] = useState<boolean>(true);


    useEffect(() => {
        if (responsible && responsible.login !== currentUser.login) {
            isSetDefaultValue(true);
        }
    }, [responsible]);

    useEffect(() => {
        if (defaultValue) {
            isSetDefaultValue(true);
        }
    }, []);
      
    return (
        <AutoCompleteInput
            setDefaultValue={setDefaultValue} 
            isDefaultValueAlreadySet={() => isSetDefaultValue(false)}
            disabled={responsible?.login == currentUser.login ? false : true} 
            emplyListLabel={emptyListLabel}
            offFilterList={true}
            onInput={(value) => {}}
            list={responsiblesList}
            getItemLabel={'fio'}
            getItemID={'login'}
            placeholder={'Выберите заказчика'}
            isListLoad={isResponsibleLoading}
            defaultValue={
                defaultValue 
                ? 
                defaultValue 
                : responsible && responsible.login !== currentUser.login ? currentUser : null
            }
            setValues={setCustomer}
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
                        </div>
                    </div>
                )
            }}
        >
        </AutoCompleteInput>
    )
}