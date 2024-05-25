import { useEffect, useId, useState } from 'react';
import StarCircleSVG from '../../svg/StarCircleSVG/StarCircleSVG';
import cl from './starList.module.scss';
import StarCircleFullSVG from '../../svg/StarCirlceFullSVG/StarCircleFullSVG';
import StarCircleHalfSVG from '../../svg/StarCircleHalfSVG/StarCircleHalfSVG';

type StarListProps = {
    value: number,
    status: 'success' | 'warning' | 'danger' | 'default' | 'blue',
    classList?: string,
    opacity?: number,
}

type StyleType = {
    width?: string,
    height?: string,
    fill?: string,
}



export function StarList ({value, status, classList = '', opacity = 1} : StarListProps) {

    const [stars, setStars] = useState<React.ReactNode []>([]);

    useEffect(() => {
        const newArr: React.ReactNode [] = [];
        let styleObj:StyleType = {
            width: '20px',
            height: '20px',
        }
        switch(status) {
            case 'danger' : 
                styleObj.fill = '#BB271A';
                break;
            case 'warning' : 
                styleObj.fill = '#F29D38';
                break;
            case 'success' : 
                styleObj.fill = '#78A55A';
                break;

            case 'blue' : 
                styleObj.fill = '#8CB1EA';
                break;

            default: styleObj.fill = '#CCCCCC'
        }
        for (let i = 0; i < value; i++) {
            newArr.push(
                <span key={i} style={{
                    display: 'inline-block'
                }}>
                    {
                        (value - i) < 1
                            ? <StarCircleHalfSVG style={styleObj} />
                            : <StarCircleFullSVG style={styleObj} /> 
                    }
                </span>
            )
        }
        setStars(newArr);

    }, [value, status])

    return (
        <span 
        style={{
            opacity: opacity,
        }}
        className={`${cl.starList} ${classList}`} aria-description={`Сложность: ${value}`}>
            {stars}
        </span>
    )
}
