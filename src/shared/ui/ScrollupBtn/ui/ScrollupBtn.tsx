
import { useEffect, useRef, useState } from "react";
import { Button } from "../../Button";
import cl from './ScrollupBtn.module.scss';
import { MotionStyle, motion } from "framer-motion";

type props = {
    parentContainer?: React.MutableRefObject<HTMLDivElement | null>,
}
export function ScrollupBtn ({parentContainer} : props) {
    const [showBtn, setShowBtn] = useState(false);
    const ref = useRef<HTMLButtonElement | null>(null);
    const [style, setStyle] = useState<MotionStyle>({right: '20px'});
    const scrollListener = () => {
        document.addEventListener('scroll', () => {
            let procent = screen.height / 100;
            const scrollSizeProcent =  document.documentElement.scrollTop / procent;
            if (scrollSizeProcent > 30) {
                setShowBtn(true);
            } else {
                setShowBtn(false)
            }
        })
    }
    useEffect(() => {
        // если передали родительский контейнер, то кнопка будет находится справа от него
        if (parentContainer?.current) {
            setStyle({left: parentContainer.current.getBoundingClientRect().right + 20 + 'px'})
        }
        scrollListener();
        return () => {
            document.removeEventListener('scroll', scrollListener)
        }
    }, [])

    const scrollTop = () => {
        window.scrollTo(0, 0);
    }

    return (
        <motion.div
        initial="collapsed"
        animate={showBtn ? "show" : 'hide'}
        variants={{
            show: { opacity: 1, scale: 1 },
            hide: { opacity: 0, scale: 0},
        }}
        className={cl.scrollBtnContainer}
        style={{...style}}
        >
            <Button
            ref={ref}
            title="Вернуться наверх"
            onlyIcon
            onClick={() => scrollTop()}
            className={`${cl.scrollupBtn}`}
            >
                <svg width={'auto'} height={'35px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#4E8DF1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </Button>

        </motion.div>
        
    )
}