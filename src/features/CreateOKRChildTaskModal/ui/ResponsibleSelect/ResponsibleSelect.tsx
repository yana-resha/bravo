import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import IResponsible from "@/entities/user/types/IResponsible"
import { getDirectList } from "@/shared/api/User/UserAPI";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import cl from './ResponsibleSelect.module.scss';
import { AutoCompleteInput } from "@/features/AutoCompleteInput";

type ResponsibleSelectProps = {
    responsible: IResponsible | null,
    setResponsible: (resp : IResponsible | null) => void;
    invalid?: boolean,
    defaultValue?: IResponsible,
}
export function ResponsibleSelect({responsible, setResponsible, invalid = false, defaultValue = undefined} : ResponsibleSelectProps) {

    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [isResponsibleLoading, setIsResponsibleLoading] = useState(false);
    const [isResponsibleError, setIsResponsibleError] = useState(false);
    const [responsiblesList, setResponsiblesList] = useState<IResponsible[]>([]);
    const [setDefaultValue, isSetDefaultValue] = useState<boolean>(true);
    

    const loadResponsiblesList = async () => {
        setIsResponsibleLoading(true);
        setIsResponsibleError(false);
        setResponsiblesList([]);
        try {
            let response = await getDirectList({login: currentUser.login});
            let newList: IResponsible[] = [];
            if (response) {
                newList = [{...currentUser, checked: false}, ...response.map(el => {
                    el.checked = false;
                    return el;
                })];
            } else {
                newList =[{...currentUser, checked: false}];
            }
            setResponsiblesList(newList);

        } catch (error : any) {
            setIsResponsibleError(error)

        } finally {
            setIsResponsibleLoading(false);
        }
    }

    useEffect(() => {
    }, [responsible])

    useEffect(() => {
        loadResponsiblesList()
    }, []);

    
    return (
        <AutoCompleteInput
            setDefaultValue={setDefaultValue} 
            isDefaultValueAlreadySet={() => isSetDefaultValue(false)}
            inValid={invalid}
            list={responsiblesList}
            getItemLabel={'fio'}
            getItemID={'login'}
            placeholder={'Выберите владельца'}
            isListLoad={isResponsibleLoading}
            defaultValue={defaultValue}
            setValues={setResponsible}
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
                                {item.cntComplexity ?? 0}/10
                            </span>
                        </div>
                    </div>
                )
            }}
        >
        </AutoCompleteInput>


        
    )
}
