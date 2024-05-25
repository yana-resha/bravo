import { Badge } from '@/shared/ui/Badge';
import cl from './successBoardItem.module.scss';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { Button } from '@/shared/ui/Button';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import { AvatarGroup } from '@/shared/ui/Avatar';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';


type SuccessItemType = {
    title: string,
    fio: string,
}


export function SuccessBoardItem (item: SuccessItemType) {

    const {title, fio} = item;
    return (
        <div className={cl.item}>
            <div className={cl.employeeBlock}>
                <div className={cl.employee}>
                    <img src={defaultAvatar} className={`rounded border avatar-md me-1 ${cl.employeeAvatar}`} />
                    <div>
                        <div className={cl.employeeName}>{fio}</div>
                        <div className={cl.employeePosition}>
                            Куратор Службы управления рисками, Copperside
                        </div>  
                    </div>
                </div>
                <div className={cl.actionBlock}>
                    <Button className={`${cl.likeBtn} me-2`} onlyIcon={true} title='Поставить лайк'>
                        <i className="mdi mdi-thumb-up"></i>
                    </Button>
                    <AvatarGroup maxLength={3} items={[
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Иванов Иван Иванович'
                        },
                        {
                            fio: 'Петров Иван Иванович'
                        },
                    ]}  />
                    
                </div>
            </div>

            <div className={cl.taskBlock}>
                <div className='d-flex flex-row justify-content-between align-items-start'>
                    <Link to={'#'} className={cl.titleLink}>
                        {title}
                        <i className={`mdi mdi-link-variant ms-1 ${cl.titleIcon}`}></i>
                    </Link>

                    <Badge theme={bgThemeEnum.darkBlue}>4 кв 23</Badge>
                </div>
                <div className={cl.taskDescription}>
                    Закрыл сложно структурированную инвестиционную сделку по интеграции ПКБ в бизнес группы ТКБ .
                </div>
            </div>

            <div className={cl.targetBlock}>
                <div className='d-flex flex-row justify-content-end'>
                    <Dropdown align={'start'} className={`${cl.itemDropdown} me-3`}>
                        <CustomDropdownToggle>
                            <button className='btn btn-light btn-sm rounded-circle'>
                                <i className="ri-more-fill"></i>
                            </button>
                        </CustomDropdownToggle>

                        <Dropdown.Menu className='end-0'>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={cl.target}>
                    <GoalLineSVG styleProps={{width: '36px', height: '36px', fill: '#0078D4'}}/>
                    <span className={cl.targetText}>Лучший банк для (среднего) бизнеса</span>
                </div>
            </div>

        </div>
    )
}