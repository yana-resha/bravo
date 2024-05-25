import { Layout } from '@consta/header/Layout';
import { NotificationBtnPopover } from '@/features/NotificationBtnPopover/ui/NotificationBtnPopover';
import { BtnSettings } from '@/features/BtnSettings';
import { BtnAskQuestion } from '@/features/BtnAskQuestion';

export function NavbarBtnsBlock () {

    return (

        <Layout placeholder={''}>
          <BtnAskQuestion/>
          <BtnSettings/>
          <NotificationBtnPopover/>
        </Layout>
    )

}