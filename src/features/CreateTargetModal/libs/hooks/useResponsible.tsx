import { useEffect, useState } from "react";
import { ResponsibleType } from "@/shared/types/responsibleType";
import { TaskType } from "../../data/okr/taskType";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { getDirectList, getUserData } from "@/shared/api/User/UserAPI";
import IResponsible from "@/entities/user/types/IResponsible";
import { IUserDataFull } from "@/entities/user/types/IUserData";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";

export function useResponsible(taskType: TaskType| null) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [responsibleValues, setResponsibleValues] = useState<IFormResponsible []>([]);
    const [responsible, setResponsible] = useState<any>({});
    const [responsibleList, setResponsibleList] = useState <IResponsible[]> ([]);
    const [respLoaded, setRespLoaded] = useState(false);
    const [respListInLoad, setRespListInLoad] = useState(false);
    const [respInvalid, setRespInvalid] = useState<boolean | string>('Дaнное поле обязательно для заполнения');
    const [respError, setRespError] = useState<undefined | string>(undefined);
    const [userDataInfo, setUserDataInfo] = useState<null | IUserDataFull>(null);
 
    const changeResponsibleValues = (value: IFormResponsible) => {
        setResponsibleValues(prev => {
            let newArr = [...prev.filter(el => el.index !== value.index)];
            if (value.login) {
                newArr.push(value);
            }
            return newArr;
        });
    }
 
    const getResponsibleList = async () => {
        setResponsibleList([]);
        setRespListInLoad(true);
        setRespError(undefined);

        try {
            let responseSelf;
            if (currentUser.login != 'ivanovskiy_el') {
                responseSelf = await getUserData({login: currentUser.login});
                if (responseSelf) {
                    setUserDataInfo(responseSelf); 
                    setResponsibleList([responseSelf]);

                } else {
                    throw new Error('Не удалось загрузить ваши данные');
                }
            }
            let responseDirect = await getDirectList({login: currentUser.login});
            if (responseDirect) {
                let newArr = [...responseDirect];
                if (currentUser.login != 'ivanovskiy_el') {
                    if (responseSelf) newArr.unshift(responseSelf)
                } ;

                setResponsibleList(newArr)
            } else {
                throw new Error('Не удалось загрузить список ваших сотрудников');
            }
            setRespLoaded(false);
        } catch(error : any) {
            setRespError(error);
            console.log(error);
        } finally {
            setRespListInLoad(false);
        }
        
    };
    
    useEffect(() => {
        if (respLoaded === false) {
            getResponsibleList();
        }
    }, []);


    useEffect(() => {
        checkResponsibleValid();
    }, [responsibleValues])

    const checkResponsibleValid = () => {
        responsibleValues.length > 0 ? setRespInvalid(false) : setRespInvalid('Дaнное поле обязательно для заполнения'); 
    }

    const responsibleHandler = (resp: ResponsibleType | null, index: number) => {
        let newResponsibles = responsible;
        newResponsibles[index] = resp;
        setResponsible(newResponsibles);
    }
    
    return {
        responsible, responsibleList, userDataInfo, respError, respListInLoad ,responsibleHandler, respInvalid, responsibleValues, changeResponsibleValues
    };
}