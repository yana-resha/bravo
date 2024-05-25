import { cnMixSpace } from '@consta/uikit/MixSpace';
import { useRef, useState } from 'react';
import { User } from '@consta/uikit/User';
import { ContextMenu } from '@consta/uikit/ContextMenu';
import { IconComponent } from '@consta/icons/Icon';
import {IconAttach} from '@consta/icons/IconAttach';
import {IconAllDone} from '@consta/icons/IconAllDone';
import {IconSun} from '@consta/icons/IconSun';
import {IconEye} from '@consta/icons/IconEye';
import {IconBag} from '@consta/icons/IconBag';
import DefaultAvatar from '../../../../../shared/assets/img/users/default-avatar.png';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';


type menuItem = {
    label: string;
    imageLeft?: IconComponent;
    leftIcon?: IconComponent;
    rightSide?: IconComponent | string;
    disabled?: boolean,
    groupId?: number;
    subMenu?: Array<menuItem>,
    imageRight?: IconComponent;
    event?: () => void;
    icon?: IconComponent;
    switch?: boolean;
    status?: 'error' | 'success' | 'alert';
};

  export const groups = [
    {
      label: 'Первая группа',
      id: 1,
    },
    {
      label: 'Вторая группа',
      id: 2,
    },
  ];
  
  export const items:menuItem[] = [
    {
      label: 'Скрепка',
      leftIcon: IconAttach,
      status: 'success',
      
      groupId: 1,
      subMenu: [
        {
          label: 'Пункт - 1',
          status: 'success',
        },
        {
          label: 'Пункт - 2',
          status: 'success',
          subMenu: [
            {
              label: 'Пункт - 3',
              leftIcon: IconSun,
              subMenu: [
                {
                  label: 'Пункт - 5',
                },
                {
                  label: 'Пункт - 6',
                },
              ],
            },
            {
              label: 'Пункт - 4',
              leftIcon: IconSun,
              subMenu: [
                {
                  label: 'Пункт - 7',
                },
                {
                  label: 'Пункт - 8',
                },
              ],
            },
            {
              label: 'Пункт - 9',
              leftIcon: IconSun,
            },
          ],
        },
      ],
    },
    {
      label: 'Глаз',
      leftIcon: IconEye,
      groupId: 1,
      event: () => alert('Действие по клику на кнопку'),
    },
    {
      label: 'Две галочки',
      groupId: 2,
      leftIcon: IconAllDone,
      rightSide: '!',
      status: 'alert',
    },
    {
      label: 'Чемодан',
      groupId: 2,
      leftIcon: IconBag,
      rightSide: '!',
      status: 'alert',
    },
    {
      label: 'Солнце',
      groupId: 2,
      leftIcon: IconSun,
      status: 'alert',
      rightSide: '!',
      disabled: true,
    },
  ];

export function UserDropdownMenu () {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const userRef = useRef(null);
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);


    const getItemOnClick = (item: menuItem) => {
        if (item.event) {
          return item.event;
        }
    };

    return (
        <>
          <User 
            avatarUrl={currentUser.avatar || DefaultAvatar}
            name={currentUser.fio} 
            info="" 
            status="available" withArrow={true} 
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
            ref={userRef}
          />
          {/* // #TODO временно убираем блок 
          <ContextMenu
            className={cnMixSpace({
                mT: 's',
            })} 
            size='s'
            isOpen={isOpenDropdown} 
            items={items}
            groups={groups}
            anchorRef={userRef} 
            onClickOutside={() => setIsOpenDropdown(false)}
            getItemOnClick={getItemOnClick}
          /> */}
        </>
    )

}