import { useEffect, useState } from "react";
import { TaskType } from "../../types/TaskType";
import { ModalActionType } from "../../types/ModalActionType";


export function useModalTitle(taskType : TaskType | null, modalType: ModalActionType) {

    const [modalTitle, setModalTitle] = useState<string>('Добавить новую задачу');

    useEffect(() => {
        let str = modalType == 'create' ? 'Добавить новую' : 'Редактировать';
        switch ( taskType?.id) {
             case 'metric' :
             setModalTitle(`${str} метрику`)
             break;
             case 'strategyMetric' :
             setModalTitle(`${str} стратегическую метрику`)
             break;
             case 'OKR' :
             setModalTitle(`${str} OKR задачу`)
             break;
             case 'KR' :
             setModalTitle(`${str} задачу`)
             break;
             default : setModalTitle(`${str} задачу`) 
             break;
             
        }
     }, [taskType])
    

    return modalTitle;
}