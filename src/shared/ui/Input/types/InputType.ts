export type InputType = {
    placeholder?: string,
    className?: string,
    value: string,
    handlerInput: (value: string) => void;
    handlerBlur?: (event: any) => void;
    handlerFocus?: (event: any) => void;
    handlerChange?: (event: any) => void;
    inValid?:boolean;
    type?: 'text' | 'number' | 'password',
    disabled?: boolean,
    iconLeft?: React.ReactNode | React.ReactElement,
    iconRigth?: React.ReactNode | React.ReactElement,
    maxLength?: number | undefined,
    readonly?:boolean,
    size?: 'sm',
    borderRadius?: 'default' | 'middle' | 'pill',
    deleteArrow?:boolean,
}