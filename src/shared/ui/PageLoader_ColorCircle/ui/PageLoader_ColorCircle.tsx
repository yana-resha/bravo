import { AnimationPage } from '../../AnimationPage';
import cl from './pageLoader_ColorCircle.module.scss';
import { Text } from '@consta/uikit/Text';

export function PageLoader_ColorCircle() {
  return (
    <AnimationPage>
      <div className={cl.loaderContainer}>
        <div className={cl.spinner}>
          <span className={cl.ball_1}></span>
          <span className={cl.ball_2}></span>
          <span className={cl.ball_3}></span>
          <span className={cl.ball_4}></span>
          <span className={cl.ball_5}></span>
          <span className={cl.ball_6}></span>
          <span className={cl.ball_7}></span>
          <span className={cl.ball_8}></span>
        </div>
        <Text weight="semibold" view="linkMinor" size="m">Идет загрузка...</Text>
      </div>
    </AnimationPage>
  )

}


