import { useEffect, useState } from "react";

type FiltersType = {
    [key : string]: string [],
}

type Props = {
    list: any [],
    // указать ключи в которых поиск по массиву
    searchInArray?: string [],
    searchInObject?: {filterKey: string, objectKey: string} [],
}

export function useFilterList ({list, searchInArray = [], searchInObject = []}: Props) {
    const [filters, setFilters] = useState<FiltersType | null>(null);
    const [includesFilter, setIncludes] = useState<string>("");
    const [filterList, setFilterList] = useState<string[]>([]);

    // были ли применены фильтры или нет (может список просто сам по себе пустой или загружается), чтобы понимать какую плашку вешать на списке
    const [applied, setAppliedFilter] = useState(false);

    function setIncludesFilter(value: string) {
        setIncludes(value);
    }

    function setFilterValue (key : string, value : string) {
        setFilters(preValue => {
            let newValue = preValue??{};
            if (!newValue[key]) newValue[key]= [];
            newValue[key].push(value);
            updateFilterList(includesFilter, newValue);
            return newValue;
        });
    }

    function deleteFilterValue (key: string, value?: string) {
        setFilters(preValue => {
            let newValue = preValue??{};
            if (!newValue[key]) {
                updateFilterList(includesFilter, newValue);
                return newValue;
            }
            if (value) {
                newValue[key] = newValue[key].filter(el => el !== value);
                if (newValue[key].length == 0) {
                    delete newValue[key];
                }
            } else {
                delete newValue[key];
            }
            updateFilterList(includesFilter, newValue);
            return newValue;
        });
        
    }

    function updateFilterList(includesFilter: string = "", filters: FiltersType | null = null) {
        includesFilter.length > 0 || (filters && Object.values(filters).flat(1).length > 0) ? setAppliedFilter(true) : setAppliedFilter(false);
        
        let newList = list.filter(el => el.title.toLowerCase().includes(includesFilter.toLowerCase())).filter(el => {
            
            if (filters && Object.values(filters).flat(1).length > 0) {
                let validCount = Object.keys(filters).length;
                let valid = 0;
                for (let key of Object.keys(filters)) {
                    
                    let needKey: string | undefined = searchInObject.find(opt => opt.filterKey === key)?.objectKey;
                    let itemValue = el[key];
                    if (needKey && typeof needKey === 'string') {
                        if (searchInArray.includes(key)) {
                            itemValue = itemValue.map((obj: any) => obj[`${needKey}`]);
                        } else {
                            itemValue = itemValue[`${needKey}`];
                        }  
                    }

                    if (searchInArray.includes(key)) {
                        if (filters[key].some(val => itemValue.includes(val))) {
                            valid += 1;
                        }
                    } else {
                        if (filters[key].some(val => val == el[key])) {
                            valid += 1;
                        }
                    }  
                }
                if (valid == validCount) return el;
            } else {
                return el;
            }
            
        }).map(el => el.id);
        setFilterList(newList);
    }

    useEffect(() => {
        updateFilterList(includesFilter,filters);
    }, [includesFilter]);

    useEffect(() => {
        updateFilterList(includesFilter,filters);
    }, [list])

    return {
        setFilterValue, deleteFilterValue, filterList, setIncludesFilter, applied
    }
}