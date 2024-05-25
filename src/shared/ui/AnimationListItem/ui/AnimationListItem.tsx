import { motion } from "framer-motion";
import { forwardRef } from "react";

type AnimationProps = {
    children: React.ReactNode | React.ReactElement | string;
    index: number;
    className?: string;
}

export const AnimationListItem = forwardRef<HTMLDivElement, AnimationProps>(
    ({ children, index, className = '' }, ref) => {
        const listVariants = {
            visible: (i : number) => ({
                opacity: 1,
                transition: {
                    delay: i * 0.1,
                }
            }),
            hidden: {opacity: 0}
        }

        return (
            <motion.div
                className={className}
                variants={listVariants}
                initial='hidden'
                animate='visible'
                custom={index}
                ref={ref}
                >
                    {children}
            </motion.div>
        )
    }
);
