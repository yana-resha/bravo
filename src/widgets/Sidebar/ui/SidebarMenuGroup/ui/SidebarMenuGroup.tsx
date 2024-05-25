
import cl from './sidebarMenuGroup.module.scss';
import { useId } from 'react';
import { SidebarMenuItem } from '../../SidebarMenuItem';


type GroupType = {
    groupName: string,
    items: any [],
}

export function SidebarMenuGroup (group: GroupType) {
    
    
    
    return (

         <div className={`${cl.listGroup}`}>
            {group.groupName && group.groupName.length > 0 &&

                <div className={`${cl.listGroupTitle}`}>{group.groupName}</div>
            }
            
            <div>
                {group.items.map(el => {
                    const key = useId();
                    return <SidebarMenuItem key={key} {...el}/>
                })}
            </div>
        </div> 
        
         
    )
}