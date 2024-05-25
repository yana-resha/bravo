import moment from "moment";
import { useEffect, useState } from "react"

type Props = {
    list: any [],
}

export enum SortValueEnum {
    up = 'up',
    down = 'down', 
}

export enum SortKeysEnum  {
    name = 'title', 
    complexity = 'complexity',
    weight = 'weight',
    responsibles = 'responsibles',
    progress = 'progress',
    createDate = 'createDate',
    updateDate = 'updateDate',
    cicreateDate = 'cicreateDate',
}

type SortValuesType = {
    value: SortValueEnum | null,
    key: SortKeysEnum,
}

export function useSortList ({list = []} : Props) {

    const [sortList, setSortList] = useState(list);

    const [sortValues, setSortValues] = useState<SortValuesType[]>([
        {key: SortKeysEnum.name, value: null}, 
        {key: SortKeysEnum.complexity, value: null},
        {key: SortKeysEnum.weight, value: null},
        {key: SortKeysEnum.responsibles, value: null}, 
        {key: SortKeysEnum.progress, value: null}, 
        {key: SortKeysEnum.createDate, value: null},
        {key: SortKeysEnum.updateDate, value: null},
        {key: SortKeysEnum.cicreateDate, value: null}
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

    function sortByDate(key: SortKeysEnum, sortValue: SortValueEnum) {
        setSortList(prevArray => {
            let newArr =  [...prevArray].sort((a, b) => {
                let data1 = new Date(moment(a[key], 'DD.MM.YYYY').format('YYYY-MM-DD'));
                let data2 = new Date(moment(b[key], 'DD.MM.YYYY').format('YYYY-MM-DD'));
                if (sortValue == SortValueEnum.down) {
                    return data2.getTime() - data1.getTime();
                } 
                return data1.getTime() - data2.getTime();
                
                
            });
            return newArr;
        })
    }

    function sortByString(key: SortKeysEnum, sortValue: SortValueEnum) {
        setSortList(prevArray => {
            
            let newArr =  [...prevArray].sort((a, b) => {
                
                let title1 = a[key].split(" ").join("");
                let title2 = b[key].split(" ").join("");
                if (sortValue == SortValueEnum.down) {
                    return title2.localeCompare(title1);  
                  
                } 
                return title1.localeCompare(title2);
            });
            
            
            return newArr
        });
    }
    
    function sortByNumber(key: SortKeysEnum, sortValue: SortValueEnum) {
        setSortList(prevArray => {
            let newArr =  [...prevArray].sort((a, b) => {
                const aKey = a[key]??0;
                const bKey = b[key]??0;
                if (sortValue == SortValueEnum.down) {
                    return bKey - aKey;  
                } 
                return aKey - bKey;  
            });
            return newArr;
        });
    }

    function sortByDuringDays(key: SortKeysEnum, sortValue: SortValueEnum) {
        setSortList(prevArray => {
            let newArr =  [...prevArray].sort((a, b) => {
                const aKey = moment().diff(moment(a[key]??moment(), 'YYYY-MM-DD HH:mm:ss'), 'days');
                const bKey = moment().diff(moment(b[key]??moment(), 'YYYY-MM-DD HH:mm:ss'), 'days');
                if (sortValue == SortValueEnum.down) {
                    return bKey - aKey;  
                } 
                return aKey - bKey;  
            });
            return newArr;
        });
    }

    function sortByResponsible(key: SortKeysEnum, sortValue: SortValueEnum) {
        setSortList(prevArray => {
            let newArr =  [...prevArray].sort((a, b) => {
                let resp1 = a[key][0].fio.split(" ").join("");
                let resp2 = b[key][0].fio.split(" ").join("");
                if (sortValue == SortValueEnum.down) {
                    return resp2.localeCompare(resp1);  
                } 
                return resp1.localeCompare(resp2)  
            });
            return newArr;
        });
    }

    function sortArray () {
        setSortList(list);
        if (sortValues.every(sort => sort.value == null)) {
            return;
        }
        sortValues.forEach(sort => {
            if (sort.value !== null) {
                if (sort.key == SortKeysEnum.updateDate) sortByDate(SortKeysEnum.updateDate, sort.value);
                if (sort.key == SortKeysEnum.createDate) sortByDate(SortKeysEnum.createDate, sort.value);
                if (sort.key == SortKeysEnum.name) sortByString(SortKeysEnum.name, sort.value);
                if (sort.key == SortKeysEnum.progress) sortByNumber(SortKeysEnum.progress, sort.value);
                if (sort.key == SortKeysEnum.complexity) sortByNumber(SortKeysEnum.complexity, sort.value);
                if (sort.key == SortKeysEnum.responsibles) sortByResponsible(SortKeysEnum.responsibles, sort.value);
                if (sort.key == SortKeysEnum.cicreateDate) sortByDuringDays(SortKeysEnum.cicreateDate, sort.value);
                if (sort.key == SortKeysEnum.weight) sortByNumber(SortKeysEnum.weight, sort.value);
            }
        });
    }

    useEffect(() => {
        if (list.length > 0) {
            sortArray();
        }
    }, [sortValues, list]);

    


    
    return {sortList, sortValues, setSort}
}