import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { ResponsibleType } from "@/shared/types/responsibleType";
import { OKRItemType } from "@/entities/task/types/OKRItemType";

export function useSelectOKR( responsible : null | ResponsibleType, respListInLoad : boolean, respError : undefined | string) {
    
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [OKRItem, setOKRItem] = useState<OKRItemType | null>(null);
    const [OKRList, setOKRList] = useState<OKRItemType []> ([]);
    const [OKRListLoad, setOKRListLoad] = useState(false);
    const [OKRError, setOKRError] = useState<undefined | string>(undefined);
    const [OKRDisabled, setOKRDisabled] = useState(false);
    
    useEffect(() => {
        if (responsible) {
            setOKRList(responsible.strategyList ?? []);
            setOKRDisabled( !(currentUser.login != responsible.login) );
        } else {
            setOKRList([]);
        }
    }, [responsible]);

    useEffect(() => {
        setOKRListLoad(respListInLoad);
    }, [respListInLoad])
    
    useEffect(() => {
        respError ? setOKRError('Не удалось загрузить список целей') : setOKRError(undefined);
    }, [respError])


    const OKRHandler = (OKRItem: OKRItemType | null) => {
        setOKRItem(OKRItem);
    }
    
    return {
        OKRHandler, OKRItem, OKRList, OKRListLoad, OKRError, OKRDisabled
    };
}