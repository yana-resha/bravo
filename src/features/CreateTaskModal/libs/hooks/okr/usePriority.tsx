/* Hooks */
import { useEffect, useState } from "react";

/* Redux */
import { useSelector } from "react-redux";

/* Types */
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { ModalActionType } from "@/features/CreateTaskModal/types/ModalActionType";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";
import IResponsible from "@/entities/user/types/IResponsible";

/* Data */
import { PriorityType } from "../../../data/okr/priorityType";


export function usePriority(initialType: PriorityType | null, responsible: IFormResponsible | null, modalType: ModalActionType, initialResponsible : null | IResponsible) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);

    const [taskPriority, setTaskPriority] = useState<PriorityType | null>(initialType ?? null);
    const [priorityBtnDisabled, setPriorityBtnDisabled] = useState(false);
    const [btnGroupDisabled, setBtnGroupDisabled] = useState(false)
    
    const priorityHandler = (type: PriorityType) => {  
        setTaskPriority(type);  
    }

    useEffect(() => {
        if (responsible) {
            if (currentUser.login !== responsible.login) {
                setPriorityBtnDisabled(false);
                setBtnGroupDisabled(false);
                if (responsible.cntPriority && Number(responsible.cntPriority) >= 5) {
                    if (modalType === 'create') {
                        setPriorityBtnDisabled(true);
                    }
                }
            } else {
                setBtnGroupDisabled(true);
                setPriorityBtnDisabled(true);
            }
        }

        if (modalType === 'create') {
            setTaskPriority(0);
        } else if (modalType === 'edit') {
            setTaskPriority(0);
            responsible && initialResponsible?.login != responsible.login ? setTaskPriority(0) : setTaskPriority(initialType);
        }
    }, [responsible])

    return {
        taskPriority,
        priorityHandler,
        priorityBtnDisabled,
        btnGroupDisabled,
    }
}