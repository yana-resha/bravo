import { ItemList } from '../ItemList/ItemList';
import { NullListItem } from '../NullListItem/NullListItem';
import cl from './OKRDRList.module.scss';
import './OKRDRList.scss';

export function OKRDRList() {
    return (
        <div className="dr-list position-relative">
            <ItemList />
            <NullListItem />
        </div>
    )
}