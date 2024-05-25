import cl from './ListPanel.module.scss';
import { SearchInput } from '@/shared/ui/SearchInput';
import { useEffect, useState} from 'react';
import { Button } from '@/shared/ui/Button';
import { Dropdown, Form, OverlayTrigger } from 'react-bootstrap';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';

import { getDirectList } from '@/shared/api/User/UserAPI';
import IResponsible from '@/entities/user/types/IResponsible';
import { Badge } from '@/shared/ui/Badge';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';

type PanelProps = {
    setFilters: (key: string, value: string) => void;
    deleteFilters: (key: string, value?: string) => void;
    setIncludesValue: (value: string) => void;
}

function ListPanel ({setFilters, deleteFilters, setIncludesValue} : PanelProps) { 

    const [searchValue, setSearchValue] = useState('');
    const [responsiblesList, setResponsiblesList] = useState<IResponsible[]>([]);
    const [responsiblesError, setResponsiblesError] = useState<string | false>(false);
    const [responsiblesLoading, setResponsiblesLoading] = useState<boolean>(false);
    function changeSearchValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
        setIncludesValue(event.target.value);
    }

    const loadResponsiblesList = async () => {
        setResponsiblesError(false);
        setResponsiblesLoading(true);
        try {
            let response = await getDirectList({login: 'ivanovskiy_el'});  
            let responsibles = response.map(el => {
                el.checked = false;
                return el;
            });
            setResponsiblesList(responsibles);
        } catch(error) {
            setResponsiblesError('Ошибка загрузки данных')
        } finally {
            setResponsiblesLoading(false);
        }

    }

    useEffect(() => {
        //загружаю список ответственных ивановского
        loadResponsiblesList();
    }, []);

    return (
        <div className='mb-3 p-3' style={{
            background: '#FFF',
            borderRadius: '15px'
        }}>

            <div className='d-flex justify-content-between'>
                <div className='me-4'>
                    
                        <Dropdown align={'end'} className='me-3' autoClose="outside">
                            <CustomDropdownToggle>
                                <Button color="outline-light">
                                    По члену правления
                                    <i className="ri-filter-2-fill ms-2"></i>
                                    {responsiblesList.some(el => el.checked)}

                                </Button>
                                {responsiblesList.some(el => el.checked) && <Badge theme={bgThemeEnum.danger} borderRadius={`circle`} className={`${cl.btnFilterBg} p-0`}/>}
                            </CustomDropdownToggle>

                            <Dropdown.Menu className={`${cl.dropdownList}`}>
                                <div className={`${cl.dropDownScrollBlock}`}>
                                    {responsiblesList.length == 0 && responsiblesError && (
                                        <div className={`${cl.respErrorBlock}`}>{responsiblesError}</div>
                                    )}

                                    {responsiblesList.length == 0 && responsiblesLoading && (
                                        <div className={`${cl.respLoadingBlock}`}>Идет загрузка данных...</div>
                                    )}
                                    {responsiblesList.map(data => {
                                        return (
                                            <div key={data.login ? data.login : undefined} className={`${cl.dropItem}`}>
                                                <Form.Check type={'checkbox'} id={data.login ? data.login : undefined}
                                                >
                                                    <Form.Check.Input
                                                        checked={data.checked}
                                                        type={'checkbox'}
                                                        onChange={(e) => {
                                                            setResponsiblesList(preValue => preValue.map(el => {
                                                                if (el.login == data.login) el.checked = e.target.checked;
                                                                return el;
                                                            }));
                                                            if (e.target.checked) {
                                                                setFilters('responsibles', e.target.id);
                                                            } else {
                                                                deleteFilters('responsibles', e.target.id);
                                                            }
                                                        }}
                                                        className={cl.checkbox}
                                                    />
                                                    <Form.Check.Label className={cl.label}>
                                                        {data.fio}
                                                    </Form.Check.Label>
                                                </Form.Check>
                                            </div>
                                        )
                                    })}
                                </div>
                                <Dropdown.Divider className='mt-2 mb-0' />
                                <Button color={`clear`}
                                    className={cl.clearFilterBtn}
                                    onClick={() => {
                                        deleteFilters('responsibles');
                                        setResponsiblesList(preValue => preValue.map(el => {
                                            el.checked = false;
                                            return el;
                                        }));
                                    }}>
                                    Сбросить фильтры

                                </Button>

                            </Dropdown.Menu>

                        </Dropdown>


                </div>
                <div className='d-flex align-items-center justify-content-end' >
                    <div className='flex-grow-1' style={{ maxWidth: '400px' }}>
                        <SearchInput value={searchValue} changeFunc={changeSearchValue} placeholder='Поиск по задачам' />
                    </div>
                </div>
            </div>
            
        </div>
        
        
            
    )

}


export default ListPanel;