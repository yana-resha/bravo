import { useEffect,useState } from 'react';
import { Button } from '@consta/uikit/Button';
import {IconSettings} from '@consta/icons/IconSettings';
import { ModalBlock } from '@/shared/ui/ModalBlock';
import { Text } from '@consta/uikit/Text';
import { classNames } from '@/shared/lib/classNames/classNames';
import { cnMixSpace } from '@consta/uikit/MixSpace';

export function BtnSettings () {
  

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
            label="Настройки" 
            view="clear"
            onlyIcon
            iconLeft={IconSettings} 
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        */}
        
        {isModalOpen && 
          <ModalBlock closeFunc={closeModal}
          
          >

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
                Заголовок
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
          </ModalBlock>
          }   
        
    </>

    )

}


