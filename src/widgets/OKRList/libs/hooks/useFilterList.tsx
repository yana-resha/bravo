import { useEffect, useState } from "react";
import { FilterKeys, FiltersType } from "../../types/FilterType";
import moment from "moment";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRReduxListTypes } from "@/entities/task/model/slices/okrListSlice";
import { getListWithoutDuplicate } from "@/entities/task/utils";

type Props = {
    listCategory: OKRReduxListTypes,
}

export function useFilterList ({listCategory}: Props) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [includesFilter, setIncludes] = useState<string>("");
    const [filters, setFilters] = useState<FiltersType []>([
        {key: FilterKeys.period, value: []},
        {key: FilterKeys.responsibles, value: []},
        {key: FilterKeys.complexity, value: []},
        {key: FilterKeys.checkin, value: []},
        {key: FilterKeys.initiator, value: []}
    ]);
    const [filterList, setFilterList] = useState<string[]>([]);
    const [applied, setAppliedFilter] = useState(false);

    const list: OKRItemType[] = useSelector((state: StoreReducerType) => state.okrList)[`${listCategory??OKRReduxListTypes.inprogressList}`].list;
    const childTaskList = useSelector((state: StoreReducerType) => state.childTaskList.list);

    function setFilterValues(key: FilterKeys | null, value: FiltersType['value']) {
        if (!key) {
            setFilters(prevValue => {
                let newValue = prevValue.map(obj => {
                    obj.value = []
                    return obj;
                })
                return newValue;
            })
        } else {
            setFilters(prevValue => {
                let newValue = prevValue.map(obj => {
                    if (obj.key == key) obj.value = value;
                    return obj;
                })
                return newValue;
            })
        }
    }
    function setIncludesFilter(value: string) {
        setIncludes(value);
    }
    function isComplexity (complexity: number, values: string []) : boolean {
        return values.some(val => {
            let num = Number(val);
            if (num == 0) {
                return complexity == 0;
            } else if (num == 1) {
                return complexity > 0 && complexity < 2;
            } else if (num == 2) {
                return complexity >=2 && complexity < 3;
            } else if (num == 3) {
                return complexity >= 3;
            }
        });
    }

    // проверяет есть ли совпадения по ответственным
    function isIncludeResponsible (responsibles: any [], values: string[]) : boolean {
        if (responsibles.some((resp: any) => values.some(val => val == resp.login))) {
            return true
        }
        return false;
    }
    // проверяет установлен ли в данном квартале дедлайн
    function isDueDate(date: string | null, values: string[]) : boolean {
        if (date == null && values.includes('-')) {
            return true;
        } else {
            let validDate = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD');
            let answer = false;
            values.forEach(el => {
                if (el !== '-') {
                    if (moment(validDate).isSameOrAfter(el) && moment(validDate).isBefore(moment(el).add(3, 'M').format('YYYY-MM-DD'))) {
                        answer = true;
                    }
                }
            })

            return answer; 
        }
    }
    // проверяет по статусу checkin
    function isCheckin(el : OKRItemType, values: string[]) : boolean {
        if (!el.cicreateDate) {
            return false;
        } else {

            if (el.responsibles[0].login === currentUser.login) {
                return false;
            } else {

                let answer = false;
                values.forEach(value => {
                    if (value == 'Просмотрено') {
                        if (el.ciSeen) answer = true;
                    } else if (value == 'Не просмотрено') {
                        if (!el.ciSeen) answer = true;
                    }
                });

                return answer;
            }
        }
    }

    function isInitiator(initiator: OKRItemType['customer'], values: string[]): boolean {
        if (values.some(el => el == initiator?.login)) {
            return true;
        }
        return false;
    }

    function updateFilterList() {
        let filter = filters.filter(obj => obj.value.length > 0 && obj.key !== FilterKeys.status);
        let validCount = filter.length;
        
        let filterArr = [...list, ...childTaskList].filter(el => {
            const childTasks = childTaskList.filter((subtask: OKRItemType) => el.id === subtask.idParent);
            
            let valid = 0;
            filter.forEach(obj => {
                let includeTask = false;
                let includeChildTask = false;

                if (obj.key === FilterKeys.responsibles) {
                    includeTask = isIncludeResponsible(el.responsibles, obj.value);
                    includeChildTask = childTasks.length 
                        ? childTasks.reduce((res: Boolean, child: OKRItemType) => res || isIncludeResponsible(child.responsibles, obj.value), false)  
                        : false;
                    if (includeTask || includeChildTask) {
                        valid += 1;
                    }
                } else if (obj.key === FilterKeys.period) {
                    includeTask = isDueDate(el.dueDate, obj.value);
                    includeChildTask = childTasks.length 
                        ? childTasks.reduce((res: Boolean, child: OKRItemType) => res || isDueDate(child.dueDate, obj.value), false)  
                        : false;
                    if (includeTask || includeChildTask) {
                        valid += 1;
                    } 
                } else if (obj.key === FilterKeys.complexity) {
                    includeTask = isComplexity(el.complexity ?? 0, obj.value);
                    includeChildTask = childTasks.length 
                        ? childTasks.reduce((res: Boolean, child: OKRItemType) => res || isComplexity(child.complexity ?? 0, obj.value), false)  
                        : false;
                    if (includeTask || includeChildTask) {     
                        valid +=1;
                    }
                }  else if (obj.key === FilterKeys.checkin) {
                    includeTask = isCheckin(el, obj.value);
                    // includeChildTask = childTask ? isCheckin(childTask, obj.value) : false;
                    includeChildTask = childTasks.length 
                        ? childTasks.reduce((res: Boolean, child: OKRItemType) => res || isCheckin(child, obj.value), false)  
                        : false;
                    if (includeTask || includeChildTask) {
                        valid +=1;
                    }
                } else if (obj.key === FilterKeys.initiator) {
                    includeTask = isInitiator(el.customer, obj.value);
                    // includeChildTask = childTask ? isInitiator(childTask, obj.value) : false;
                    includeChildTask = childTasks.length 
                        ? childTasks.reduce((res: Boolean, child: OKRItemType) => res || isInitiator(child, obj.value), false)  
                        : false;
                    if (includeTask || includeChildTask) {
                        valid +=1;
                    }
                }
            });

            if (valid == validCount) return el;
        }).filter(el => el.title.includes(includesFilter)).map(el => el.id);
        setFilterList(filterArr);
    }

    useEffect(() => {
        if (includesFilter.trim().length > 0 || filters.some(el => el.value.length > 0)) {
            setAppliedFilter(true);
            updateFilterList();
        } else {
            setAppliedFilter(false);
            setFilterList([...list, ...childTaskList].map((el : OKRItemType) => el.id));
        }  
    }, [includesFilter, filters, list, childTaskList]);

    
    return {
        filterList, setIncludesFilter, applied, setFilterValues,
    }
}