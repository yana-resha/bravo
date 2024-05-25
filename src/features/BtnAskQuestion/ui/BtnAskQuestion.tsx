import cl from './notificationBtnPopover.module.scss';
import { useEffect, useState } from 'react';
import { Button } from '@consta/uikit/Button';
import {IconQuestion} from '@consta/icons/IconQuestion';
import { ModalBlock } from '@/shared/ui/ModalBlock';
import { classNames } from '@/shared/lib/classNames/classNames';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

export function BtnAskQuestion () {
  

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

      
    }, [isModalOpen]);

    function closeModal() {
      setIsModalOpen(false);
    }

    return (
      <>
        {/* 
          #TODO временно убираем кнопку
          <Button 
            label="Задать вопрос" 
            view="clear"
            onlyIcon
            iconLeft={IconQuestion}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />  
        */}
        {isModalOpen && 
          <ModalBlock closeFunc={closeModal}>
            <>
              <Text
              size='l'
              weight='bold'
              view="linkMinor"
              lineHeight={'2xs'}
              display={'inline'}
              className={classNames('', {}, [
                cnMixSpace({
                  mR: '2xl',
                }),
              ])}
              >
                Вопросы
              </Text>
            </>
             
            <>
               <div>
               Передать тело модального окна
               </div>
            </>
            <>
             Передать Кнопки 
            </>
              

              
             
              
          </ModalBlock>}   
        
    </>

    )

}


