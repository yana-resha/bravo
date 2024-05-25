export type PropsType = {
    state: boolean,
    toggleFunc: () => void,
    className?: string,
    size?: 'l' | 'm' | 's' | 'xs',
    borderLeft?: boolean,
    borderRight?: boolean,
}