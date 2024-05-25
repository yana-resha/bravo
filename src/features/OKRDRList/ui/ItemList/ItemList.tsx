import { AnimatePresence, motion } from 'framer-motion';
import cl from './ItemList.module.scss';
import { useState } from 'react';

export function ItemList() {
    const [openCollapse, setOpenCollapse] = useState(false);
    return (
        
            <div className={`dr-list__item`}>
                <motion.header 
                className={`${cl.itemHeader}`}
                onClick={() => setOpenCollapse(!openCollapse)}
                >

                item

                </motion.header>
                <motion.section
                    initial="collapsed"
                    style={{ overflow: 'hidden' }}
                    animate={openCollapse ? "open" : 'collapsed'}
                    
                    variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas aperiam repellendus animi temporibus nobis praesentium neque facilis nesciunt quis esse. At sit modi maiores quas velit quae earum fugiat nulla?
                </motion.section>
                    
            </div>
    )
}