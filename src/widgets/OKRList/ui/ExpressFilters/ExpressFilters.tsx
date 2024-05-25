import { Button } from '@/shared/ui/Button';
import cl from './ExpressFilters.module.scss';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';
import { ExpressFiltersModal } from '../ExpressFiltersModal';

type ItemListType = {
    [key: string]: any,
    id: string | number,
    active: boolean,
}

export function ExpressFilters() {

    const [showSettingModal, setShowSettingModal] = useState<boolean>(false);
    const [itemList, setItemList] = useState<ItemListType[]>([
        {
            id: 1,
            active: false,
        },
        {
            id: 2,
            active: false,
        },
        {
            id: 3,
            active: false,
        },
        {
            id: 4,
            active: false,
        },
    ]);

    function changeItemActive(id: string | number) {
        setItemList(prevList => {
            return prevList.map(el => {
                if (el.id == id) el.active = !el.active;
                return el;
            })
        })
    }

    return (
        <>
        {showSettingModal && <ExpressFiltersModal closeFunc={() => setShowSettingModal(false)}/>}
        <div className={`${cl.filterList} d-flex flex-row align-items-stretch flex-grow-1`}>
            {
                itemList.map((el: ItemListType, index: number) => {
                    return (
                        <AnimationListItem key={el.id} index={index}>
                            <motion.div
                            whileTap={{
                                scale: 0.98,
                            }}
                            title={el.active ? 'Кликните, чтобы отменить фильтр' : 'Кликните, чтобы применить фильтр'}
                            key={el.id}
                            className={`${cl.item} ${el.active ? cl.itemActive : ""}`}>
                                <div className={cl.btnCont}>
                                    <Button onlyIcon title='Настроить фильтр' onClick={() => setShowSettingModal(true)}>
                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.55031 5.48461C6.81643 5.48461 7.84281 4.4807 7.84281 3.24231C7.84281 2.00391 6.81643 1 5.55031 1C4.2842 1 3.25781 2.00391 3.25781 3.24231C3.25781 4.4807 4.2842 5.48461 5.55031 5.48461Z" stroke="black" />
                                        <path d="M5.55031 18.0002C6.81643 18.0002 7.84281 16.9963 7.84281 15.7579C7.84281 14.5195 6.81643 13.5156 5.55031 13.5156C4.2842 13.5156 3.25781 14.5195 3.25781 15.7579C3.25781 16.9963 4.2842 18.0002 5.55031 18.0002Z" stroke="black" />
                                        <path d="M13.1992 11.7424C14.4894 11.7424 15.5352 10.7385 15.5352 9.50012C15.5352 8.26173 14.4894 7.25781 13.1992 7.25781C11.9091 7.25781 10.8633 8.26173 10.8633 9.50012C10.8633 10.7385 11.9091 11.7424 13.1992 11.7424Z" stroke="black" />
                                        <path d="M0 2.66797H3.25948V3.7109H0V2.66797Z" fill="black" />
                                        <path d="M9.77832 2.66797H18.4703V3.7109H9.77832V2.66797Z" fill="black" />
                                        <path d="M0 8.92383H8.69194V9.96676H0V8.92383Z" fill="black" />
                                        <path d="M15.21 8.92383H18.4694V9.96676H15.21V8.92383Z" fill="black" />
                                        <path d="M0 15.1836H3.25948V16.2265H0V15.1836Z" fill="black" />
                                        <path d="M9.77832 15.1836H18.4703V16.2265H9.77832V15.1836Z" fill="black" />
                                        </svg>
                                    </Button>
                                </div>
                                <div className={cl.itemContent} onClick={() => changeItemActive(el.id)}>
                                    <div className={cl.itemTitle}>
                                        Новые Check-in
                                    </div>
                                    <div className={cl.itemCount}>34</div>

                                </div>
                                
                                
                            </motion.div>
                        </AnimationListItem>
                    )
                })
            }
        </div>
        </>
    )
}