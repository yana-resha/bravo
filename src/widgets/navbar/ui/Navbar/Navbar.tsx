import { Layout } from '@consta/header/Layout';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { NavbarSearchBlock } from '../NavbarSearchBlock/ui/NavbarSearchBlock';
import { NavbarBtnsBlock } from '../NavbarBtnsBlock/ui/NavbarBtnsBlock';
import { UserDropdownMenu } from '../UserDropdownMenu/ui/UserDropdownMenu';
import cl from './navbar.module.scss';
export function Navbar () {
    return (
        
        <Layout 
            className={`${cnMixSpace({
                mB: '3xs',
            })} ${cl.navbar}`}
            rowCenter={
                {left: 
                    <>
                         {/* #TODO времнно убираем блок
                        <NavbarSearchBlock/>     */}
                    </>,
                center: '',
                right: 
                    <>
                        <span 
                            className={cnMixSpace({
                                mR: 'xs',
                            })}
                        >
                            <NavbarBtnsBlock/>
                        </span>
                        <UserDropdownMenu/>
                    </>
            }}
            placeholder={''}
        />
    )
}