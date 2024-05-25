import cl from './TasksApproval.module.scss';
import { Badge } from "@consta/uikit/Badge";
import { Collapse } from '@consta/uikit/Collapse';
import { useState } from "react";
import { IconThumbDown } from '@consta/icons/IconThumbDown';
import { IconThumbUp } from '@consta/icons/IconThumbUp';
import { IconOpenInNew } from '@consta/icons/IconOpenInNew';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { Avatar } from '@consta/uikit/Avatar';
import avatarDefault from '@/shared/assets/img/users/default-avatar.png';
import { StarList } from '@/shared/ui/StarList';

export function TasksApproval(): JSX.Element {
    const [isCollapseOpen, setIsCollapseOpen] = useState<boolean>(false);

    return (
        <div className={cl.tasksApproval}>
            <Collapse
                horizontalSpace="m"
                label={
                    <div className={cl.collapseHeader}>
                        Ожидают вашего согласования
                        <Badge className={cl.collapseBadge} size="s" status="error" label="4" form="round" />
                    </div>
                }
                isOpen={isCollapseOpen}
                onClick={() => setIsCollapseOpen(!isCollapseOpen)}
            >
                <table className={cl.tasksTable}>
                    <thead className={cl.tableHeader}>
                        <tr>
                            <th className={`${cl.tableHeaderItem} ${cl.tableHeaderTitleItem}`} scope="col">Задача</th>
                            <th className={cl.tableHeaderItem} scope="col">Событие</th>
                            <th className={cl.tableHeaderItem} scope="col"></th>
                            <th className={cl.tableHeaderItem} scope="col">Значение</th>
                            <th className={cl.tableHeaderItem} scope="col">Владелец</th>
                            <th className={cl.tableHeaderItem} scope="col">Дата запроса</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className={cl.tableItem} scope="row">
                                <div className={cl.itemTitle}>
                                    Увеличить доход от бизнеса Экспр...
                                    <button className={cl.itemTitleButton} type="button">
                                        Перейти к задаче
                                        <IconOpenInNew className={cl.itemTitleIcon} />
                                    </button>
                                </div>
                                
                            </th>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEvent}>Выполнение задачи</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEventControls}>
                                    <button className={cl.itemEventAcceptButton} type="button">
                                        Принять событие
                                        <IconThumbUp className={cl.itemEventIcon} />
                                    </button>
                                    <button className={cl.itemEventRejectButton} type="button">
                                        Отклонить событие
                                        <IconThumbDown className={cl.itemEventIcon} />
                                    </button>
                                </div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemValue}>100% по последнему Check-in</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemUser}>
                                    <Avatar className={cl.userItemAvatar} size='s' url={avatarDefault} name="Роман Ковалев" />
                                    Роман Ковалев
                                </div>
                                
                                </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemDate}>
                                    <IconCalendar className={cl.itemDateIcon} />
                                    25.05.2024&nbsp;&nbsp;&nbsp;17 дней
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className={cl.tableItem} scope="row">
                                <div className={cl.itemTitle}>
                                    Увеличить доход от бизнеса Экспр...
                                    <button className={cl.itemTitleButton} type="button">
                                        Перейти к задаче
                                        <IconOpenInNew className={cl.itemTitleIcon} />
                                    </button>
                                </div>
                                
                            </th>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEvent}>Отмена задачи</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEventControls}>
                                    <button className={cl.itemEventAcceptButton} type="button">
                                        Принять событие
                                        <IconThumbUp className={cl.itemEventIcon} />
                                    </button>
                                    <button className={cl.itemEventRejectButton} type="button">
                                        Отклонить событие
                                        <IconThumbDown className={cl.itemEventIcon} />
                                    </button>
                                </div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemValue}>Комментарий в одну строку...<a href='#'>еще</a></div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemUser}>
                                    <Avatar className={cl.userItemAvatar} size='s' url={avatarDefault} name="Роман Ковалев" />
                                    Роман Ковалев
                                </div>
                                
                                </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemDate}>
                                    <IconCalendar className={cl.itemDateIcon} />
                                    25.05.2024&nbsp;&nbsp;&nbsp;17 дней
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className={cl.tableItem} scope="row">
                                <div className={cl.itemTitle}>
                                    Увеличить доход от бизнеса Экспр...
                                    <button className={cl.itemTitleButton} type="button">
                                        Перейти к задаче
                                        <IconOpenInNew className={cl.itemTitleIcon} />
                                    </button>
                                </div>
                                
                            </th>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEvent}>Изменение дэдлайна</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEventControls}>
                                    <button className={cl.itemEventAcceptButton} type="button">
                                        Принять событие
                                        <IconThumbUp className={cl.itemEventIcon} />
                                    </button>
                                    <button className={cl.itemEventRejectButton} type="button">
                                        Отклонить событие
                                        <IconThumbDown className={cl.itemEventIcon} />
                                    </button>
                                </div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={`${cl.itemValue} ${cl.itemValueUpdate}`}>{'10.11.2023->31.12.2024'}</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemUser}>
                                    <Avatar className={cl.userItemAvatar} size='s' url={avatarDefault} name="Роман Ковалев" />
                                    Роман Ковалев
                                </div>
                                
                                </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemDate}>
                                    <IconCalendar className={cl.itemDateIcon} />
                                    25.05.2024&nbsp;&nbsp;&nbsp;17 дней
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className={cl.tableItem} scope="row">
                                <div className={cl.itemTitle}>
                                    Увеличить доход от бизнеса Экспр...
                                    <button className={cl.itemTitleButton} type="button">
                                        Перейти к задаче
                                        <IconOpenInNew className={cl.itemTitleIcon} />
                                    </button>
                                </div>
                                
                            </th>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEvent}>Установка звезд</div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemEventControls}>
                                    <StarList value={3} status='default' />
                                    <button className={cl.itemEventAcceptButton} type="button">
                                        Принять событие
                                        <IconThumbUp className={cl.itemEventIcon} />
                                    </button>
                                    <button className={cl.itemEventRejectButton} type="button">
                                        Отклонить событие
                                        <IconThumbDown className={cl.itemEventIcon} />
                                    </button>
                                </div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemValue}></div>
                            </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemUser}>
                                    <Avatar className={cl.userItemAvatar} size='s' url={avatarDefault} name="Роман Ковалев" />
                                    Роман Ковалев
                                </div>
                                
                                </td>
                            <td className={cl.tableItem}>
                                <div className={cl.itemDate}>
                                    <IconCalendar className={cl.itemDateIcon} />
                                    25.05.2024&nbsp;&nbsp;&nbsp;17 дней
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Collapse>
        </div>
    );
}
