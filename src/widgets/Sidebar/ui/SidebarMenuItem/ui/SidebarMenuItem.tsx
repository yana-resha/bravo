import cl from './sidebarMenuItem.module.scss';
import { NavLink, useMatch } from 'react-router-dom';


type Item = {
    title: string
    [key: string]: any;
}

type NavLinkProps = {
    isActive? : boolean;
    [key: string]: any;
}

export function SidebarMenuItem (item: Item) {
    
    const  match = useMatch({
        path:item.href,
        end: true,
    });



    function setActiveItem ({isActive} : NavLinkProps) {
        
        return isActive ? `${cl.activeItem} ${cl.item}` : `${cl.item}`
    }
    
    return (
        <NavLink to={item.href} className={setActiveItem}>
            <div>
                <span className={`${cl.leftIcon}`}>
                    {item.leftIcon? item.leftIcon :''}
                </span>
                <span className={`${cl.itemTitle} flex-grow-1 ${match? cl.activeTitle: ''}`}>
                    {item.title}
                    <span className={`${cl.sublimeText}`}>
                        {item.sublineText??''}
                    </span>
                </span>
            </div>
            <span className=''>
                {...item.rightIcons}
            </span>
        </NavLink>
         
    )
}