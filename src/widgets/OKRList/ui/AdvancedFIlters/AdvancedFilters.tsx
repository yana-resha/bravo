import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import IResponsible from "@/entities/user/types/IResponsible";
import { getDirectList } from "@/shared/api/User/UserAPI";
import { getFIOShort } from "@/shared/lib/getFIOShort"
import { Checkbox,MenuItem, Popover} from "@mui/material"
import { AnimatePresence,  motion } from "framer-motion";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { useEffect, useRef, useState } from "react";
import {  Spinner } from "react-bootstrap"
import { useSelector } from "react-redux";
import { FilterKeys, FiltersType } from "../../types/FilterType";
import moment from "moment";
import cl from './AdvancedFilters.module.scss';
import './AdvancedFilters.scss';
import { StarList } from "@/shared/ui/StarList";
import { OKRReduxListTypes } from "@/entities/task/model/slices/okrListSlice";
import { Input } from "@/shared/ui/Input";
import { Badge } from "@/shared/ui/Badge";
import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps";
import { Button } from "@/shared/ui/Button";
import { SearchInputTransform } from "@/shared/ui/SearchInputTransform";

type FilterType = {
    [key: string]: any,
    label : string,
    value: string,
    checked: boolean,
}

type StatusFilterType = FilterType & {
    value: OKRReduxListTypes,
}

type ComplexityFilterType = {
    [key: string]: any,
    label : string,
    value: number,
    checked: boolean,
}

type ResponsibleFilterType = IResponsible & {
    checked: boolean;
    notVisible?: boolean;
}

type AdvancedFiltersProps = {
    isShow: boolean,
    setFilterValues: (key: FilterKeys | null, value: FiltersType['value']) => void;
    setListStatus: (value: OKRReduxListTypes []) => void;
    setIncludesValue: (value: string) => void;
}


