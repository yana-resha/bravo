import { AnimatePresence, motion } from "framer-motion";
import { LegacyRef, Ref, forwardRef } from "react";

type AnimationProps = {
    children: React.ReactNode | React.ReactElement | string,
}

export const AnimationPage = forwardRef(function ({children} : AnimationProps, ref : Ref<HTMLDivElement>  | undefined) {

    return (
        
        <motion.div
        ref={ref}
        initial={{y: -50, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -50, opacity: 0}}
        transition={{duration: 0.3}}
        >
            {children}
        </motion.div>   
    )
})