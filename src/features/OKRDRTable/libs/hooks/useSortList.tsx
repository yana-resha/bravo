import IResponsible from "@/entities/user/types/IResponsible";
import { useState } from "react"

export enum SortValueEnum {
    up = 'up',
    down = 'down', 
}

export enum SortKeysEnum  {
    name = 'fio', 
    complexityInWork = 'cntComplexity',
}

type SortValuesType = {
    value: SortValueEnum | null,
    key: SortKeysEnum,
}

export function useSortList () {

    const [sortValues, setSortValues] = useState<SortValuesType[]>([
        {key: SortKeysEnum.name, value: null},
        {key: SortKeysEnum.complexityInWork, value: null}, 
    ]);

    function setSort(key: SortKeysEnum | null, value: SortValueEnum | null) {
        setSortValues(prevArr => {
            let newArr = prevArr.map(obj => {
                if (key == null && value == null) {
                    obj.value = null;
                } else {
                    if (obj.key == key) {
                        obj.value = value;
                    } else {
                        obj.value = null;
                    }
                }

                return obj;
            });
            return newArr;
        });
    }
    
    function sortByNumber(list: IResponsible [], key: SortKeysEnum.complexityInWork, sortValue: SortValueEnum) : IResponsible [] {
        let newArr =  [...list].sort((a, b) => {
            const aKey = a[key]??0;
            const bKey = b[key]??0;
            if (sortValue == SortValueEnum.down) {
                return bKey - aKey;  
            } 
            return aKey - bKey;  
        });
        return newArr;
    } 

    function sortByResponsible(list: IResponsible [], sortValue: SortValueEnum) : IResponsible [] {
        let newArr = [...list].sort((a, b) => {
                let resp1 = a.fio??"".split(" ").join("");
                let resp2 = b.fio??"".split(" ").join("");
                if (sortValue == SortValueEnum.down) {
                    return resp2.localeCompare(resp1);  
                } 
                return resp1.localeCompare(resp2)  
            });
    
        return newArr;
    }

    function sortArray(list: IResponsible[]) {
        let newList = list;
        if (sortValues.every(sort => sort.value == null)) {
            return newList;
        }
        sortValues.forEach(sort => {
            if (sort.value !== null) {
                if (sort.key == SortKeysEnum.name) newList = sortByResponsible(newList, sort.value);
                if (sort.key == SortKeysEnum.complexityInWork) newList = sortByNumber(newList, SortKeysEnum.complexityInWork, sort.value);
            }
        });

        return newList;
    } 
    return {sortValues, setSort, sortArray}
}