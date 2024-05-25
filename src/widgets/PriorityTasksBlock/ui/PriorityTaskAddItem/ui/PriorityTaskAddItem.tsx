import cl from './priorityTaskAddItem.module.scss';
import { useState } from 'react';
import { PriorityTaskModal } from '@/features/PriorityTaskModal';


export function PriorityTaskItemAdd () {
    const [showPriorityTaskModal, setShowPriorityTaskModal] = useState(false);

    const closePriorityModal = () => setShowPriorityTaskModal(false);

    return (
        <>
            <div className={cl.item} title='Кликните чтобы добавить новую задачу' onClick={() => setShowPriorityTaskModal(true)}>
                <div className={`${cl.textBlock}`}>
                    <div className={cl.topText}>+ Добавить задачу в приоритетные</div>
                    <div className={cl.bottomText}>(не более 5 задач)</div>
                </div>
            </div>
            {showPriorityTaskModal && <PriorityTaskModal closeFunc={closePriorityModal}/> }
        </>
    )
}