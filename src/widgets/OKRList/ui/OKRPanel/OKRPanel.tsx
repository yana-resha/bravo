/* Hooks */
import { useState} from 'react';

/* Style */
import cl from './OKRPanel.module.scss';
import './OKRPanel.scss';

/* Components */
import { Button } from '@/shared/ui/Button';
import { AdvancedFilters } from '../AdvancedFIlters/AdvancedFilters';
import { OKRReduxListTypes } from '@/entities/task/model/slices/okrListSlice';
import { FilterKeys, FiltersType } from '../../types/FilterType';
import { CreateOKRTaskModal } from '@/features/CreateOKRTaskModal';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { StarList } from '@/shared/ui/StarList';


type PanelProps = {
    setIncludesValue: (value: string) => void;
    setListStatus: (value: OKRReduxListTypes[]) => void;
    setFilterValues: (key: FilterKeys | null, value: FiltersType['value']) => void;
}

function ListPanel ({setIncludesValue, setListStatus, setFilterValues} : PanelProps) { 
    const [showFilters, setShowFilters] = useState<boolean>(true);
    // создать задачу открыть модальное окно
    const [modalCreateTask, setModalCreateTask] = useState(false);
    // поиск по названию
    const [showBlock, setShowBlock] = useState(false);
    return (
        <>
            {modalCreateTask && <CreateOKRTaskModal closeFunc={() => setModalCreateTask(false)}/>}
            <div className='firstRowContainer mb-3'>
                <div>
                {
                    showBlock &&
                    <div className='userBlock__navigation-block userBlock__block'>
                        <div className='d-flex flex-row align-items-center'>
                            <img src={defaultAvatar} alt="" className='rounded-circle avatar-sm me-2' />
                            <div className='blueUnderlineText fw-bold fs-18'>
                                Саночкин Дмитрий
                            </div>
                        </div>
                        <div>
                            <Button onlyIcon>
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.70711 4.31891C9.31658 3.92912 8.68342 3.93031 8.29289 4.32157C7.90237 4.71283 7.90237 5.34599 8.29289 5.73578L9.70711 4.31891ZM16 12.0142L16.7071 12.72C16.8946 12.5321 17 12.2775 17 12.0123C17 11.7471 16.8946 11.4929 16.7071 11.3057L16 12.0142ZM8.29289 18.3216C7.90237 18.7128 7.90237 19.346 8.29289 19.7358C8.68342 20.1256 9.31658 20.1244 9.70711 19.7331L8.29289 18.3216ZM8.29289 5.73578L15.2929 12.7226L16.7071 11.3057L9.70711 4.31891L8.29289 5.73578ZM15.2929 11.3084L8.29289 18.3216L9.70711 19.7331L16.7071 12.72L15.2929 11.3084Z" fill="#0061FF" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                    
                }
                </div>
                <div></div>
                <div className='d-flex flex-row justify-content-end'>
                    {/* <div className='me-2 d-flex align-items-center flex-nowrap' role='button' onClick={() => setShowBlock(!showBlock)}>
                        {showBlock ? 'Скрыть' : 'Показать'} статичные блоки
                    </div> */}
                    <Button color='primary' onClick={() => { setModalCreateTask(!modalCreateTask) }} className={cl.addBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Добавить задачу
                    </Button>
                </div>
            </div>

            {showBlock && 
            <div className='secondRowContainer mb-4'>
                <div className='userBlock__block userBlock_info-block'>
                    <div className='userBlock__left-border userBlock__border-success me-2'/>
                    <div className='flex-grow-1'>
                        <div className='userBlock__block-title'>
                            <svg className='me-2' width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.17724 4.85205L6.34182 0.57668C6.22524 0.400804 6.0603 0.255245 5.86306 0.154183C5.66583 0.0531218 5.44302 2.51797e-06 5.21635 0H0.657453C0.126299 0 -0.184601 0.540684 0.119736 0.934414L4.68356 6.83332C5.90255 5.80279 7.45294 5.09549 9.17724 4.85205ZM20.3425 0H15.7836C15.3226 0 14.8952 0.218945 14.6582 0.57668L11.8228 4.85205C13.5471 5.09549 15.0975 5.80279 16.3164 6.83295L20.8803 0.934414C21.1846 0.540684 20.8737 0 20.3425 0ZM10.5 5.9375C6.51327 5.9375 3.28123 8.86172 3.28123 12.4688C3.28123 16.0758 6.51327 19 10.5 19C14.4867 19 17.7188 16.0758 17.7188 12.4688C17.7188 8.86172 14.4867 5.9375 10.5 5.9375ZM14.2948 11.7733L12.739 13.1449L13.107 15.0827C13.1726 15.4301 12.7682 15.6954 12.424 15.5314L10.5 14.6166L8.57636 15.5314C8.23183 15.6965 7.82783 15.4297 7.89345 15.0827L8.26136 13.1449L6.70563 11.7733C6.42591 11.5269 6.58054 11.0968 6.96608 11.0463L9.11654 10.7628L10.0775 8.99939C10.1641 8.84057 10.3314 8.76227 10.4992 8.76227C10.6678 8.76227 10.8363 8.84168 10.9229 8.99939L11.8839 10.7628L14.0343 11.0463C14.4199 11.0968 14.5745 11.5269 14.2948 11.7733Z" fill="#0AC947" />
                            </svg>
                            Закрытые звезды с <Button onlyIcon className='blueUnderlineText fw-bold'>начала квартала</Button>
                        </div>

                        <div className='d-flex flex-row align-items-center justify-content-between'>
                            <div className='d-flex flex-row align-items-center'>
                                <StarList status='blue' value={3} classList='me-2'/>
                                <StarList status='blue' value={2} classList='me-2'/>
                                <StarList status='blue' value={2} classList='me-2'/>
                                <StarList status='blue' value={1} classList='me-2'/>
                            </div>

                            <div className='userBlock__sumComplexity'>
                                <StarList status='blue' value={1} classList='me-3'/>
                                8
                            </div>
                        </div>
                    </div>
                </div>
                <div className='userBlock__block userBlock_info-block'>
                    <div className='userBlock__left-border userBlock__border-primary me-2'/>
                    <div className='flex-grow-1'>
                        <div className='userBlock__block-title'>
                            <svg className='me-2' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.3125 1.3125C8.3125 2.03738 7.72488 2.625 7 2.625C6.27512 2.625 5.6875 2.03738 5.6875 1.3125C5.6875 0.587617 6.27512 0 7 0C7.72488 0 8.3125 0.587617 8.3125 1.3125ZM7 11.375C6.27512 11.375 5.6875 11.9626 5.6875 12.6875C5.6875 13.4124 6.27512 14 7 14C7.72488 14 8.3125 13.4124 8.3125 12.6875C8.3125 11.9626 7.72488 11.375 7 11.375ZM12.6875 5.6875C11.9626 5.6875 11.375 6.27512 11.375 7C11.375 7.72488 11.9626 8.3125 12.6875 8.3125C13.4124 8.3125 14 7.72488 14 7C14 6.27512 13.4124 5.6875 12.6875 5.6875ZM2.625 7C2.625 6.27512 2.03738 5.6875 1.3125 5.6875C0.587617 5.6875 0 6.27512 0 7C0 7.72488 0.587617 8.3125 1.3125 8.3125C2.03738 8.3125 2.625 7.72488 2.625 7ZM2.97834 9.70916C2.25345 9.70916 1.66584 10.2968 1.66584 11.0217C1.66584 11.7465 2.25345 12.3342 2.97834 12.3342C3.70322 12.3342 4.29084 11.7465 4.29084 11.0217C4.29084 10.2968 3.70319 9.70916 2.97834 9.70916ZM11.0217 9.70916C10.2968 9.70916 9.70916 10.2968 9.70916 11.0217C9.70916 11.7465 10.2968 12.3342 11.0217 12.3342C11.7465 12.3342 12.3342 11.7465 12.3342 11.0217C12.3342 10.2968 11.7465 9.70916 11.0217 9.70916ZM2.97834 1.66584C2.25345 1.66584 1.66584 2.25345 1.66584 2.97834C1.66584 3.70322 2.25345 4.29084 2.97834 4.29084C3.70322 4.29084 4.29084 3.70322 4.29084 2.97834C4.29084 2.25345 3.70319 1.66584 2.97834 1.66584Z" fill="#3F8CFF" />
                            </svg>
                            Звезд в работе
                        </div>
                        
                        <div>
                            <div className='d-flex flex-row align-items-center justify-content-between'>
                                <div className='d-flex flex-row align-items-center'>
                                    <StarList status='success' value={3} classList='me-2'/>
                                    <StarList status='success' value={1} classList='me-2'/>
                                    <StarList status='warning' value={3} classList='me-2'/>
                                    <StarList status='danger' value={1} classList='me-2'/>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <Button onlyIcon className='blueUnderlineText me-2'>+ 2 за месяц</Button>
                                    <div className='userBlock__sumComplexity'>
                                        <StarList status='blue' value={1} classList='me-1'/>
                                        <span>7 / 10</span>
                                        <svg
                                        className='position-relative'
                                        style={{top: '-10px'}} 
                                        width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <rect width="19" height="20" fill="url(#pattern0_3973_156284)"/>
                                            <defs>
                                            <pattern id="pattern0_3973_156284" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlinkHref="#image0_3973_156284" transform="matrix(0.01 0 0 0.0095 0 0.025)"/>
                                            </pattern>
                                            <image id="image0_3973_156284" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                            <div className='userBlock__explanation'>
                                <svg 
                                style={{verticalAlign: 'sub'}}
                                className='me-1' width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <rect width="19" height="20" fill="url(#pattern0_3973_156284)"/>
                                    <defs>
                                    <pattern id="pattern0_3973_156284" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlinkHref="#image0_3973_156284" transform="matrix(0.01 0 0 0.0095 0 0.025)"/>
                                    </pattern>
                                    <image id="image0_3973_156284" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
                                    </defs>
                                </svg>
                                Следует стремиться к 10 звездам в работе
                            </div>
                        </div>
                        

                        

                    </div>
                </div>
                <div className='userBlock__block userBlock_info-block'>

                    <div className='userBlock__left-border userBlock__border-warning me-2'/>
                    <div className='flex-grow-1'>
                        <div className='userBlock__block-title mb-2'>
                            Прогресс
                        </div>
                        <div className='d-flex flex-row align-items-center justify-content-between'>
                            <div className='d-flex flex-row align-items-center me-2'>
                                <div className='userBlock__value me-3'>78%</div>
                                <div
                                style={{color: '#0AC947'}}
                                >
                                    Рост +3% 
                                    <Button onlyIcon className='blueUnderlineText ms-1'>за неделю</Button>
                                </div>
                            </div>

                            <div> 
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <rect width="50" height="50" fill="url(#pattern0_3973_156266)"/>
                                <defs>
                                <pattern id="pattern0_3973_156266" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlinkHref="#image0_3973_156266" transform="scale(0.0111111)"/>
                                </pattern>
                                <image id="image0_3973_156266" width="90" height="90" xlinkHref="data:image/png;base64,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"/>
                                </defs>
                                </svg>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            }

            <div className='mb-3'>
                <AdvancedFilters 
                    setIncludesValue={setIncludesValue}
                    isShow={showFilters}
                    setListStatus={setListStatus} 
                    setFilterValues={setFilterValues}
                /> 
            </div>
        </>
    )
}

export default ListPanel;

{/* <SearchInput 
                                className={`${cl.searchInput}`} 
                                value={searchValue} 
                                changeFunc={changeSearchValue} 
                                placeholder='Поиск по названию'
                            /> */}