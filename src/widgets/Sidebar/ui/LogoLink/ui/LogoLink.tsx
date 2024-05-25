

import cl from './logoLink.module.scss';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { classNames } from '@/shared/lib/classNames/classNames';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Text } from '@consta/uikit/Text';
import logo from '../../../../../shared/assets/img/logo/logo_png.png'


export function LogoLink () {

    return (

      <a className={classNames('link-style', {}, [
        cnMixFlex({
           flex: 'flex',
           direction: 'row',
           align: 'center',
        }),
        cnMixSpace({mB: 'xl'})
        
    ])}
    href='/'
    >
        <img src={logo} className={classNames('', {}, [cnMixSpace({mR: 'xs'})])}></img>
        <Text view="primary" font="primary" weight="bold" className={`${cl.logoText}`}>БРАВО</Text>

    </a>
        
    )

}