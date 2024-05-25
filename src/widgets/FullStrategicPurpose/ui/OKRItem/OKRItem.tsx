import ElephantSVG from '@/shared/ui/svg/ElephantSVG/ElephantSVG';
import { OKRItemType } from '../../types/OKRItemType';
import cl from './OKRItem.module.scss';
import SnailSVG from '@/shared/ui/svg/SnailSVG/SnailSVG';
import { StarList } from '@/shared/ui/StarList';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import defaulAvatar from '../../../../shared/assets/img/users/default-avatar.png';
import { Collapse, Dropdown } from 'react-bootstrap';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { IconKebab } from '@consta/icons/IconKebab';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { useState } from 'react';


export function OKRItem(item : OKRItemType) {
    const {title} = item;
    const [showCollapse, setShowCollapse] = useState(false);
    return (

        <div
            className={cl.item}
        >
            <div className={cl.visiblePart}>
                <div>
                    <div className={cl.taskType}>OKR</div>
                    <div className={cl.titleRow}>
                        <span className={cl.title}>{title}</span>
                        <span className={`${cl.emogiList} me-2`}>
                            <span className={cl.emogiItem} title='Важная задача'>
                                <ElephantSVG styleProps={{ width: '25px', height: '25px' }} />
                            </span>
                            <span className={cl.emogiItem} title='Очень медленно'>
                                <SnailSVG styleProps={{ width: '25px', height: '25px' }} />
                            </span>
                        </span>
                        <StarList value={3} status='danger' />
                    </div>
                    <div className='mb-2'>
                        <div className={cl.progressContainer}>
                            <CustomProgressBar
                                completed={50}
                                showLabel={true}
                                subfix='%'
                                maxCompleted={100}
                                status='success'
                                height='17px'
                            />
                        </div>
                    </div>
                    <div className={cl.responsible}>
                        <img src={defaulAvatar} className='rounded-circle border border-white border-2 avatar-xs me-1' />
                        <span className={cl.responsibleName}>Ковалев Р.А.</span>
                    </div>
                </div>

                <div className={cl.actionBlock}>
                    <Dropdown align={'start'} className='me-2'>
                        <CustomDropdownToggle>
                            <button className='btn btn-light btn-sm rounded-circle d-flex'>
                                <IconKebab size="m" />
                            </button>
                        </CustomDropdownToggle>

                        <Dropdown.Menu className='end-0'>
                            <Dropdown.Item>Изменить</Dropdown.Item>
                            <Dropdown.Item>Удалить</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <ArrowBtn state={showCollapse} toggleFunc={() => setShowCollapse(!showCollapse)} size='l' />

                </div>
            </div>
            <Collapse in={showCollapse}>
                <div>Content</div>
            </Collapse>

        </div>
    )
}