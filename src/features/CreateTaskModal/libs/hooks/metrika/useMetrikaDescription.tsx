import { useEffect, useState } from "react"

export function useMetrikaDescription() {

    const [metrikaDescValue, setMetrikaDescValue] = useState("");
    const [metrikaDescInvalid, setMetrikaDescInvalid] = useState<false | string>("Данное поле обязательно для заполнения");
    const [notDescValidate, setNotDescValidate] = useState(false);
    const metrikaDescHandler = (value: string) => {
        setMetrikaDescValue(value);
    }

    useEffect(() => {
        if (!notDescValidate) {
            metrikaDescValue.length > 0 ? setMetrikaDescInvalid(false) : setMetrikaDescInvalid("Данное поле обязательно для заполнения");
        } else {
            setMetrikaDescInvalid(false);
        }
    }, [metrikaDescValue, notDescValidate]);

    useEffect(() => {
        metrikaDescHandler('');
    }, [notDescValidate])
    return {
        metrikaDescValue, metrikaDescInvalid, metrikaDescHandler, setNotDescValidate, notDescValidate
    }
}