import { useCallback, useEffect, useMemo, useState } from 'react';
import './OKRDRTable.scss';
import { TableRow } from './TableRow/TableRow';
import IResponsible from '@/entities/user/types/IResponsible';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { getDirectList } from '@/shared/api/User/UserAPI';
import { getQuartals } from '../utils/getQuartals';
import { Spinner } from 'react-bootstrap';
import { FilterKeys, FiltersType } from '@/widgets/OKRList/types/FilterType';
import { SortKeysEnum, SortValueEnum, useSortList } from '../libs/hooks/useSortList';

type OKRDRTableProps = {
    filters?: FiltersType[],
}

export function OKRDRTable({filters}: OKRDRTableProps) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [drList, setDrList] = useState<IResponsible[]>([]);
    const [listLoading, setListLoading] = useState<boolean>(false);
    const [listError, setListError] = useState<boolean>(false);
    const quartals = useMemo(getQuartals, []);
    const {setSort, sortValues, sortArray} = useSortList();
    let filterValuesByResp = filters?.find(el => el.key == FilterKeys.responsibles)?.value??[];

    const getList = async () => {
        setListError(false);
        setListLoading(true);
        setDrList([]);
        if (currentUser.login) {
            try {
                let response = await getDirectList({login: currentUser.login});
                if (response) {
                    setDrList(sortArray([currentUser,...response]));
                } else {
                    setDrList([currentUser]);
                }
            } catch(error: any) {
                setListError(true);
            } finally {
                setListLoading(false);
            }
        } else {
            setListError(true);
        }
        
    }

    // для сортировки
    const handlerSortBtn = (key: SortKeysEnum, val: SortValueEnum | null = null) : void => {
        let sortValue = sortValues.find(el => el.key == key)?.value;
        let value =  sortValue == SortValueEnum.down || sortValue == null ? SortValueEnum.up : SortValueEnum.down;
        if (val) value = val;
        setSort(key, value);
    }

    const getRotateSortBtn = (key: SortKeysEnum) : string => {
        let value = sortValues.find(el => el.key == key)?.value;
        let rotate = value  ==  null || value == SortValueEnum.down ? 'rotate(0deg)' : 'rotate(-180deg)';
        return rotate;
    }
    // 

    // сортировать список если изменилась сортировка
    useEffect(() => {
        setDrList(prevList => sortArray(prevList));
    }, [sortValues])

    // при первичной загрузке, когда уже появились данные о текущем юзере загрузить список ответственных
    useEffect(() => {
        if (currentUser.fio) {
            getList();
        }
    }, [currentUser]);


    return (
        <div className={`dr-table position-relative`}>
            <div className='dr-table__header'>
                <div className='dr-table__header-descriptions'>
                    <div className='dr-table__cell'></div>
                    <div className='dr-table__cell'>Текущий квартал</div>
                    <div className='dr-table__cell'>Закрытые кварталы</div>
                </div>
                <div className="dr-table__cells-container">
                    <div className='dr-table__cell dr-table__cell-employee'>
                        Сотрудник
                        <svg 
                            role='button'
                            style={{
                                marginLeft: '10px',
                                verticalAlign: 'middle',
                                transition: 'all 0.3s',
                                transform: getRotateSortBtn(SortKeysEnum.name),
                            }}
                            onClick={() => handlerSortBtn(SortKeysEnum.name)}
                            width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                        </svg>
                    </div>

                    <div className='dr-table__cell'>
                        Статус
                    </div>

                    <div className='dr-table__cell'>
                        Звезд в работе
                        <svg 
                            role='button'
                            style={{
                                marginLeft: '10px',
                                verticalAlign: 'middle',
                                transition: 'all 0.3s',
                                transform: getRotateSortBtn(SortKeysEnum.complexityInWork),
                            }}
                            onClick={() => handlerSortBtn(SortKeysEnum.complexityInWork)}
                            width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                        </svg>
                    </div>

                    <div className='dr-table__cell'>
                        Закрытые звезды
                    </div>

                    <div className='dr-table__cell'>
                        Статус
                    </div>

                    <div className='dr-table__cell'>
                        {quartals[1].label}
                    </div>

                    <div className='dr-table__cell'>
                        {quartals[2].label}
                    </div>

                    <div className='dr-table__cell'>
                        {quartals[3].label}
                    </div>

                </div>
            </div>
            <div className="dr-table__body">
                {
                    drList && drList.length > 0 && (
                        drList.map(resp => {
                            let visible =  filterValuesByResp.length > 0 ? filterValuesByResp.some(login => login == resp.login) : true;  
                            return <TableRow isVisible={visible} key={resp.login} responsible={resp} quartals={quartals}/>
                        })
                    )
                }
            </div>
            {
                !listLoading 
                && !listError 
                && drList.length > 0 
                && filterValuesByResp.length > 0 
                && filterValuesByResp.every(login => drList.every(resp => resp.login !== login))
                && (
                    <div className={`table-alert mt-2 mb-2 d-flex flex-column align-items-center justify-content-center w-100 p-2`}>
                        <div className='fs-14 mt-1'>По выбранным фильтрам ничего не найдено</div>
                    </div>
                )
            }
            {
                listLoading && (
                    <div className={`table-alert mt-2 mb-2 d-flex flex-column align-items-center justify-content-center w-100 p-2`}>
                        <Spinner animation="border" size='sm' variant="primary" />
                        <div className='fs-14 mt-1'>Загружаем список сотрудников...</div>
                    </div>
                )
            }

            {
                listError && drList.length == 0 && (
                    <div className={`table-alert error mt-2 mb-2 d-flex flex-column align-items-center justify-content-center w-100 p-2`}>
                        <div className='fs-14 mt-1'>Ошибка, не смогли загрузить данные...</div>
                    </div>
                )
            }
        </div>
    )
}