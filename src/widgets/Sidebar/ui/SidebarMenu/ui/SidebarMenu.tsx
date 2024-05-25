import { SidebarMenuGroup } from '../../SidebarMenuGroup';
import cl from './sidebarMenu.module.scss';
import { createGroupItems} from '../data/groupItems';
import { useId } from 'react';


export function SidebarMenu () {

    const groupItems = createGroupItems();

    return (

        <div className={cl.sidebarMenu}>
            {groupItems.map(el => {
                if (el.items && el.items.length > 0) {
                    const key = useId();
                    return <SidebarMenuGroup key={key} groupName={el.groupName} items={el.items??[]} />
                }
            })}
        </div>   
    )
}