export function AdvancedFilters ({isShow, setFilterValues, setListStatus, setIncludesValue} : AdvancedFiltersProps) {


    // поиск по названию

    const [searchValue, setSearchValue] = useState('');
    function changeSearchValue(value: string) {
        setSearchValue(value);
        setIncludesValue(value);
    }
    // 
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    // селекты фильтры
    // периоды
    const [periods, setPeriods] = useState<FilterType []>([]);
    const [periodAnchor, setPeriodAnchor] = useState<HTMLDivElement | null>(null);

    // ответственные
    const [responsibles, setResponsibles] = useState<ResponsibleFilterType []>([]);
    const [isResponsibleLoading, setIsResponsibleLoading] = useState<boolean>(false);
    const [isResponsibleError, setIsResponsibleError] = useState<string | false>(false);
    const [responsibleAnchor, setResponsibleAnchor] = useState<HTMLDivElement | null>(null);
    const [respInput, setRespInput] = useState<string>("");
    // звезды
    const [complexity, setComplexity] = useState<ComplexityFilterType[]>([
        {
            label: '3.0',
            checked: false,
            value: 3,
        },
        {
            label: '2.0 - 2.5',
            checked: false,
            value: 2,
        },
        {
            label: '0.5 - 1.5',
            checked: false,
            value: 1,
        },
        {
            label: 'Без сложности',
            checked: false,
            value: 0,
        }, 
    ]);
    const [complexityAnchor, setComplexityAnchor] = useState<HTMLDivElement | null>(null);
    // CHECK IN
    const [checkin, setCheckin] = useState<FilterType[]>([{label: 'Просмотрено', value: 'Просмотрено', checked: false}, {label: 'Не просмотрено', value: 'Не просмотрено', checked: false}]);
    const [checkinAnchor, setCheckinAnchor] = useState<HTMLDivElement | null>(null);
    // СТАТУС

    const [status, setStatus] = useState<StatusFilterType[]>([
        {
            value: OKRReduxListTypes.inprogressList,
            label: 'В процессе',
            checked: false,
        },
        {
            value: OKRReduxListTypes.doneList,
            label: 'Выполненные',
            checked: false,
        },
        {
            value: OKRReduxListTypes.cancelList,
            label: 'Отмененные',
            checked: false,
        },
    ]);
    const [statusAnchor, setStatusAnchor] = useState<HTMLDivElement | null>(null);
    const [isDefaultStatus, setIsDefaultStatus] = useState<boolean>(true);

    useEffect(() => {
        setIsDefaultStatus(status.some(el => el.checked && el.value !== OKRReduxListTypes.inprogressList) ? false : true)
    }, [status]);

    // 
    const reduxData = useSelector((state: StoreReducerType) => state.okrList);
    const tasksList = reduxData[`${status.find(el => el.checked)?.value??OKRReduxListTypes.inprogressList}`].list;
    const tasksListLoading = reduxData[`${status.find(el => el.checked)?.value??OKRReduxListTypes.inprogressList}`].loading;
    const tasksListError = reduxData[`${status.find(el => el.checked)?.value??OKRReduxListTypes.inprogressList}`].error;
    // 

    const [showCheckBox, setShowCheckbox] = useState(true);
    const [checkOnlyMy, setCheckOnlyMy] = useState(false);
    const [checkOnlyDR, setCheckOnlyDR] = useState(false);
    const [checkOnlyICreator, setCheckOnlyICreator] = useState(false);
    // 

    // поиск сотрудника в выпадающем окне
    const responsibleSearch = (value: string) => {
        setRespInput(value);
        searchRespFilter(value);
    }

    const searchRespFilter = (value: string) => {
        setResponsibles(prevList => {
            return prevList.map(resp => {
                if (resp.fio?.includes(value)) {
                    resp.notVisible = false;
                } else {
                    resp.notVisible = true;
                }

                return resp;
            })
        })
    }
    const createPeriods = () => {
        let newValues = tasksList.map((el: OKRItemType) => {
            if (el.dueDate) {
                return moment(el.dueDate, 'DD.MM.YYYY').format('[q]Q-Y');
            } else {
                return null;
            }
        });
        let uniqValues = Array.from(new Set(newValues));
        let newList: FilterType[] = uniqValues.filter(el => el !== null).map(el => {
            let obj : FilterType  = {
                value: "-",
                label: 'Не установлено',
                checked: false,
            }
            if (el) {
                
                let date = moment(el, '[q]Q-Y').format('YYYY-MM-DD');
                obj.value = date;
                let label = `${moment(date).quarter()}кв. ${moment(date).format('YYYY')}`;
                obj.label = label;
                
            }
            return obj;
        });
        if (uniqValues.some(el => el == null)) newList.push({value: '-', label: 'Не установлено', checked: false})
        setPeriods(prevList => {
            return newList.map(el => {
                let prevValue = prevList.find(item => item.value == el.value);
                if (prevValue) {
                    el.checked = prevValue.checked;
                }
                return el;
            });
        });
    }
    
    // загрузка списка ответственных
    const loadResponsiblesList = async () => {
        setIsResponsibleLoading(true);
        setIsResponsibleError(false);
        setResponsibles([]);
        try {
            let response = (await getDirectList({login: currentUser.login}));
            let newList: ResponsibleFilterType [] = [];
            if (response) {
                newList = [
                    {...currentUser, checked: false}, 
                    ...response
                    .filter(el => el.fio)
                    .map(el => {
                    el.checked = false;
                    return el})
                ];
            } else {
                newList =[{...currentUser, checked: false}];
            }
            setResponsibles(prevList => {
                return newList.map((el) => {
                    let prevValue = prevList.find(item => item.value == el.value);
                    if (prevValue) {
                        el.checked = prevValue.checked;
                        el.notVisible = el.notVisible??false;
                    } else {
                        el.checked = false;
                        el.notVisible = false;
                    }
                    return el;
                });
            });
        } catch (error : any) {
            setIsResponsibleError(error)

        } finally {
            setIsResponsibleLoading(false);
        }
    }

    // когда меняется список задач, списки фильтров пересобираются
    useEffect(() => {
        if (!tasksListLoading) {
            createPeriods();
        }
        
    }, [tasksList]);

    useEffect(() => {
        if (currentUser.fio) {
            changeStatusValue(status.find(obj => obj.value == OKRReduxListTypes.inprogressList)??status[0]);
            loadResponsiblesList(); 
        }
    }, [currentUser])

    // функции для поповера

    const handleClick = (event: any, filterType: FilterKeys) => {
        if (filterType == FilterKeys.period) {
            setPeriodAnchor(event.currentTarget);
        } else if (filterType == FilterKeys.checkin) {
            setCheckinAnchor(event.currentTarget);
        } else if (filterType == FilterKeys.complexity) {
            setComplexityAnchor(event.currentTarget);
        } else if (filterType == FilterKeys.status) {
            setStatusAnchor(event.currentTarget);
        } else if (filterType == FilterKeys.responsibles) {
            setResponsibleAnchor(event.currentTarget)
        }
    };
    
    const handleClose = (filterType: FilterKeys) => {
        if (filterType == FilterKeys.period) {
            setPeriodAnchor(null);
        } else if (filterType == FilterKeys.checkin) {
            setCheckinAnchor(null);
        } else if (filterType == FilterKeys.complexity) {
            setComplexityAnchor(null);
        } else if (filterType == FilterKeys.status) {
            setStatusAnchor(null);
        } else if (filterType == FilterKeys.responsibles) {
            setResponsibleAnchor(null);
        }
    };
    // 

    function changeCheckinValue(value : FilterType | null, clearValues: boolean = false) {
        setCheckin(prev => {
            let newArr = prev.map(val => {
                if (value && clearValues == false) {
                    if (val.value == value.value) {
                        val.checked = !val.checked;
                    }
                } else if (clearValues) {
                    val.checked = false;
                }
                
                return val;
            });
            setFilterValues(FilterKeys.checkin, newArr.filter(el => el.checked == true).map(el => el.value));
            return newArr;
        });
    }
    function changeComplexityValue (value : ComplexityFilterType | null, clearValues: boolean = false) {
        setComplexity(prev => {
            let newArr = prev.map(val => {
                if (value && clearValues == false) {
                    if (val.value == value.value) {
                        val.checked = !val.checked;
                    }
                } else if (clearValues) {
                    val.checked = false;
                }
                
                return val;
            });
            setFilterValues(FilterKeys.complexity, newArr.filter(el => el.checked == true).map(el => el.value.toString()));
            return newArr;
        });
    }

    function changeResponsibleValue (value : ResponsibleFilterType| null, clearValues: boolean = false) {
        if (checkOnlyDR) showOnlyDR();
        setResponsibles(prev => {
            let newArr = prev.map(val => {
                if (value && clearValues == false) {
                    if (val.login == value.login) {
                        val.checked = !val.checked;
                    }
                } else if (clearValues) {
                    val.checked = false;
                }
                
                return val;
            });
            
            if (newArr.some(el => el.checked == true)) {
                clearOtherFilters(true);
            } else {
                clearOtherFilters(false);
            }
            setFilterValues(FilterKeys.responsibles, newArr.filter(el => el.checked == true).map(el => el.login??""));
            return newArr;
        });
        
        
    }

    function changeStatusValue (value : FilterType | null, clearValues: boolean = false) {
        setStatus(prev => {
            let newArr = prev.map(val => {
                if (value && clearValues == false) {
                    if (val.value == value.value) {
                        val.checked = !val.checked;
                    } else {
                        val.checked = false;
                    }
                } else if (clearValues) {
                    
                    val.checked = false;
                
                    
                }
                
                return val;
            });
            if (newArr.every(obj => obj.checked == false)) {
                newArr = newArr.map(el => {
                    if (el.value == OKRReduxListTypes.inprogressList) {
                        el.checked = true;
                    }
                    return el;
                })
            }
            setListStatus(newArr.filter(el => el.checked == true).map(el => el.value))
            return newArr;
        });
    };

    // 
    function svgTransformStyle(value: HTMLDivElement | null) : string {
        return value ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // установить выбранное значение, также можно все сбросить указав 2 параметр
    function changePeriodValue(value: FilterType | null, clearValues: boolean = false) {
        setPeriods(prev => {
            let newArr = prev.map(val => {
                if (value && clearValues == false) {
                    if (val.value == value.value) {
                        val.checked = !val.checked;
                    }
                } else if (clearValues) {
                    val.checked = false;
                }
                
                return val;
            });
            setFilterValues(FilterKeys.period, newArr.filter(el => el.checked == true).map(el => el.value));
            return newArr;
        });

        
    }


    // для отдельных чекбоксов
    const clearOtherFilters = (val : boolean) => {       
        setCheckOnlyMy(false); 
        if (val) {
            setShowCheckbox(false);
        } else {
            setShowCheckbox(true);
        }
    }
    const showICreatorTask = () => {
        setCheckOnlyICreator(prev => {
            if (prev == false) {
                setFilterValues(FilterKeys.initiator, [currentUser.login]);
            } else {
                setFilterValues(FilterKeys.initiator, []);
            }
            return !prev;
        })
    }
    const showOnlyMineTask = () => {
        if (checkOnlyDR) showOnlyDR();
        setCheckOnlyMy(prev => {
            if (prev == false) {
                setFilterValues(FilterKeys.responsibles, [currentUser.login]);
            } else {
                setFilterValues(FilterKeys.responsibles, []);
            }
            return !prev;
        })
    }

    const showOnlyDR = () => {
        const dr = responsibles.filter((responsible) => typeof responsible.login === 'string' && responsible.login !== currentUser.login)
            .map((responsible) => responsible.login as string);

        if (checkOnlyMy) showOnlyMineTask();
        setCheckOnlyDR(prev => {
            if (prev == false) {
                setFilterValues(FilterKeys.responsibles, (dr.length ? dr : ['Нет подходящий сотрудников']));
            } else {
                setFilterValues(FilterKeys.responsibles, []);
            }
            return !prev;
        })
    }
    
    return (
      
        <motion.div 
            className={`${cl.filters} d-flex flex-row justify-content-between align-items-start overflow-hidden`}>
            <AnimatePresence>
                { isShow && (
                    <motion.div 
                        initial={'hide'}
                        animate={'show'}
                        exit={'hide'}
                        transition={{ duration: 0.8 }}
                        variants={{
                            hide: {
                                opacity: 0,
                                y: -100,
                            },
                            show: {
                                opacity: 1,
                                y: 0,
                            }
                        }}
                        className="d-flex flex-row ms-2 justify-content-between"
                    >
                        <div className="advancedFilters">
                            <div className='advancedFilterItem'>
                                <div className={`${cl.filterHeaderContainer}`}>
                                    <div className={`${cl.filterHeader} ${periods.some(el => el.checked) ? cl.active : ''}`}
                                    onClick={(e) => handleClick(e, FilterKeys.period)}
                                    >
                                        Дэдлайн
                                        <svg 
                                        style={{
                                            transform: svgTransformStyle(periodAnchor),
                                            transition: 'all 0.3s',
                                        }}
                                        width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.7247 2.12336C16.1157 1.73414 16.1165 1.10098 15.7265 0.709149C15.3364 0.317322 14.7033 0.315209 14.3123 0.70443L15.7247 2.12336ZM8.00964 8.39054L7.30164 9.09528C7.48894 9.28345 7.74316 9.38965 8.00837 9.39054C8.27359 9.39142 8.52807 9.28691 8.71584 9.1L8.00964 8.39054ZM1.72655 0.66244C1.33653 0.270613 0.703366 0.268501 0.312349 0.657722C-0.0786688 1.04694 -0.0794718 1.68011 0.310555 2.07193L1.72655 0.66244ZM14.3123 0.70443L7.30343 7.68107L8.71584 9.1L15.7247 2.12336L14.3123 0.70443ZM8.71764 7.68579L1.72655 0.66244L0.310555 2.07193L7.30164 9.09528L8.71764 7.68579Z" fill="#0061FF"/>
                                        </svg>

                                        
                                        
                                    </div>
                                    {/* кнопка сброса */}
                                    <AnimatePresence>
                                        <motion.div
                                        onClick={() => changePeriodValue(null, true)}  
                                        className={cl.clearBtn}
                                        initial={'hide'}
                                        animate={periods.some(el => el.checked) ? 'show' : 'hide'}
                                        transition={{
                                            duration: 0.4,
                                        }}
                                        variants={{
                                        hide: {
                                            opacity: 0,
                                            display: 'none',
                                            x: -100,
                                        },
                                        show: {
                                            opacity: 1,
                                            display: 'flex',
                                            x: 0,
                                        }
                                        }}
                                        title="Сбросить фильтр"
                                        role="button"
                                        >
                                        <svg fill="#3f8cff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                {
                                    periods.some(el => el.checked) && (
                                        <div className={cl.valuesContainer}>
                                            {
                                                periods.map(el => {
                                                    if (el.checked) {
                                                        return (
                                                        
                                                        <Badge theme={bgThemeEnum.lightGrey} className={`m-1 d-flex flex-row align-items-center justify-content-between ${cl.bgValue}`}>
                                                            {el.label}
                                                            <Button 
                                                            onlyIcon 
                                                            onClick={() => changePeriodValue(el)}
                                                            title="Cбросить значение" 
                                                            className="ms-2">
                                                                <svg fill="#33383F" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                                            </Button>
                                                        </Badge>
                                                        )
                                                    }

                                                    return null;
                                                })
                                            }

                                        </div>
                                    )
                                }
                                <Popover
                                    className={`mt-2 myPopover`}
                                    id={periodAnchor ? 'period' : undefined}
                                    open={periodAnchor ? true : false}
                                    anchorEl={periodAnchor}
                                    onClose={() => handleClose(FilterKeys.period)}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                    
                                >
                                    {periods.length > 0 && (
                                        periods.map(obj => {

                                            let activeItem = obj.checked;

                                            return <MenuItem
                                                onClick={() => changePeriodValue(obj)}
                                                key={obj.value}
                                                value={obj.value}
                                                id={obj.value}
                                                className={`${cl.respItem} ${activeItem ? cl.selected : ""}`}
                                                style={{ backgroundColor: 'transparent' }}
                                            >
                                                <div className='d-flex flex-row'>
                                                    {obj.label}
                                                </div>
                                                <Checkbox
                                                    icon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                        </svg>
                                                    }
                                                    checkedIcon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                                        </svg>
                                                    }
                                                    style={{ marginLeft: 8, padding: '3px' }}
                                                    checked={activeItem}
                                                />
                                            </MenuItem>
                                        })
                                    )}

                                    { periods.length == 0 && tasksListLoading && (
                                        <div className={cl.menuAlert}>
                                            <Spinner size='sm' className='mb-2' animation="border" variant="primary" />
                                            Подождите идет загрузка...
                                        </div>
                                    )}
                                    { periods.length == 0 && !tasksListLoading && tasksListError && (
                                        <div className={cl.menuAlert}>
                                            Ошибка: не смогли загрузить список периодов
                                        </div>
                                    )}
                                    { periods.length == 0 && !tasksListLoading && !tasksListError && (
                                        <div className={cl.menuAlert}>
                                            Список периодов пуст
                                        </div>
                                    )}

                                </Popover>
                            </div>

                            <div className='advancedFilterItem'>
                                <div className={`${cl.filterHeaderContainer}`}>
                                <div className={`${cl.filterHeader} ${responsibles.some(el => el.checked) ? cl.active : ''}`}
                                onClick={(e) => handleClick(e, FilterKeys.responsibles)}
                                >
                                    Сотрудник
                                    <svg 
                                        style={{
                                            verticalAlign: 'middle',
                                            transform: svgTransformStyle(responsibleAnchor),
                                            transition: 'all 0.3s',
                                        }}
                                        width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.7247 2.12336C16.1157 1.73414 16.1165 1.10098 15.7265 0.709149C15.3364 0.317322 14.7033 0.315209 14.3123 0.70443L15.7247 2.12336ZM8.00964 8.39054L7.30164 9.09528C7.48894 9.28345 7.74316 9.38965 8.00837 9.39054C8.27359 9.39142 8.52807 9.28691 8.71584 9.1L8.00964 8.39054ZM1.72655 0.66244C1.33653 0.270613 0.703366 0.268501 0.312349 0.657722C-0.0786688 1.04694 -0.0794718 1.68011 0.310555 2.07193L1.72655 0.66244ZM14.3123 0.70443L7.30343 7.68107L8.71584 9.1L15.7247 2.12336L14.3123 0.70443ZM8.71764 7.68579L1.72655 0.66244L0.310555 2.07193L7.30164 9.09528L8.71764 7.68579Z" fill="#0061FF"/>
                                    </svg>
                                </div>

                                {/* кнопка сброса */}
                                <AnimatePresence>
                                    <motion.div
                                    onClick={() => changeResponsibleValue(null, true)}  
                                    className={cl.clearBtn}
                                    initial={'hide'}
                                    animate={responsibles.some(el => el.checked) ? 'show' : 'hide'}
                                    transition={{
                                        duration: 0.4,
                                    }}
                                    variants={{
                                    hide: {
                                        opacity: 0,
                                        display: 'none',
                                        x: -100,
                                    },
                                    show: {
                                        opacity: 1,
                                        display: 'flex',
                                        x: 0,
                                    }
                                    }}
                                    title="Сбросить фильтр"
                                    role="button"
                                    >
                                    <svg fill="#3f8cff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                    </motion.div>
                                </AnimatePresence>
                                </div>

                                {
                                    responsibles.some(el => el.checked) && (
                                        <div className={cl.valuesContainer}>
                                            {
                                                responsibles.map(el => {
                                                    if (el.checked) {
                                                        return (
                                                        
                                                        <Badge title={el.fio??"Нет имени"} theme={bgThemeEnum.lightGrey} className={`m-1 d-flex flex-row align-items-center justify-content-between ${cl.bgValue}`}>
                                                            {getFIOShort(el.fio??"")}
                                                            <Button 
                                                            onlyIcon 
                                                            onClick={() => changeResponsibleValue(el)}
                                                            title="Cбросить значение" 
                                                            className="ms-2">
                                                                <svg fill="#33383F" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                                            </Button>
                                                        </Badge>
                                                        )
                                                    }

                                                    return null;
                                                })
                                            }

                                        </div>
                                    )
                                }

                                <Popover
                                id={responsibleAnchor ? 'responsibles' : undefined}
                                className={`mt-2 myPopover responsiblePopover`}
                                open={responsibleAnchor ? true : false}
                                anchorEl={responsibleAnchor}
                                onClose={() => handleClose(FilterKeys.responsibles)}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                                >
                                    {responsibles.length == 0 && !isResponsibleLoading && !isResponsibleError && (
                                        <div className={cl.menuAlert}>
                                            Ваш список сотрудников пуст
                                        </div>
                                        )
                                    }

                                    {responsibles.length == 0 && !isResponsibleLoading && isResponsibleError && (
                                        <div className={cl.menuAlert}>
                                            Ошибка: не смогли загрузить список сотрудников
                                        </div>
                                        )
                                    }

                                    {responsibles.length == 0 && isResponsibleLoading && (
                                        <div className={cl.menuAlert}>
                                            <Spinner size='sm' className='mb-2' animation="border" variant="primary" />
                                                Подождите идет загрузка...
                                        </div>
                                        )
                                    }

                                    {
                                        responsibles.length > 0 && (
                                            <>
                                            <div className="m-2">
                                                <Input
                                                key={'kdkd'}
                                                size="sm"
                                                placeholder="Введите имя"
                                                value={respInput}
                                                type={'text'}
                                                handlerInput={(val) => responsibleSearch(val)}
                                                />
                                            </div>

                                            <div>
                                                {responsibles.map(obj => {
                                                    let activeItem = obj.checked;
                                                    if (obj.notVisible == true) {
                                                        return null;
                                                    } else {
                                                        return (
                                                            <MenuItem
                                                                onClick={() => changeResponsibleValue(obj)}
                                                                key={obj.login}
                                                                className={`${cl.respItem} ${activeItem ? cl.selected : ""}`}
                                                                style={{ backgroundColor: 'transparent' }}
                                                            >
                                                            
                                                                <div className='d-flex flex-row align-items-center'>
                                                                    <div className={cl.respAvatar}>
                                                                        <img src={obj.avatar ?? defaultAvatar} />
                                                                    </div>
                                                                    <span style={{lineHeight: 0}}>
                                                                        {obj.fio ? getFIOShort(obj.fio) : 'Нет имени'}
                                                                    </span>
                                                                </div>
                                                                <Checkbox
                                                                    icon={
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                                        </svg>
                                                                    }
                                                                    checkedIcon={
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                                                        </svg>
                                                                    }
                                                                    style={{ marginLeft: 8, padding: '3px' }}
                                                                    checked={activeItem}
                                                                />

                                                            </MenuItem>
                                                        )
                                                    }
                                                    
                                                   
                                                })}
                                                {
                                                    responsibles.every(resp => resp.notVisible == true) && (
                                                        <div className={`m-4 text-center fs-14`}>Ничего не найдено</div>
                                                    )
                                                }
                                            </div>
                                            </>
                                        )
                                    }

                                </Popover>

                            </div>

                            {/*
                            { responsibles.length > 1 && (
                                <div className='advancedFilterItem'>
                                    <div className={`${cl.filterHeaderContainer}`}>
                                        <div className={`${cl.filterHeader} ${checkin.some(el => el.checked) ? cl.active : ''}`}
                                        onClick={(e) => handleClick(e, FilterKeys.checkin)}
                                        >
                                            Check-in
                                            <svg 
                                                style={{
                                                    verticalAlign: 'middle',
                                                    transform: svgTransformStyle(checkinAnchor),
                                                    transition: 'all 0.3s',
                                                }}
                                                width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.7247 2.12336C16.1157 1.73414 16.1165 1.10098 15.7265 0.709149C15.3364 0.317322 14.7033 0.315209 14.3123 0.70443L15.7247 2.12336ZM8.00964 8.39054L7.30164 9.09528C7.48894 9.28345 7.74316 9.38965 8.00837 9.39054C8.27359 9.39142 8.52807 9.28691 8.71584 9.1L8.00964 8.39054ZM1.72655 0.66244C1.33653 0.270613 0.703366 0.268501 0.312349 0.657722C-0.0786688 1.04694 -0.0794718 1.68011 0.310555 2.07193L1.72655 0.66244ZM14.3123 0.70443L7.30343 7.68107L8.71584 9.1L15.7247 2.12336L14.3123 0.70443ZM8.71764 7.68579L1.72655 0.66244L0.310555 2.07193L7.30164 9.09528L8.71764 7.68579Z" fill="#0061FF"/>
                                            </svg>
                                        </div>

                                        <AnimatePresence>
                                            <motion.div
                                            onClick={() => changeCheckinValue(null, true)}  
                                            className={cl.clearBtn}
                                            initial={'hide'}
                                            animate={checkin.some(el => el.checked) ? 'show' : 'hide'}
                                            transition={{
                                                duration: 0.4,
                                            }}
                                            variants={{
                                            hide: {
                                                opacity: 0,
                                                display: 'none',
                                                x: -100,
                                            },
                                            show: {
                                                opacity: 1,
                                                display: 'flex',
                                                x: 0,
                                            }
                                            }}
                                            title="Сбросить фильтр"
                                            role="button"
                                            >
                                            <svg fill="#3f8cff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    {
                                        checkin.some(el => el.checked) && (
                                            <div className={cl.valuesContainer}>
                                                {
                                                    checkin.map(el => {
                                                        if (el.checked) {
                                                            return (
                                                            <Badge theme={bgThemeEnum.lightGrey} className={`m-1 d-flex flex-row align-items-center justify-content-between ${cl.bgValue}`}>
                                                                {el.label}
                                                                <Button 
                                                                onlyIcon 
                                                                onClick={() => changeCheckinValue(el)}
                                                                title="Cбросить значение" 
                                                                className="ms-2">
                                                                    <svg fill="#33383F" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                                                </Button>
                                                            </Badge>
                                                            )
                                                        }

                                                        return null;
                                                    })
                                                }

                                            </div>
                                        )
                                    }
                                    <Popover
                                    id={checkinAnchor ? 'checkin' : undefined}
                                    className={`mt-2 myPopover`}
                                    open={checkinAnchor ? true : false}
                                    anchorEl={checkinAnchor}
                                    onClose={() => handleClose(FilterKeys.checkin)}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                    >
                                        {
                                            checkin.map(obj => {
                                                let activeItem: boolean = obj.checked;
                                                return <MenuItem
                                                    onClick={() => changeCheckinValue(obj)}
                                                    key={obj.value}
                                                    value={obj.value}
                                                    id={obj.value}
                                                    className={`${cl.respItem} ${activeItem ? cl.selected : ""}`}
                                                    style={{ backgroundColor: 'transparent' }}
                                                >
                                                    <div className='d-flex flex-row'>
                                                        {obj.label}
                                                    </div>
                                                    <Checkbox
                                                        icon={
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                            </svg>
                                                        }
                                                        checkedIcon={
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                                            </svg>
                                                        }
                                                        style={{ marginLeft: 8, padding: '3px' }}
                                                        checked={activeItem}
                                                    />
                                                </MenuItem>
                                            })
                                        }
                                    </Popover>
                                </div>
                            )}
                            */}

                            <div className='advancedFilterItem'>
                                <div className={`${cl.filterHeaderContainer}`}>
                                    <div 
                                    className={`${cl.filterHeader} ${complexity.some(el => el.checked) ? cl.active : ''}`}
                                    onClick={(e) => handleClick(e, FilterKeys.complexity)}
                                    >
                                        Сложность
                                        <svg 
                                            style={{
                                                verticalAlign: 'middle',
                                                transform: svgTransformStyle(complexityAnchor),
                                                transition: 'all 0.3s',
                                            }}
                                            width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7247 2.12336C16.1157 1.73414 16.1165 1.10098 15.7265 0.709149C15.3364 0.317322 14.7033 0.315209 14.3123 0.70443L15.7247 2.12336ZM8.00964 8.39054L7.30164 9.09528C7.48894 9.28345 7.74316 9.38965 8.00837 9.39054C8.27359 9.39142 8.52807 9.28691 8.71584 9.1L8.00964 8.39054ZM1.72655 0.66244C1.33653 0.270613 0.703366 0.268501 0.312349 0.657722C-0.0786688 1.04694 -0.0794718 1.68011 0.310555 2.07193L1.72655 0.66244ZM14.3123 0.70443L7.30343 7.68107L8.71584 9.1L15.7247 2.12336L14.3123 0.70443ZM8.71764 7.68579L1.72655 0.66244L0.310555 2.07193L7.30164 9.09528L8.71764 7.68579Z" fill="#0061FF"/>
                                        </svg>
                                    </div>
                                        
                                    {/* кнопка сброса */}
                                    <AnimatePresence>
                                        <motion.div
                                        onClick={() => changeComplexityValue(null, true)}  
                                        className={cl.clearBtn}
                                        initial={'hide'}
                                        animate={complexity.some(el => el.checked) ? 'show' : 'hide'}
                                        transition={{
                                            duration: 0.4,
                                        }}
                                        variants={{
                                        hide: {
                                            opacity: 0,
                                            display: 'none',
                                            x: -100,
                                        },
                                        show: {
                                            opacity: 1,
                                            display: 'flex',
                                            x: 0,
                                        }
                                        }}
                                        title="Сбросить фильтр"
                                        role="button"
                                        >
                                        <svg fill="#3f8cff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                {
                                    complexity.some(el => el.checked) && (
                                        <div className={cl.valuesContainer}>
                                            {
                                                complexity.map(el => {
                                                    if (el.checked) {
                                                        return (
                                                        <Badge theme={bgThemeEnum.lightGrey} className={`m-1 d-flex flex-row align-items-center justify-content-between ${cl.bgValue}`}>
                                                            {
                                                                el.value > 0 ?
                                                                <StarList value={el.value} status={"default"}></StarList>
                                                                : 
                                                                el.label
                                                            }
                                                            
                                                            <Button 
                                                            onlyIcon 
                                                            onClick={() => changeComplexityValue(el)}
                                                            title="Cбросить значение" 
                                                            className="ms-2">
                                                                <svg fill="#33383F" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                                            </Button>
                                                        </Badge>
                                                        )
                                                    }

                                                    return null;
                                                })
                                            }

                                        </div>
                                    )
                                }

                                <Popover
                                    className={`mt-2 myPopover`}
                                    id={complexityAnchor ? 'complexity' : undefined}
                                    open={complexityAnchor ? true : false}
                                    anchorEl={complexityAnchor}
                                    onClose={() => handleClose(FilterKeys.complexity)}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                    
                                >
                                    {
                                        complexity.map(obj => {
                                            let activeItem = obj.checked;
                                            return <MenuItem
                                                key={obj.value}
                                                onClick={() => changeComplexityValue(obj)}
                                                className={`${cl.respItem} ${activeItem ? cl.selected : ""}`}
                                                style={{ backgroundColor: 'transparent' }}
                                            >
                                                <div className='d-flex flex-row'>
                                                    {
                                                        <>
                                                        {
                                                            obj.value > 0 && (
                                                                <StarList value={obj.value} status={"default"} ></StarList>
                                                            )
                                                        }
                                                        
                                                        <span className={cl.complexityHint}>
                                                            {
                                                                obj.label
                                                            }
                                                        </span>
                                                        </>
                                                    }
                                                </div>
                                                <Checkbox
                                                    icon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                        </svg>
                                                    }
                                                    checkedIcon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                                        </svg>
                                                    }
                                                    style={{ marginLeft: 8, padding: '3px' }}
                                                    checked={activeItem}
                                                />
                                            </MenuItem>
                                        })
                                    }

                                </Popover>
                                
                            </div>

                            <div className='advancedFilterItem'>
                                <div className={`${cl.filterHeaderContainer}`}>
                                    <div 
                                    className={`${cl.filterHeader} ${!isDefaultStatus ? cl.active : ''}`}
                                    onClick={(e) => handleClick(e, FilterKeys.status)}
                                    >
                                        Статус
                                        <svg 
                                            style={{
                                                verticalAlign: 'middle',
                                                transform: svgTransformStyle(statusAnchor),
                                                transition: 'all 0.3s',
                                            }}
                                            width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7247 2.12336C16.1157 1.73414 16.1165 1.10098 15.7265 0.709149C15.3364 0.317322 14.7033 0.315209 14.3123 0.70443L15.7247 2.12336ZM8.00964 8.39054L7.30164 9.09528C7.48894 9.28345 7.74316 9.38965 8.00837 9.39054C8.27359 9.39142 8.52807 9.28691 8.71584 9.1L8.00964 8.39054ZM1.72655 0.66244C1.33653 0.270613 0.703366 0.268501 0.312349 0.657722C-0.0786688 1.04694 -0.0794718 1.68011 0.310555 2.07193L1.72655 0.66244ZM14.3123 0.70443L7.30343 7.68107L8.71584 9.1L15.7247 2.12336L14.3123 0.70443ZM8.71764 7.68579L1.72655 0.66244L0.310555 2.07193L7.30164 9.09528L8.71764 7.68579Z" fill="#0061FF"/>
                                        </svg>
                                    </div>

                                    {/* кнопка сброса */}
                                    <AnimatePresence>
                                        <motion.div
                                        onClick={() => changeStatusValue(null, true)}  
                                        className={cl.clearBtn}
                                        initial={'hide'}
                                        animate={!isDefaultStatus ? 'show' : 'hide'}
                                        transition={{
                                            duration: 0.4,
                                        }}
                                        variants={{
                                        hide: {
                                            opacity: 0,
                                            display: 'none',
                                            x: -100,
                                        },
                                        show: {
                                            opacity: 1,
                                            display: 'flex',
                                            x: 0,
                                        }
                                        }}
                                        title="Сбросить фильтр"
                                        role="button"
                                        >
                                        <svg fill="#3f8cff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {
                                    status.some(el => el.checked) && (
                                        <div className={cl.valuesContainer}>
                                            {
                                                status.map(el => {
                                                    if (el.checked) {
                                                        return (
                                                        <Badge theme={bgThemeEnum.lightGrey} className={`m-1 d-flex flex-row align-items-center justify-content-between ${cl.bgValue}`}>
                                                            {el.label}
                                                            {
                                                                el.value !== OKRReduxListTypes.inprogressList && 
                                                                <Button 
                                                                onlyIcon 
                                                                onClick={() => changeStatusValue(el)}
                                                                title="Cбросить значение" 
                                                                className="ms-2">
                                                                    <svg fill="#33383F" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                                                                </Button>
                                                            }
                                                            
                                                        </Badge>
                                                        )
                                                    }

                                                    return null;
                                                })
                                            }

                                        </div>
                                    )
                                }

                                <Popover
                                id={statusAnchor ? 'status' : undefined}
                                className={`mt-2 myPopover`}
                                open={statusAnchor ? true : false}
                                anchorEl={statusAnchor}
                                onClose={() => handleClose(FilterKeys.status)}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                                >
                                    {
                                        status.map(obj => {
                                            let activeItem: boolean = obj.checked;
                                            return <MenuItem
                                                onClick={() => changeStatusValue(obj)}
                                                key={obj.value}
                                                value={obj.value}
                                                id={obj.value}
                                                className={`${cl.respItem} ${activeItem ? cl.selected : ""}`}
                                                style={{ backgroundColor: 'transparent' }}
                                            >
                                                <div className='d-flex flex-row'>
                                                    {obj.label}
                                                </div>
                                                <Checkbox
                                                    icon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                        </svg>
                                                    }
                                                    checkedIcon={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                                        </svg>
                                                    }
                                                    style={{ marginLeft: 8, padding: '3px' }}
                                                    checked={activeItem}
                                                />
                                            </MenuItem>
                                        })
                                        
                                    }
                                </Popover>
                                
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='d-flex flex-row align-items-center justify-content-end flex-wrap'>
                <div 
                className="me-2"
                style={{
                    width: '200px',
                }}
                >
                    <SearchInputTransform
                    inputValue={searchValue}
                    handlerInput={changeSearchValue} 
                    />
                </div>

                <div className='d-flex align-items-center'>
                    <div 
                        key={'creator'}
                        className={`${cl.checkboxContainer} me-4`} 
                        onClick={() => showICreatorTask()}
                    >
                        Я - Заказчик
                        <Checkbox
                            key={'creator'}
                            id='creator'
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                </svg>
                            }
                            checkedIcon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                </svg>
                            }
                            style={{ marginLeft: 8, padding: '3px' }}
                            checked={checkOnlyICreator}
                        />

                    </div>

                    <motion.div 
                    animate={showCheckBox ? 'show' : 'hide'}
                    initial={'hide'}
                    key={'mine'}
                    transition={{ duration: 0.8 }}
                    variants={{
                        show:{
                            opacity: 1,
                        },
                        hide: {
                            opacity: 0
                        }
                    }}
                    className={`${cl.checkboxContainer} me-4`} onClick={() => showOnlyMineTask()}>
                        Я - Владелец
                        <Checkbox
                            id='mine'
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                </svg>
                            }
                            checkedIcon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                </svg>
                            }
                            style={{ marginLeft: 8, padding: '3px' }}
                            checked={checkOnlyMy}
                        />
                    </motion.div>

                    <motion.div 
                    animate={showCheckBox ? 'show' : 'hide'}
                    initial={'hide'}
                    key={'mine'}
                    transition={{ duration: 0.8 }}
                    variants={{
                        show:{
                            opacity: 1,
                        },
                        hide: {
                            opacity: 0
                        }
                    }}
                    className={cl.checkboxContainer} onClick={() => showOnlyDR()}>
                        Задачи моих DR
                        <Checkbox
                            id='mine'
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                </svg>
                            }
                            checkedIcon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6ZM6 4H18L18.1493 4.00549C19.1841 4.08183 20 4.94564 20 6V18L19.9945 18.1493C19.9182 19.1841 19.0544 20 18 20H6L5.85074 19.9945C4.81588 19.9182 4 19.0544 4 18V6L4.00549 5.85074C4.08183 4.81588 4.94564 4 6 4Z" fill="#0A1629" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.3638 7.87943C18.7264 8.24206 18.7523 8.81391 18.4415 9.20643L18.3638 9.29365L11.2927 16.3647C10.9301 16.7273 10.3583 16.7532 9.96575 16.4424L9.87853 16.3647L5.63589 12.1221C5.24536 11.7316 5.24536 11.0984 5.63589 10.7079C5.99852 10.3452 6.57036 10.3193 6.96288 10.6302L7.0501 10.7079L10.5859 14.2425L16.9496 7.87943C17.3122 7.51681 17.8841 7.4909 18.2766 7.80173L18.3638 7.87943Z" fill="#3F8CFF" />
                                </svg>
                            }
                            style={{ marginLeft: 8, padding: '3px' }}
                            checked={checkOnlyDR}
                        />
                    </motion.div>
                </div>

            </div>
        </motion.div>
    )
}
