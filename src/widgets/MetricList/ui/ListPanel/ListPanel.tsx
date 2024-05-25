import cl from './ListPanel.module.scss';

import {IconMeatball} from '@consta/icons/IconMeatball';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Button as CButton } from '@consta/uikit/Button';
import { useState, useContext} from 'react';
import { Button } from '@/shared/ui/Button';

type PanelProps = {
    changeCloseCollapse: (value: boolean) => void;
    setFilters: (key: string, value: string) => void;
    deleteFilters: (key: string, value?: string) => void;
    setIncludesValue: (value: string) => void;
}

function ListPanel ({changeCloseCollapse, setFilters, deleteFilters, setIncludesValue} : PanelProps) { 

    const [searchValue, setSearchValue] = useState('');
    // const { changeCloseCollapse } = useContext(CollapseContext);
    function changeSearchValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
        setIncludesValue(event.target.value);
    }

    return (
        <div className='d-flex flex-row justify-content-between mb-4'>
        
            <div className={cl.filterBlock}>
                {/* <div className='me-4'>
                    <Button color="outline-light" className='me-3'>
                        По статусу
                        <i className="ri-filter-2-fill ms-2"></i>
                    </Button>
                    <Button color="outline-light" className='me-3'>
                        Бейджи
                        <i className="ri-filter-2-fill ms-2 "></i>
                    </Button>
                    <Button color="outline-light">
                        По типу
                        <i className="ri-filter-2-fill ms-2 "></i>
                    </Button>
                </div> */}
                <SearchInput value={searchValue} className={cl.searchInput} changeFunc={changeSearchValue} placeholder='Поиск по задачам'/>
            </div>

            <div>
                <CButton view='clear' onClick={() => changeCloseCollapse(true)} iconLeft={IconMeatball} label={'Свернуть все'} className={`text-body-secondary`}/>
            </div>
        
        </div>
    )

}


export default ListPanel;