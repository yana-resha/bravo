import { Modal } from "react-bootstrap";
import cl from './ExpressFiltersModal.module.scss';
import { Button } from "@/shared/ui/Button";
import React, { useState } from "react";
import { FilterKeys } from "@/widgets/OKRList/types/FilterType";
import { tabTypes, tabsList } from "../data/tabsList";
import { AnimationListItem } from "@/shared/ui/AnimationListItem";
import { motion } from "framer-motion";
import {CheckinContent} from './contents/CheckinContent';


type ModalProps = {
    closeFunc: () => void;
}



export function ExpressFiltersModal({closeFunc} : ModalProps) {

    const [tabs, setTabs] = useState<tabTypes[]>(tabsList);

    function changeActiveTab (id: tabTypes['id']) : void {
        setTabs(prevArr => {
            return prevArr.map(el => {
                if (el.id == id) {
                    el.active = true;
                } else {
                    el.active = false;
                }
                return el;
            })
        })
    }

    return (
        <Modal
                backdrop="static"
                className="taskModal"
                show={true}
                onHide={closeFunc}
                centered
                dialogClassName={cl.taskModalDialog}
                contentClassName={`${cl.taskModal}`}
                scrollable={true}
            
        >
            <div className='d-flex flex-row justify-content-between mb-3'>
                <div className={cl.modalTitle}>Настройка экспресс фильтра</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>
            <div className={cl.modalDescription}>
                <div className="me-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 11C12.5128 11 12.9355 11.386 12.9933 11.8834L13 12V16C13 16.5523 12.5523 17 12 17C11.4872 17 11.0645 16.614 11.0067 16.1166L11 16V12C11 11.4477 11.4477 11 12 11ZM13.01 8C13.01 7.44772 12.5623 7 12.01 7L11.8834 7.00673C11.386 7.06449 11 7.48716 11 8C11 8.55228 11.4477 9 12 9L12.1266 8.99327C12.624 8.93551 13.01 8.51284 13.01 8Z" fill="#3F8CFF"/>
                    </svg>
                </div>
                <div>
                    Каждый из эксрпесс фильтров вы можете настроить персонально под себя. Выберите один компонент из представленных ниже групп фильтров
                </div>
            </div>

            <Modal.Body>
                <div className={cl.currentValueContainer}>
                    <div className={cl.currentValueTitle}>Действующий экспресс фильтр:</div>
                        <div className={cl.currentValue}>
                        <span className={cl.nameValue}>
                            <svg className="me-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 11.925C1 5.8875 5.8875 1 11.925 1" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M22.8507 11.9258C22.8507 17.9633 17.9632 22.8508 11.9257 22.8508C7.62471 22.8508 3.89871 20.3668 2.11621 16.7443" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.7998 4.44922H21.6998" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.7998 7.90039H18.2498" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M24.0002 23.9992L21.7002 21.6992" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Статус
                        </span>

                        <span style={{marginLeft: '10px', marginRight: '10px'}}>{'--->'}</span>
                        <span> C опозданием</span>
                    </div>
                </div>

                <div className={cl.content}>

                    <div className={cl.tabList}>
                        {
                            tabs.map((tab, index) => {
                                return (
                                    <AnimationListItem key={tab.id} index={index}>
                                        <motion.div 
                                        whileTap={{opacity: 0.7}}
                                        className={`${cl.tabItem} ${tab.active ? cl.activeItem : ""}`} 
                                        onClick={() => changeActiveTab(tab.id)}>
                                            <div className={'me-2 p-1'}>{tab.icon}</div>
                                            {tab.label}
                                        </motion.div>
                                    </AnimationListItem>
                                )
                            })   
                        }
                    </div>
                    <div className={cl.filterContent}>
                        <div>
                            <CheckinContent />
                        </div>
                        

                    </div>
                </div>

            </Modal.Body>
            <div className={cl.footer}>
                <div>
                    <Button onlyIcon>
                        <svg width="30" height="37" viewBox="0 0 30 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25.8891 16.459V34.624C25.8891 35.2645 25.4713 35.7835 24.9558 35.7835H5.04466C4.5292 35.7835 4.11133 35.2645 4.11133 34.624V16.459" stroke="#FF3F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11.8887 28.0537V16.459" stroke="#FF3F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.1113 28.0537V16.459" stroke="#FF3F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M29 8.72981H21.2222M21.2222 8.72981V2.15947C21.2222 1.51911 20.8044 1 20.2889 1H9.71111C9.19565 1 8.77778 1.51911 8.77778 2.15947V8.72981M21.2222 8.72981H8.77778M1 8.72981H8.77778" stroke="#FF3F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
                <div>
                    <Button color="outline-light" className={`me-3 ${cl.footerBtn}`}>Отмена</Button>
                    <Button color="primary" className={`${cl.footerBtn}`}>Сохранить</Button>
                </div>
            </div>
        </Modal>
    )
}