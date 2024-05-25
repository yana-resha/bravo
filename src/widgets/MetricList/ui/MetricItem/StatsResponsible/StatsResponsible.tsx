import { MetricValuesType } from "@/features/CreateTaskModal/types/MetricValues";
import "./StatsResponsible.scss";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import numberShorter from "@/shared/utils/numberShorter";
import { ResponsibleType } from "@/shared/types/responsibleType";
import IResponsible from "@/entities/user/types/IResponsible";

type StatsResponsibleProps = {
    responsibles: IResponsible[] | undefined,
    metricValue: MetricValuesType | undefined
}

export function StatsResponsible({ responsibles, metricValue }: StatsResponsibleProps): JSX.Element {
    const plan = metricValue ? numberShorter(Number(metricValue.plan)) : '-';
    const fact = metricValue ? numberShorter(0) : '-'; // Цифрой будет подставляться факт
    const percent = metricValue ? Number(0) / Number(metricValue.plan) * 100 : '-'; // в Number(0) будет факт
    const statusTitle = percent !== '-' && percent >= 100
        ? 'выполнено'
        : 'не выполнено';
    const statusClasses = `stats-responsible__status ${percent !== '-' && percent >= 100
        ? 'stats-responsible__status--done'
        : ''
    }`;
    
    return (
        <div className='stats-responsible'>
            {responsibles && (
                <img 
                    className="stats-responsible__avatar" 
                    src={`${responsibles[0].avatar ?? defaultAvatar}`} 
                    title={responsibles[0].fio??""}
                    alt={responsibles[0].fio??""}
                />
            )}
            <span className={statusClasses}>Статус: {statusTitle}</span>
            <ul>
                <li className='stats-responsible__item'>
                    <p>Ф</p>
                    <p>{fact}</p>
                </li>
                <li className='stats-responsible__item'>
                    <p>П ≥ </p>
                    <p>{plan}</p>
                </li>
            </ul>
            <p className='stats-responsible__percentage'>{percent}{`${percent === '-' ? '' : '%'}`}</p>
        </div>
    )
}