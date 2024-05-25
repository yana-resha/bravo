import { motion } from 'framer-motion';
import cl from './NullListItem.module.scss';

export function NullListItem() {
    return (
        <motion.div 
        className={`dr-list__item ${cl.nullItem}`} 
        role='button'
        transition={{
            duration: 0.2,
        }}
        whileHover={{
            scale: 0.99,
        }}
        whileTap={{
            scale: 0.98,
        }}
        
        >
            <div>
                + Добавить сотрудника для сравнения
            </div>
            <div className='fs-14'>(не более 5)</div>
        </motion.div>
    )
}