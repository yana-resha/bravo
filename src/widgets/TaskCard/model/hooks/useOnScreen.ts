import { RefObject, useEffect, useMemo, useState } from "react"

const useOnScreen = (ref: RefObject<HTMLElement>) => {
    const [isVisible, setIsVisible] = useState(false)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting)
    ), [ref]);

    useEffect(() => {
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    return isVisible;
}

export default useOnScreen;