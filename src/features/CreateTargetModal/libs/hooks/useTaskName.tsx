import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export function useTaskName(initialValue = '') {

    const [nameValue, setValue] = useState<string>("");
    const [nameInvalid, setNameInvalid] = useState<boolean | string>(false);

    const handlerChangeName = (value: string | null) => {  
        setValue(value??"");
    }

    useEffect(() => {
        checkNameValid();
    }, [nameValue])

    const checkNameValid = () => {
        nameValue.length === 0 ? setNameInvalid('Заполните название задачи') : setNameInvalid(false); 
    }
    
    return {
        nameValue,
        handlerChangeName,
        nameInvalid,
    };
}