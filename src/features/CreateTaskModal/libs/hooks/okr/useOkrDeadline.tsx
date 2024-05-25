/* Hooks */
import { useEffect, useState } from "react";

/* Redux */
import { useSelector } from "react-redux";

/* Types */
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";

/* Components */
import { DatePickerPropValue } from "@consta/uikit/DatePicker";

export function useOkrDeadline(initialValue = undefined, responsible: IFormResponsible | null) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);

    const [okrDeadline, setOkrDeadline] = useState<undefined | DatePickerPropValue<"date"> | Date>(initialValue);
    const [deadlineDisabled, setDeadlineDisabled] = useState<boolean>(false);
    
    useEffect(() => {
        if (responsible) {
            if (currentUser.login !== responsible.login) {
                setOkrDeadline(undefined);
                setDeadlineDisabled(false);
            } else {
                setOkrDeadline(undefined);
                setDeadlineDisabled(true);
            }
        } 
    }, [responsible]);

    const handlerDeadline = (deadline: undefined | DatePickerPropValue<"date"> | Date) => {
        setOkrDeadline(deadline);
    }
    
    return {
        okrDeadline, deadlineDisabled, handlerDeadline
    };
}