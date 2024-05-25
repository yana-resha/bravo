
import { createPortal } from 'react-dom';
import { AnimatePresence, DragControls, motion } from "framer-motion";
import cl from './DragModal.module.scss';
import { useEffect, useRef, useState } from 'react';

type DragModalProps = {
	children: React.ReactNode | React.ReactElement | string
	dialogClassName?: string
	contentClassName?: string
	closeFunc?: () => void
	controls?: DragControls
}





export function DragModal (props : DragModalProps) {
    const {children, 
        dialogClassName = "", 
        contentClassName = "",
        closeFunc = () => {},
        controls
    } = props;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const windowRef = useRef<HTMLDivElement | null>(null);
    const [dragConstraints, setDragContainers] = useState({left: 0, right: 0, top: 0, bottom: 0});
    useEffect(() => {
        if (containerRef.current && windowRef.current) {
            let containerCoord = containerRef.current?.getBoundingClientRect();
            let windowCoord = windowRef.current?.getBoundingClientRect();
            setDragContainers((prev) => {
                let newValue = prev;
                console.log(containerCoord.bottom - windowCoord.height * 0.3, 'klklkl')
                newValue.top = containerCoord.top - windowCoord.height * 0.7;
                newValue.bottom = containerCoord.bottom - windowCoord.height * 0.3;
                newValue.left = containerCoord.left - windowCoord.width * 1.1;
                newValue.right = containerCoord.right - windowCoord.width * 0.4;
                return newValue;
            })
        }
    }, [containerRef])
    
    return createPortal(
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				ref={containerRef}
				className={cl.modalBackdrop}
				onClick={(event: any) => {
					if (!event.target.closest(`.${cl.modalContent}`)) {
						console.log('click')
					}
				}}
			>
				<motion.div
					drag
					dragListener={false}
					dragControls={controls}
					ref={windowRef}
					dragConstraints={dragConstraints}
					dragElastic={0.1}
					whileDrag={{ scale: 0.95 }}
					className={`${cl.modalDialog} ${dialogClassName}`}
				>
					<div className={`${cl.modalContent} ${contentClassName}`}>
						{children}
					</div>
				</motion.div>
			</motion.div>,
			document.body
		)
}