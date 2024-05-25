import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DinamicMetric.scss";
import { IconBackward } from "@consta/icons/IconBackward";
import { IconForward } from "@consta/icons/IconForward";
import { InfoCollapse } from "../InfoCollapse/InfoCollapse";
import Slider from "react-slick";
import { useEffect, useId, useRef } from "react";
import { Plug } from "../../../../../shared/ui/Plug/PLug";
import type { MetricValuesType } from "@/features/CreateTaskModal/types/MetricValues";
import moment from "moment";
import numberShorter from "@/shared/utils/numberShorter";

type DinamicMetricProps = {
    period: string;
    values: MetricValuesType[] | null;
    latestUpdate: string;
    closeCollapse?:boolean,
}

type ArrowProps = {
    className?: string;
    style?: object;
    onClick?: () => void;
}

export function DinamicMetric({ values, latestUpdate, closeCollapse=false }: DinamicMetricProps): JSX.Element {
    const sliderRef = useRef<Slider>(null);
    const currentValues = (values && values.length < 4 && values.length !== 0)
     ? (function () {
        const newValues = values.slice();

        for (let i = newValues.length - 1; i < 3; i++) {
            const newValue = structuredClone(newValues[i]);
            newValue.plan = '—';

            if (newValue.month) {
                newValue.month = moment(newValue.month).add(1, 'M').format('YYYY-MM-DD');
            }

            newValues.push(newValue);
        }

        return newValues;
     })()
     : values;
    const isHasData = !(currentValues === null || currentValues === undefined || currentValues.length === 0);
    const isHasArrows = Array.isArray(values) && values.length >= 4; // 4 - максимальное кол-во метрик в одном слайде

    const SampleNextArrow = (props: ArrowProps) => {
        const { className, style, onClick } = props;
        return (
            <button 
                className={`dinamic-metric__button dinamic-metric__button--right ${className}`}
                style={style}
                type="button"
                onClick={onClick}
                aria-description="Предыдущий квартал"
            >
                <IconForward />
            </button>
        );
      }
      
      const SamplePrevArrow = (props: ArrowProps) => {
        const { className, style, onClick } = props;
        return (
            <button 
            className={`dinamic-metric__button dinamic-metric__button--left ${className}`}
            style={style}
            type="button"
            onClick={onClick}
            aria-description="Следующий квартал"
        >
            <IconBackward />
        </button>
        );
      }

    const sliderSettings = {
        dots: false,
        infinite: false,
        arrows: isHasArrows,
        draggable: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: isHasArrows ? <SampleNextArrow /> : undefined,
        prevArrow: isHasArrows ? <SamplePrevArrow /> : undefined
    }

    return (
        <InfoCollapse 
            closeCollapse={closeCollapse}
            title={
                <span className="dinamic-metric-title" title="Динамика метрики">
                    Динамика метрики 
                    <i className="dinamic-metric-title__icon ri-information-line" />
                </span>
            }
            control={
                <div className="dinamic-metric-refresh">
                    <button className="dinamic-metric-refresh" type="button" aria-label="Обновить метрику">
                        <i className="dinamic-metric-refresh__icon ri-refresh-line" />
                    </button>
                    {isHasData && <span className="dinamic-metric-refresh__date" aria-label="Дата последнего обновления">{ latestUpdate }</span>}
                </div>
            }
        >
            <div className="dinamic-metric">
                <div className="dinamic-metric__slider">
                    {isHasData
                        ?
                        <Slider ref={sliderRef} {...sliderSettings}>
                            {currentValues.map((value) => {
                                moment.locale('ru');
                                const isMonth = Boolean(value.month);
                                const date = value.month ?? value.quartal;

                                const year = moment(date).format('YYYY');
                                const period = isMonth
                                  ? moment(date).format('MMMM')
                                  : moment(date).subtract(1, 'days').quarter() + ' Q';   
                                const plan = value.plan === '—' ? '—' : numberShorter(Number(value.plan));
                                const fact = value.fact === '—' ? '—' : numberShorter(0); // Цифрой будет подставляться факт
                                const percent = value.plan === '—' ? '—' : Number(0) / Number(value.plan) * 100; // в Number(0) будет факт
                                const statusTitle = percent !== '—' && percent >= 100 ? 'Выполнено' : "Не выполнено";
                                const statusClasses = `dinamic-metric__status ${percent !== '—' && percent >= 100
                                    ? 'dinamic-metric__status--complated'
                                    : ''
                                }`;

                                return (
                                    <div key={useId()} className="dinamic-metric__item">
                                        <p className="dinamic-metric__year">{year}</p>
                                        <p className="dinamic-metric__period">{period}</p>
                                        <p className="dinamic-metric__stat-fact">{fact}</p>
                                        <p className="dinamic-metric__stat-plan">{plan}</p>
                                        <p className="dinamic-metric__stat-percent">{percent}{`${percent === '—' ? '' : '%'}`}</p>
                                        <span className={statusClasses} title={statusTitle} />
                                    </div>
                                )
                            })}
                        </Slider>
                        :
                        <Plug title='Динамика пока не сформирована' />
                    }
                </div>
                <div className="dinamic-metric__directorate">
                    <p className="dinamic-metric__directorate-item dinamic-metric__directorate-item--name">
                        ФД - Карпунин А.
                    </p>
                    <p className="dinamic-metric__directorate-item dinamic-metric__directorate-item--update">
                        20 число к.м.
                    </p>
                </div>
            </div>
        </InfoCollapse>
    )
}
