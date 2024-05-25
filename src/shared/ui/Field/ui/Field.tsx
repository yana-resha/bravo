import { FieldType } from '../types/FieldType';
import cl from './Field.module.scss';

export function Field (props: FieldType) {
    const {
        label = false,
        error = false,
        children = <></>,
        className = "",
        labelClassname = "",

    } = props;
    return (
        <div
        className={`position-relative ${cl.field} ${className}`}
        >
            {label && (
            <label className={`${cl.label} ${labelClassname}`}>{label}</label>
            )}
            {children}
            {error && (
                <div className={cl.errorBlock}>{error}</div>
            )}
        </div>
    )
}