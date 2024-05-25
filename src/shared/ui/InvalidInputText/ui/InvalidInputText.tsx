import cl from './InvalidInputText.module.scss';

type PropsType = {
    children: React.ReactNode | React.ReactElement | string,
    className?: string,
}

export function InvalidInputText({children, className = ""} : PropsType) {
    return (
        <span className={`${cl.invalidText} ${className}`}>
            {children}
        </span>
    )
}