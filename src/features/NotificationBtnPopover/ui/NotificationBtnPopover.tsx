import cl from './notificationBtnPopover.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { Popover } from '@consta/uikit/Popover';
import { classNames } from '@/shared/lib/classNames/classNames';
import {IconRing} from '@consta/icons/IconRing';
import { cnMixSpace } from '@consta/uikit/MixSpace';

import { NotificationsList } from '@consta/header/Notifications';

import { items, actions } from '../model/data/listData';


export function NotificationBtnPopover () {
  
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const notificationBtnRef = useRef(null); 

    return (
      <>
        {/* 
          #TODO временно убираем кнопку
          <Button 
            label="Уведомления"
            onClick={() => setIsOpenNotification(!isOpenNotification)} 
            ref={notificationBtnRef}
            view="clear"
            onlyIcon
            iconLeft={IconRing} 
          />
        */}

        {isOpenNotification &&
            <Popover
            placeholder={''}
            direction="downCenter"
            spareDirection="downStartLeft"
            offset="xs"
            arrowOffset={0}
            onClickOutside={() => setIsOpenNotification(false)}
            isInteractive={true}
            anchorRef={notificationBtnRef}
            equalAnchorWidth={false}
            className={classNames('', {}, [
              cnMixSpace({mT: 'xs'})
            ])}
            >
              <NotificationsList
                items={items}
                title="Уведомления"
                actions={actions}
                className={cl.notificationList}
                groupByDay
              />
            </Popover>
        }
      </>

    )

}


