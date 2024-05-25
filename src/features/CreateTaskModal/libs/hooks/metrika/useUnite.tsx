import { useEffect, useState } from "react";
import { UnitType, unitItems } from "../../../data/metrika/unitItems";

export function useUnite(initialType : UnitType | null) {

    const [unit, setUnit] = useState<UnitType | null>(null);
    const [unitInvalid, setUnitInvalid] = useState<false | string>('Данное поле обязательно для заполнения');
    const unitList = unitItems;
    
    useEffect(() => {
        checkResponsibleValid();
    }, [unit]);

    const unitHandler = (id : UnitType['id'] | null | undefined) => {
        console.log(id, unitList, 'unit')
        if (id) {
            let item = unitList.find(el => el.id == id);
            item ? setUnit(item) : setUnit(null);
        } else {
            setUnit(null)
        }

       
    }
    const checkResponsibleValid = () => {
        unit ? setUnitInvalid(false) : setUnitInvalid('Дaнное поле обязательно для заполнения'); 
    }


    return {
        unit, unitHandler, unitInvalid, unitList
    }
}