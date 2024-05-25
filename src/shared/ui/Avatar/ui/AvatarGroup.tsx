
import { AvatarGroupType } from '../types/AvatarGroupType';
import { useEffect, useState } from 'react';
import { AvatarItem } from './AvatarItem';
import { AvatarItemNull } from './AvatarNullItem';
import { AvatarAddBtn } from './AvatarAddBtn';


export function AvatarGroup(props : AvatarGroupType) {
  
  const {items, maxLength, addBtn, className} = props;
  const [avatarList, setAvatarList] = useState<React.ReactNode[]>([]);
  const [maxItemsLength, setMaxItemsLength] = useState<number>(0);
  
  const getMaxLength = () => {
    if (items.length > 0) {
      let length = maxLength && maxLength <= items.length? maxLength : items.length;
      setMaxItemsLength(length);
    } else {
      setMaxItemsLength(0);
    }
    
  }

  useEffect(() => {
    const itemsArr:any[] = [];
    for (let i = 0; i < maxItemsLength; ++i) {
      itemsArr.push(<AvatarItem key={i} {...items[i]}/>)
      setAvatarList(itemsArr);
    }
  }, [items]);

  useEffect(() => {
     getMaxLength();
  }, [maxLength, items])

  return (
    
    <div className={`avatar-group avatar-group-responsible flex-nowrap ${className ? className : ''}`}>
      {avatarList}
      {maxItemsLength < items.length && (
        <AvatarItemNull items={items.slice(-(items.length - maxItemsLength))} />
      )}
      {
        addBtn && (
          <div className="avatar-group-item">
              <AvatarAddBtn {...addBtn}/>
          </div>
        )
      }
    </div>

  )
}






