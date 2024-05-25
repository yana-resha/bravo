import { ListItemProps } from "../types/AutoCompleteInputType"
import cl from './AutoCompleteInput.module.scss';

export function DefaultItem({label, item, onClick = () => {}, id, active} : ListItemProps) {
    return (
        <div className={`${cl.defaultItem} ${active ? cl.active : ""}`} onClick={() => onClick(id)}>
            {label}
        </div>
    )
}