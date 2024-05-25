import cl from './sidebar.module.scss';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Layout } from '@consta/uikit/Layout';
import { LogoLink } from '../LogoLink/ui/LogoLink';
import { SidebarMenu } from '../SidebarMenu/ui/SidebarMenu';
import { SuccessBoardMini } from '@/features/SuccessBoardMini';

export function Sidebar () {
    return (
        <div className={cl.cont}>
            <Layout horizontalAlign={'left'} direction="column" className={classNames(cl.sidebar, {}, [
                cnMixSpace({pV: '2xl', pH:'m'})
            ])}> 

                <div className={cl.sidebarContent}>
                    <LogoLink/>
                    <div className='mb-3'>
                        <SidebarMenu/>
                    </div>
                    {/* <SuccessBoardMini/> // #TODO временно убирает */}
                </div>
            </Layout>
        </div>
    )
}