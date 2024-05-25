import { Link } from 'react-router-dom';
import cl from './successBoardMini.module.scss';
import CupSVG from '@/shared/ui/svg/CupSVG/CupSVG';
import defaultAvatar from '../../../shared/assets/img/users/default-avatar.png';
import { Button } from '@/shared/ui/Button';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import LinkArrowSVG from '@/shared/ui/svg/LinkArrowSVG/LinkArrowSVG';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';


export function SuccessBoardMini () {
    return (
        <div>   
            <Link to={'#'} className={cl.title}>
                Доска особых успехов
                
                
                <span className='ms-2'>
                    <LinkArrowSVG styleProps={{verticalAlign: 'middle',height:"12px", width:"12px", fill:"#9747FF", }}/>
                </span>
                
            </Link>

            <div className={cl.boardList}>
                <div className={cl.boardItem}>
                    <div>

                        <div className={cl.itemTitle}>
                            <CupSVG styleProps={{width: '30px', height: '30px', fill: '#53808C', marginRight: '30px', verticalAlign: '-webkit-baseline-middle'}}/>
                            Рейтинг НКР
                        </div>
                        <div className={cl.itemContent}>
                            <img src={defaultAvatar} className={cl.itemAvatar} title='ФИО' />
                            <div className={cl.itemDescription}>
                                Закрыл сложно структурированную инвестиционную сделку по интеграции ПКБ в бизнес  ТКБ 
                            </div>
                        </div>
                        <div className={cl.actionRow}>
                            <Button className={`${cl.likeBtn} me-3`} onlyIcon={true} title='Поставить лайк'>
                                <i className="mdi mdi-thumb-up"></i>
                            </Button>

                            <div className="avatar-group avatar-group-responsible flex-nowrap">

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                    <div className="avatar-group-item">
                                        <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                    </div>
                                </TooltipWhite>

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                    <div className="avatar-group-item">
                                        <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                    </div>
                                </TooltipWhite>

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                    <div className="avatar-group-item">
                                        <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                    </div>
                                </TooltipWhite>

                                <div className={`avatar-group-item avatar-xs border border-white border-2 rounded-circle ${cl.hiddenAvatars}`}>
                                    +4
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={cl.itemBorder}></div>
                </div>
                <div className={cl.boardItem}>
                    <div>

                        <div className={cl.itemTitle}>
                            <CupSVG styleProps={{width: '30px', height: '30px', fill: '#53808C', marginRight: '30px', verticalAlign: '-webkit-baseline-middle'}}/>
                            Рейтинг НКР
                        </div>
                        <div className={cl.itemContent}>
                            <img src={defaultAvatar} className={cl.itemAvatar} title='ФИО' />
                            <div className={cl.itemDescription}>
                                Закрыл сложно структурированную инвестиционную сделку по интеграции ПКБ в бизнес  ТКБ 
                            </div>
                        </div>
                        <div className={cl.actionRow}>
                            <Button className={`${cl.likeBtn} me-3`} onlyIcon={true} title='Поставить лайк'>
                                <i className="mdi mdi-thumb-up"></i>
                            </Button>

                            <div className="avatar-group avatar-group-responsible flex-nowrap">

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                        <div className="avatar-group-item">
                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                        </div>    
                                </TooltipWhite>

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                        <div className="avatar-group-item">
                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                        </div>    
                                </TooltipWhite>

                                <TooltipWhite position='top' content={
                                    'Иванов Иван Иванович'
                                }>
                                        <div className="avatar-group-item">
                                            <img src={`${defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                        </div>    
                                </TooltipWhite>

                                <div className={`avatar-group-item avatar-xs border border-white border-2 rounded-circle ${cl.hiddenAvatars}`}>
                                    +4
                                </div> 
                            </div>

                        </div>
                    </div>
                    <div className={cl.itemBorder}></div>
                </div>
            </div>
                
        </div>
        
    )
}