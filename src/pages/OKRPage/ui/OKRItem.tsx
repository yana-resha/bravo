import cl from './okrPage.module.scss';
import { useEffect, useState, useContext, useId } from 'react';
import Card  from 'react-bootstrap/Card';
import {IconArrowDown} from '@consta/icons/IconArrowDown';

import Stack from 'react-bootstrap/Stack';
import defaultAvatar from '../../../shared/assets/img/users/default-avatar.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import Dropdown from 'react-bootstrap/Dropdown';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { IconKanban } from '@/shared/ui/icons/IconKanban/IconKanban';
import { Attachment } from '@consta/uikit/Attachment';
// import { CollapseContext } from '../libs/hooks/collapseContext';
import Collapse from 'react-bootstrap/Collapse';
import { Badge } from '@/shared/ui/Badge';
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import ElephantSVG from '@/shared/ui/svg/ElephantSVG/ElephantSVG';
import SnailSVG from '@/shared/ui/svg/SnailSVG/SnailSVG';
import NoticeSVG from '@/shared/ui/svg/NoticeSVG/NoticeSVG';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { Button } from '@/shared/ui/Button';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';


type itemProps = {
    title: string,
    description: string,
    isOpen: boolean,
    id: string | number,
}


function OKRItem ({isOpen, title, description, id}: itemProps ) {

    // const { closeCollapse , changeCloseCollapse} = useContext(CollapseContext);

    const [taskCollapse, setTaskCollapse] = useState(false);
    const [notesCollapse, setNotesCollapse] = useState(false);
    const [childsCollapse, setChildCollapse] = useState(false);

    // useEffect(() => {
    //     if (closeCollapse === true) {
    //         // закрыть все коллапсы если кликнули по кнопке свернуть все
    //         setTaskCollapse(false);
    //         setNotesCollapse(false);
    //         setChildCollapse(false);
    //     }
    // }, [closeCollapse]);

    const toggleTaskCollapse = () => {
        setTaskCollapse(!taskCollapse); 
        // changeCloseCollapse(false);
    };
    
    return (
        <div className={`mb-3 text-muted bg-white ${ cl.mainCard}`} >
            <div className='position-relative'>
                <div className='ps-2'>
                    <Card.Header className={`${cl.mainVisibleBlock} position-relative`}>
                        {/* левый блок */}
                        <div>
                            <div className='fw-semibold fs-18'>
                                {title}
                            </div>
                            <div className='d-flex flex-column'>
                                <div className='d-flex flex-row align-items-center justify-content-between me-3'>
                                    <div className='d-flex flex-row align-items-center'>
                                        <GoalLineSVG styleProps={{width: '36px', height: '36px', fill: '#0078D4'}}/>
                                        <div className={cl.subTitle}>
                                            Не определена цель Группы
                                            <i className="ms-1 ri-alert-fill text-danger" style={{verticalAlign: 'bottom',}}></i>
                                        </div> 
                                    </div>
                                    <div className='d-flex flex-row align-items-center'>
                                        <div className={`${cl.progressBarContainer} me-5`}>
                                            <CustomProgressBar
                                                completed={50}
                                                showLabel={true}
                                                subfix='%'
                                                maxCompleted={100}
                                                status='success'
                                                height='17px'
                                            />
                                        </div>

                                        <Badge borderRadius='pill' textWeight='normal' theme={bgThemeEnum.ligthPink} className='me-2 fs-16'
                                            styleObj={{paddingTop: '3px', paddingBottom: '3px'}}>
                                            Под угрозой
                                        </Badge>
                                    </div>                    
                                </div>

                                <Stack direction="horizontal" gap={1} className='flex-wrap ps-4'>
                                    <Badge theme={bgThemeEnum.lightGrey} title='Пояснение бейджика'>OKR задача</Badge>
                                    <Badge theme={bgThemeEnum.lightBeige} textWeight='normal' title='Пояснение бейджика'>3кв. 2023</Badge>
                                    <Badge theme={bgThemeEnum.ligthPink} textColor='dark'>Блокирующая задача</Badge>
                                    <div className={`${cl.emogiList}`}>
                                        <span className={cl.emogiItem} title='Важная задача'>
                                            <ElephantSVG styleProps={{width: '25px', height: '25px'}}/>
                                        </span>
                                        <span className={cl.emogiItem} title='Очень медленно'>
                                            <SnailSVG styleProps={{width: '25px', height: '25px'}}/>
                                        </span>
                                    </div>
                                </Stack>
                            </div>
                        </div>
                    
                        {/* Правый блок */}
                        <div className='d-flex flex-row align-items-center justify-content-end'>
                            <div className={`d-flex flex-row me-3 align-items-start`}>
                                
                                <Button color='primary' type='button' size='sm' className={`pe-4 pt-0 pb-0 me-2`}>
                                    <i className="mdi mdi-checkbox-multiple-marked-outline fs-20 fw-light me-2" style={{verticalAlign: 'middle'}}></i>
                                    Check in
                                </Button>
                                <span title='Есть уведомления'>
                                    <NoticeSVG styleProps={{width: '32px', height: '32px'}}/> 
                                </span>
                            </div>
                            <Dropdown align={'start'} className='me-3'>
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
                            <ArrowBtn borderLeft={true} state={taskCollapse} toggleFunc={toggleTaskCollapse}/>
                        </div>
                    </Card.Header>

                    <Collapse in={taskCollapse}>
                        <Card.Body>
                            <div className='pt-2 mt-2 pb-2 mt-2 border-top'>
                                {/* Заметки */}
                                <div className='mb-2'>
                                    <div className=''>
                                        <Card.Header className={`${cl.visibleBlock} `}>
                                            <div 
                                                className={`d-flex flex-row align-items-center position-relative pe-5 ${cl.arrowIconBlock} ${notesCollapse ? cl.transformIcon : ''}`}
                                                onClick={() => {setNotesCollapse(!notesCollapse)}}
                                            >
                                                <span className='fw-semibold fs-14 me-2'>Заметки</span>
                                                <IconArrowDown size='xs'/>
                                            </div>
                                        </Card.Header>
                                        <Collapse in={notesCollapse}>
                                            <Card.Body >
                                                <div className={`${cl.notesContainer}  pt-3 pb-3`}>
                                                    <div>
                                                        <div className={cl.notesRow}>
                                                            <div className={`p-2 ${cl.notesBorder}`}>
                                                                <div className='fs-12 mb-1 text-body-tertiary'>Ковалев Роман 10.11.2023 :</div>
                                                                <div className='fs-14'>
                                                                    <span className='fw-bold'>Опредили Яндекс Клауд как поставщика инфраструктурных услуг</span>
                                                                </div>
                                                                <div className='d-flex flex-row align-items-center flex-wrap'>
                                                                    <Attachment
                                                                        as="a"
                                                                        title='название файла'
                                                                        href="https://www.youtube.com/watch?v=dAZKu_ojb14"
                                                                        withPictogram={true}
                                                                        fileName=""
                                                                        fileExtension="pdf"
                                                                        withAction={true}
                                                                        size='m'
                                                                        fileDescription=""
                                                                        className={`${cl.attachmentFile}`}
                                                                        target='_blank'
                                                                    />
                                                                    <Attachment
                                                                        as="a"
                                                                        title='название файла'
                                                                        withPictogram={true}
                                                                        href="https://www.youtube.com/watch?v=dAZKu_ojb14"
                                                                        fileName=""
                                                                        fileExtension="doc"
                                                                        withAction={true}
                                                                        size='m'
                                                                        fileDescription=""
                                                                        className={`${cl.attachmentFile}`}
                                                                        target='_blank'
                                                                    />
                                                                    <Attachment
                                                                        as="a"
                                                                        title='название файла'
                                                                        withPictogram={true}
                                                                        href="https://www.youtube.com/watch?v=dAZKu_ojb14"
                                                                        fileName=""
                                                                        fileExtension="bzz"
                                                                        withAction={true}
                                                                        size='m'
                                                                        fileDescription=""
                                                                        className={`${cl.attachmentFile}`}
                                                                        target='_blank'
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='p-2'>
                                                                <span className='fw-semibold text-body font-monospace fs-18 position-relative'>
                                                                    50%
                                                                    <span className={`${cl.notesProgressBg} text-success fs-15`}>
                                                                        +5%
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={cl.notesRow}>
                                                            <div className={`p-2 ${cl.notesBorder}`}>
                                                                <div className='fs-12 mb-1 text-body-tertiary'>Ковалев Роман 10.11.2023 :</div>
                                                                    <div className='fs-14'>
                                                                        <span className='fw-bold'>Утвердили риск модель, тестируем с бизнесом</span>
                                                                    </div>
                                                                    <div className='d-flex flex-row align-items-center flex-wrap'>
                                                                    <Attachment
                                                                        as="a"
                                                                        title='название файла'
                                                                        withPictogram={true}
                                                                        href="https://www.youtube.com/watch?v=dAZKu_ojb14"
                                                                        fileName=""
                                                                        fileExtension="jpg"
                                                                        withAction={true}
                                                                        size='m'
                                                                        fileDescription=""
                                                                        className={`${cl.attachmentFile}`}
                                                                        target='_blank'
                                                                    />
                                                                    <Attachment
                                                                        as="a"
                                                                        title='название файла'
                                                                        withPictogram={true}
                                                                        href="https://www.youtube.com/watch?v=dAZKu_ojb14"
                                                                        fileName=""
                                                                        fileExtension="bzz"
                                                                        withAction={true}
                                                                        size='m'
                                                                        fileDescription=""
                                                                        className={`${cl.attachmentFile}`}
                                                                        target='_blank'
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='p-2'>
                                                                <span className='fw-semibold text-body font-monospace fs-18 position-relative'>
                                                                    32%
                                                                    <span className={`${cl.notesProgressBg} text-danger fs-15`}>
                                                                        -15%
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Card className='w-100 p-2 br-15'>
                                                            <div className={`pb-2 mb-2 border-bottom`}>
                                                                <div className='d-flex flex-row align-items-center'>
                                                                    <div className='me-2'>
                                                                        <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-sm" />
                                                                    </div>
                                                                    <div>
                                                                        <span className='fw-semibold text-body'>
                                                                            Ковалев Р.А.
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>  
                                                            <div>
                                                                <div className='d-flex flex-column'>
                                                                    <div className={`${cl.cardItem}`}>
                                                                        <span className=' text-body-tertiary'>Создание</span>
                                                                        <span className='fw-semibold text-body'>30.06.2013</span>
                                                                    </div>

                                                                    <div className={`${cl.cardItem}`}>
                                                                        <span className=' text-body-tertiary'>KR задачи</span>
                                                                        <span className='fw-semibold text-body'>6</span>
                                                                    </div>

                                                                    <div className={`${cl.cardItem}`}>
                                                                        <span className=' text-body-tertiary'>Канбан</span>
                                                                        <span className='fw-semibold text-body'>
                                                                            <a href='#'>
                                                                                <IconKanban size='m'/>
                                                                            </a>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="avatar-group avatar-group-responsible flex-nowrap me-2">
                                                                    <OverlayTrigger
                                                                        placement={'top'}
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${top}`} className='bg-body'>
                                                                                Иванов Иван Иванович
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <div className="avatar-group-item">
                                                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger
                                                                        placement={'top'}
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${top}`} className='bg-body'>
                                                                            Иванов Иван Иванович
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <div className="avatar-group-item">
                                                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger
                                                                        placement={'top'}
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${top}`} className='bg-body'>
                                                                            Иванов Иван Иванович
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <div className="avatar-group-item">
                                                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger
                                                                        placement={'top'}
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${top}`} className='bg-body'>
                                                                                Добавить/Изменить список ответсвенных
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <div className="avatar-group-item">
                                                                            <button className="rounded-circle border border-dashed border-white border-2 avatar-xs">
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Collapse>
                                    </div>
                                </div>

                                {/* Подзадачи */}
                                <div>
                                    <div>
                                        <Card.Header className={`${cl.visibleBlock} position-relative pe-5`}>        
                                            <div 
                                                className={`d-flex flex-row align-items-center position-relative pe-5 ${cl.arrowIconBlock} ${childsCollapse ? cl.transformIcon : ''}`}
                                                onClick={() => {setChildCollapse(!childsCollapse)}}
                                            >
                                                <span className='fw-semibold fs-14 me-2'>Подзадачи</span>
                                                <IconArrowDown size='xs'/>
                                            </div>          
                                        </Card.Header>
                                        <Collapse in={childsCollapse}>
                                            <Card.Body>
                                                <div className={`pt-3 pb-3 ${cl.krList}`}>
                                                    {/* child тестовый, чтобы посмотреть вложенность */}
                                                    {/*}
                                                    <KRItem 
                                                        key={useId()} 
                                                        child={[
                                                            {
                                                                child: [{
                                                                    child : [{
                                                                        child: [{
                                                                            child: [{
                                                                                child: [{}],
                                                                                key: useId(),
                                                                            }],
                                                                            key: useId(),
                                                                        }],
                                                                        key: useId(),
                                                                    }],
                                                                    key : useId(),
                                                                }],
                                                                key : useId(),
                                                            }
                                                        ]}/>
                                                    <KRItem/>
                                                    */}
                                                </div>
                                            </Card.Body>
                                        </Collapse>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Collapse>
                </div>  
            </div>    
        </div>
    )
}



export default OKRItem;
