import { useEffect, useState } from "react";

export function useTaskName(initialValue = '') {

    const [nameValue, setValue] = useState<string>(initialValue);
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