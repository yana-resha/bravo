import { useId, useState } from 'react';
import cl from './successBoardList.module.scss';
import { FilterSelect, FilterSelectType } from '@/shared/ui/FilterSelect';
import { Button } from '@/shared/ui/Button';
import { SuccessBoardItem } from '../../SuccessBoardItem';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';
import { Spinner } from 'react-bootstrap';

export const filterPeriodItems: FilterSelectType  [] = [
    {
        label: 'За последние 4 кв',
        id: 'За последние 4 кв',
    },
]

export const filterDirectItems: FilterSelectType  [] = [
    {
        label: 'Мои и моих Direct Report’ов',
        id: 'Мои и моих Direct Report’ов',
    },
]


type SuccessItemType = {
    title: string,
    fio: string,
    id: string,
}
export const successList: SuccessItemType[] = [
    {
        fio: 'Ковалев Роман',
        title: 'ПКБ',
        id: '1',
    },

    {
        fio: 'Радивил Сергей',
        title: 'Рейтинг НКР',
        id: '2',
    },

    {
        fio: 'Радивил Сергей',
        title: 'Рейтинг НКР',
        id: '3'

    },

    {
        fio: 'Радивил Сергей',
        title: 'Рейтинг НКР',
        id: '4'
    },

    {
        fio: 'Радивил Сергей',
        title: 'Рейтинг НКР',
        id: '5',
    },
]


export function SuccessBoardList () {

    const [filterPeriodValue, setFilterPeriodValue] = useState<FilterSelectType | null>(filterPeriodItems[0]);
    const [filterDirectValue, setFilterDirectValue] = useState<FilterSelectType | null>(filterDirectItems[0]);
    const [list, setList] = useState<SuccessItemType[]>([]);
    const [listError, setListError] = useState<string | boolean>(false);
    const [isLoadingList, setIsLoadingList] = useState<boolean>(false);

    const defaultLimit = 2;
    const [viewCount, setViewCount] = useState<number>(defaultLimit);
    const filterPeriodHandler = (value : FilterSelectType | null) => {
        setFilterPeriodValue(value);
    }
    const filterDirectHandler = (value : FilterSelectType | null) => {
        setFilterDirectValue(value);
    }
    
    return (

        <div className={cl.listBlock}>
            <div className={cl.listPanel}>
                <div className='d-flex flex-row align-items-center'>
                    <FilterSelect value={filterDirectValue} items={filterDirectItems} setValue={filterDirectHandler} className={`${cl.directSelect} me-3`}/>
                    <FilterSelect value={filterPeriodValue} items={filterPeriodItems} setValue={filterPeriodHandler} />
                </div>
                <div>
                    <Button color='clear'  className={cl.addBtn}>Поделиться успехом +</Button>
                </div>
            </div>
            <div className={cl.list}>
                {list.map((item, index) => {
                    if (index < viewCount) {
                        return <AnimationListItem index={index}><SuccessBoardItem key={item.id} {...item}/></AnimationListItem>
                    }
                })}
                {list?.length === 0 && !listError && !isLoadingList && (
                    <div
                        style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '14px',
                            padding: '20px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        Здесь еще нет успехов
                    </div>
                )}

                {isLoadingList && list.length == 0 && (
                    <div
                        className='d-flex flex-column align-items-center justify-content-center'
                        style={{
                            backgroundColor: 'rgba(13,110,253, 0.1)',
                            borderRadius: '14px',
                            padding: '15px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        
                        
                        <Spinner animation="border" variant="primary" />
                        <div className='fw-bold fs-16 mt-2'>Загружаем список успехов...</div>
                    </div>
                )}

                {!isLoadingList && list.length == 0 && listError && (
                    <div
                        className='d-flex flex-column align-items-center justify-content-center'
                        style={{
                            backgroundColor: '#E4B5C3',
                            borderRadius: '14px',
                            padding: '20px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        {listError}
                    </div>
                )}
            </div>

            {list.length > viewCount &&
            (
                <Button 
                className={cl.loadBtn} 
                color='outline-light' 
                onClick={() => setViewCount(prev =>  prev + defaultLimit)}
                >
                    Загрузить еще ({list.length - viewCount})
                </Button>
            )}
            
        </div>
    )
}