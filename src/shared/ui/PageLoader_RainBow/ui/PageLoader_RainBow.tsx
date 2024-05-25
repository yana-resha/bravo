import cl from './pageLoader_RainBow.module.scss';
import { Text } from '@consta/uikit/Text';

export function PageLoader_RainBow () {

    return (

      <div className={cl.loaderContainer}>
          <div>
            <div className={cl.loaderInner}>
              <div className={cl.loaderLineWrap}>
                <div className={cl.loaderLine}></div>
              </div>
              <div className={cl.loaderLineWrap}>
                <div className={cl.loaderLine}></div>
              </div>
              <div className={cl.loaderLineWrap}>
                <div className={cl.loaderLine}></div>
              </div>
              <div className={cl.loaderLineWrap}>
                <div className={cl.loaderLine}></div>
              </div>
              <div className={cl.loaderLineWrap}>
                <div className={cl.loaderLine}></div>
              </div>
            </div>
          </div>
          <Text weight="semibold" view="linkMinor" size="m">Идет загрузка...</Text>
      </div>

    )

}


