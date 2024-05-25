import  './modalBlock.scss';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '@consta/uikit/Modal';

import { Layout } from '@consta/uikit/Layout';
import { classNames } from '@/shared/lib/classNames/classNames';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import {IconClose} from '@consta/icons/IconClose';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Button } from '../../Button';

type ModalProps = {
  closeFunc: () => void;
  children: React.ReactNode [],
  className?: string,
  hasOverlay?: boolean,
  isOpen?: boolean,
}


export function ModalBlock ({closeFunc, children, className="", hasOverlay=true}: ModalProps) {

    const containerRef = useRef(null);

    return (
        <Modal
          isOpen={true}
          hasOverlay={hasOverlay}
          position="center"
          onClickOutside={closeFunc}
          onEsc={closeFunc}
          className={`modalBlock d-flex flex-column justify-content-between ${className}`}
        >
            <div>
                <Layout 
                direction='row'
                className={classNames('', {}, [
                  cnMixSpace({
                    mB: 'l',
                  }),
                  cnMixFlex({
                    wrap: 'nowrap',
                    justify: 'space-between',
                    align: 'flex-start',
                  }),
              
                ])}
                >
                
                    {children[0]}
                    <Button color='light' onClick={closeFunc} size='sm' title='Закрыть модальное окно'> 
                      <i className="ri-close-fill"></i>
                    </Button>
                   
                </Layout>

                <Layout 
                direction='column' 
                flex={3}
                className={classNames('', {}, [
                  cnMixSpace({
                    mB: 'l',
                  }),
                ])}
                >
                
                  {children[1]}
                </Layout>


            </div>
            <div>
                <Layout 
                direction='row'
                className={classNames('', {}, [
                  cnMixFlex({
                    wrap: 'nowrap',
                    justify: 'flex-end',
                    align: 'center',
                  }),

                ])}

                >
                  {children[2]}
                </Layout>
            </div>
          
          {/* <Layout 
          direction='column'
          
          fixed={true}
          ref={containerRef}
          className={classNames(cl.modalBlock, {}, [
            cnMixSpace({
              p: 'm',
            }),
          ])}
          > 



            

          </Layout> */}



        </Modal>
    )
}


