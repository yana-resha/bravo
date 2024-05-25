/* Hooks */
import { useEffect, useReducer, useState } from "react";

/* Redux */
import { useSelector } from "react-redux";

/* Types */
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import IResponsible from "@/entities/user/types/IResponsible";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";
import { IUserDataFull } from "@/entities/user/types/IUserData";
import { TaskType } from "@/features/CreateTaskModal/types/TaskType";
import { ModalActionType } from "@/features/CreateTaskModal/types/ModalActionType";

/* API */
import { getDirectList, getUserData } from "@/shared/api/User/UserAPI";
import { ResponsibleType } from "@/shared/types/responsibleType";

export type ACTIONTYPE = {
    type: "update", 
    payload: IFormResponsible | null,
};

function responsiblesReducer(state : IFormResponsible[], action : ACTIONTYPE) {
    const addResp  = () => {
        let responsible = action.payload;
        if (!responsible) {
            return [];
        } else {
            let newArr = state.filter(el => el.index !== responsible?.index);
            if (responsible.login) newArr.push(responsible);
            return newArr;
        }
    }
    switch (action.type) {
        case 'update' : return addResp();
        default: return state;
    }
}

export function useResponsible(taskType:TaskType| null, modalType: ModalActionType, requare: boolean = false) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [initialResponsibles, setInitialResponsibles] = useState<IResponsible[]>([]);
    const [responsibleList, setResponsibleList] = useState <IUserDataFull[]> ([]);
    const [respLoaded, setRespLoaded] = useState(false);
    const [respListInLoad, setRespListInLoad] = useState(false);
    const [respInvalid, setRespInvalid] = useState<boolean | string>('Дaнное поле обязательно для заполнения');
    const [respError, setRespError] = useState<undefined | string>(undefined);
    const [userDataInfo, setUserDataInfo] = useState<null | IUserDataFull>(null);
    const [responsibles, responsibleHandler] = useReducer(responsiblesReducer, []);
 
    const getResponsibleList = async () => {
        setResponsibleList([]);
        setRespListInLoad(true);
        setRespError(undefined);

        try {
            // Если это Super User - список его DR
            if (currentUser.role === 'super-user') {
                let responseDirect = await getDirectList({login: currentUser.login});
                setResponsibleList(responseDirect);
                return;
            }

            // Если не Super User и задача OKR или Стратегическая метрика - то только текущий пользователь
            if (taskType?.id === 'OKR' || taskType?.id === 'strategyMetric') {
                const responseSelf = await getUserData({login: currentUser.login});
                if (responseSelf) {
                    setUserDataInfo(responseSelf); 
                    setResponsibleList([responseSelf]);
                    return;
                } else {
                    throw new Error('Не удалось загрузить ваши данные');
                }
            }

            // В остальных случаях пользователь + его DR
            const responseSelf = await getUserData({login: currentUser.login});
            if (responseSelf) {
                setUserDataInfo(responseSelf)
            } else {
                throw new Error('Не удалось загрузить ваши данные');
            }

            const responseDirect = await getDirectList({login: currentUser.login});
            if (responseDirect) {
                let newArr = [...responseDirect];
                if (responseSelf) newArr.unshift(responseSelf);
                setResponsibleList(newArr);
            } else {
                throw new Error('Не удалось загрузить список ваших сотрудников');
            }
            setRespLoaded(false);
        } catch(error: any) {
            setRespError(error);
            console.log(error);
        } finally {
            setRespListInLoad(false);
        }
        
    };


    useEffect(() => {
        if (taskType && respLoaded === false) {
            getResponsibleList();
        }
    }, [taskType]);

    useEffect(() => {
        if (responsibleList.length > 0 && modalType === 'create') {
            setInitialResponsibles([])
        } 
    }, [responsibleList]);

    useEffect(() => {
        checkResponsibleValid();
    }, [responsibles])

    const checkResponsibleValid = () => {
        if (requare) {
            responsibles.length > 0 ? setRespInvalid(false) : setRespError('Дaнное поле обязательно для заполнения');
        } else {
            setRespInvalid(false)
        }
        
    }

    return {
        initialResponsibles ,setInitialResponsibles,responsibles, responsibleList, userDataInfo, respError, respListInLoad ,responsibleHandler, respInvalid
    };
}