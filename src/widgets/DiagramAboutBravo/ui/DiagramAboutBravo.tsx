import  './DiagramAboutBravo.scss'
import { useState } from 'react';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { IconQuestion } from '@consta/icons/IconQuestion';
import { IconClose } from '@consta/icons/IconClose';
import { Modal } from '@consta/uikit/Modal';

export const DiagramAboutBravo = () => {
    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <div className='diagram-wrapper'>
            <button className='diagram-button' type="button" onClick={() => setOpen(true)}>
                <i className="diagram-button__icon ri-question-line" />
                <span className='diagram-button__text'>Как это работает?</span>
            </button>
            <Modal
                isOpen={isOpen}
                hasOverlay
                onClickOutside={() => setOpen(false)}
                onEsc={() => setOpen(false)}
                style={{ borderRadius: '30px' }}
            >
                <Card 
                    verticalSpace="l" 
                    horizontalSpace="m"
                    form="round"
                    shadow={false} 
                    border
                    style={{
                        position: 'relative',
                        background: '#FFF',
                        borderRadius: 'none'
                    }}
                    >
                    <Button
                        label="Закрыть"
                        view="clear"
                        iconRight={IconClose} 
                        size="s"
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px'
                        }}
                        onClick={() => setOpen(false)}
                    />
                    <div className="diagram">
                        <p className="tag tag--title">Руководящая идея</p>
                        <ul className="diagram__items diagram__items--targets">
                            <li>
                                <p className="diagram__item diagram__item--target tag tag--target">Стратегическая цель  №1</p>
                                <ul className="diagram__items diagram__items--small-targets">
                                    <li>
                                        <p className="diagram__item diagram__item--okr tag tag--okr">OKR</p>
                                        <ul className="diagram__items">
                                            <li className="diagram__item diagram__item--kp tag tag--kr">KR</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p className="diagram__item diagram__item--strategic-metric tag tag--strategic-metric">Стратегическая<br />метрика</p>
                                        <ul className="diagram__items">
                                            <li className="diagram__item diagram__item--metric tag tag--metric">Метрика</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <p className="diagram__item diagram__item--target tag tag--target">Стратегическая цель n</p>
                                <ul className="diagram__items diagram__items--small-targets">
                                    <li>
                                        <p className="diagram__item diagram__item--okr tag tag--okr">OKR n</p>
                                        <ul className="diagram__items">
                                            <li className="diagram__item diagram__item--kp tag tag--kr">KR n</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p className="diagram__item diagram__item--strategic-metric tag tag--strategic-metric">Стратегическая<br />метрика n</p>
                                        <ul className="diagram__items">
                                            <li className="diagram__item diagram__item--metric tag tag--metric">Метрика n</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <table className='description'>
                        <tr>
                            <td><ul className="description__points">
                                <li className="description__point tag tag--target">Стратегические цели</li>
                            </ul></td>
                            <td>
                                <p className="description__text">Измеримая по сущности с определенным сроком достижения цель, находящаяся в рамках идеи</p>
                            </td>
                        </tr>
                        <tr>
                            <td><ul className="description__points">
                                <li className="description__point tag tag--okr">OKR</li>
                            </ul></td>
                            <td>
                                <p className="description__text">Проекты направленные на выполнение стратегической цели</p>
                            </td>
                        </tr>
                        <tr>
                            <td><ul className="description__points">
                                <li className="description__point tag tag--strategic-metric">Стратегическая метрика</li>
                                <li className="description__point tag tag--metric">Mетрика</li>
                            </ul></td>
                            <td>
                                <p className="description__text">Параметры, измеряющий исполнение стратегической цели. Стратегические метрики устанавливаются членами правления</p>
                            </td>
                        </tr>
                        <tr>
                            <td><ul className="description__points">
                                <li className="description__point tag tag--kp">KP</li>
                            </ul></td>
                            <td>
                                <p className="description__text description__text--highlighted">Задачи, выполнения которых приближают выполнение OKR</p>
                            </td>
                        </tr>
                    </table>
                </Card>
            </Modal>
        </div>
    );
}
