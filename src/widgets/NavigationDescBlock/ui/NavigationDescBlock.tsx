import HomeSVG from '@/shared/ui/svg/HomeSVG/HomeSVG';
import cl from './navigationDescBlock.module.scss';

type BlockProps = {
    classes?: string,
}

export function NavigationDescBlock ({classes} : BlockProps) {
    return (

        <div
        className={`
            d-flex flex-row
            ${classes ? classes : ''}
        `}
        >

            <div className='me-2'>
                <HomeSVG styleProps={{width: '35px', height: '35px', fill: '#8B2CF5'}}/>
            </div>
            <div className={`${cl.descText}`}>
                Браво | <span className='fw-bold'>Мои OKR и Метрические задачи</span>
                

            </div>

        </div>
    )
}