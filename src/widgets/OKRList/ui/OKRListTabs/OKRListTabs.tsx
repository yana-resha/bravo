import { Button } from '@/shared/ui/Button';
import { Card } from '@consta/uikit/Card';
import { Tabs } from '@consta/uikit/Tabs';
import cl from './OKRListTabs.module.scss';
import { useState } from 'react';
import { TabItemType } from '../../types/TabItemType';
import { CreateTaskModal } from '@/features/CreateTaskModal';


type TabsProps = {
    itemsList: TabItemType [],
    initialValue: TabItemType,
    handlerChange: (item: TabItemType) => void,
}


export function OKRListTabs({itemsList, initialValue, handlerChange} : TabsProps) {
    
    return (
        <>
        <Card
            className={`w-100 bg-body ${cl.tabsCard} p-2 d-flex flex-row justify-content-between`}
        >
            <div className='customTab w-100'>
                <Tabs
                    value={initialValue}
                    linePosition={'bottom'}
                    onChange={handlerChange}
                    items={itemsList}
                    getItemLabel={(item) => item.label}
                    size="m"
                    view="clear"
                    
                    renderItem={({ item, checked, onChange }) => (
                        <Button
                            color='clear'
                            className='rounded-pill fw-bold pe-4 ps-4'
                            onClick={onChange}
                            active={checked ? true : false}
                        >
                            {item.label}&nbsp;
                            {item.count !== 0 && <span style={{color: '#42BD53'}}>({item.count})</span>}
                        </Button>
                    )}
                />
            </div>
            
        </Card>

        
        </>
    )
}