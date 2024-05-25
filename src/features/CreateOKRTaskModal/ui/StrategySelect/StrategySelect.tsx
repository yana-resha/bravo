import { useSelector } from 'react-redux';
import cl from './StrategySelect.module.scss';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { getStrategyList } from "@/pages/OKRPage/api/strategyAPI";
import { useEffect, useState } from 'react';
import { IStrategyTargetShort } from '@/entities/StrategyTarget';
import { AutoCompleteInput } from '@/features/AutoCompleteInput';

type StrategySelectProps = {
    defaultValue?: IStrategyTargetShort,
    setValue: (val: IStrategyTargetShort | null) => void;
}

export function StrategySelect ({defaultValue = undefined, setValue}: StrategySelectProps) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [strategyList, setStrategyList] = useState<IStrategyTargetShort[]>([]);
    const [listError, setListError] = useState<boolean>(false);
    const [isListLoading, setIsListLoading] = useState<boolean>(false);
    const [setDefaultValue, isSetDefaultValue] = useState<boolean>(true);

    const loadStrategyList = async () => {
        const request = {
            login: currentUser.login,
            shortList: true,
        }
        setListError(false);
        setIsListLoading(true);
        setStrategyList([]);
        try {
            let response: IStrategyTargetShort[] = await getStrategyList(request);
            if (response) {
                setStrategyList(response);
            }
        } catch (error: any) {
            setListError(true);
        } finally {
            setIsListLoading(false);
        }
        
            
    }
    useEffect(() => {
        loadStrategyList();
    }, []);





    return (
        <AutoCompleteInput 
            isDefaultValueAlreadySet={() => isSetDefaultValue(false)}
            setDefaultValue={setDefaultValue}
            getItemID={'id'}
            getItemLabel={'title'}
            placeholder={'Выберите цель'}
            isListLoad={isListLoading}
            list={strategyList}
            setValues={setValue}
            defaultValue={defaultValue}
            CustomItem={({item, handlerClick, active}) => {
                
                return (
                  <div
                    onClick={() => {
                      handlerClick(item.id)
                    }}
                    className={`${cl.listItem} d-flex`}
                    >
                        {item.title}
                    </div>
                )
            }}
        />
    )
}