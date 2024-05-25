export type FieldType = {
    label?: React.ReactNode | React.ReactElement | string | false,
    children?: React.ReactNode | React.ReactElement | string,
    error?: React.ReactNode | React.ReactElement | string | false | undefined,
    className?: string,
    labelClassname?: string,
}