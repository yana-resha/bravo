import { Form, Modal, Spinner} from 'react-bootstrap';
import cl from './checkIN.module.scss';
import './editorCustom.scss';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import  {DeltaStatic,Sources} from 'quill'
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/shared/ui/Button';
import { CheckINCreateRequest, CheckINUpdateRequest, CheckinItemType, CheckinStatus } from '@/entities/checkIn/types/CheckinType';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { Field } from '@/shared/ui/Field';
import { useCurrentTask } from '../libs/hooks/useCurrentTask';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { useHistory } from '../libs/hooks/useHistory';
import { statuses } from '../data/statuses';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';
import { useProcent } from '../libs/hooks/useProcent';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import CheckinAPIService from '@/entities/checkIn/services/CheckinAPIService';
import { SpinnerButton } from '@/shared/ui/SpinnerButton';
import { updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import getProgressPlanColor from '@/entities/task/utils/getProgressPlanColor';
import moment from 'moment';
import { getWeekStartEndDate } from '@/entities/checkIn/utils/getWeekStartEndDate';
import { AvatarItem } from '@/shared/ui/Avatar';
import { StarList } from '@/shared/ui/StarList';
import { DragModal } from '@/shared/ui/DragModal';
import { motion, useDragControls } from 'framer-motion'

type CheckINProps = {
    closeFunc: () => void;
    id?: string | null,
    parentID?: string | null,
}

export function CheckINModal ({closeFunc, id = null, parentID = null} : CheckINProps) {
       
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const dispatch = useDispatch();
    const toolRefInput = useRef(null);
    const toolRefComment = useRef(null);

    const [defaultTask, setDefaultTask] = useState<string | null>(id);
    const {currentTask, taskList, taskListLoading, changeCurrentTask, updateTask} = useCurrentTask({parentID});
    const {historyList, historyListLoading, historiesLength, currentData, addNewCheckIN, changeCheckIN, historyReloading, getReloadCheckinList} = useHistory({currentTaskID: currentTask?.id??null})
    const [editorValue, setEditorValue] = useState('');
	const [clearValue, setClearValue] = useState('');
    const [statusValue, setStatusValue] = useState<CheckinStatus>(statuses[0].id);
    const {lastProcent, currentProcent, changeLastProcent, changeCurrentProcent, setValidCurrentProcent} = useProcent();
    const [formLoading, setFormLoading] = useState(false);

    const controls = useDragControls()

    useEffect(() => {
        if (!taskListLoading && defaultTask) {
            changeCurrentTask(taskList.find(el => el.id == defaultTask)??taskList[0]);
        }
        
    }, [taskList]);


    const setNextTask = () => {
        let pos = taskList.map(e => e.id).indexOf(currentTask?.id??"");
        if (pos >= 0) {
            pos = pos + 1;
            if (pos >= taskList.length) pos = 0;
            setDefaultTask(taskList[pos].id);
            changeCurrentTask(taskList[pos]);
        }
    }
    useEffect(() => {
        if (currentData) {
            setStatusValue(currentData.ciStatus);
            setEditorValue(currentData.title);
            changeCurrentProcent(currentData.procent??Number(currentData.progresschange)??0);
        } else {
            setEditorValue('')
            const procent = historyList.find(el => el.procent && el.procent > 0)?.procent;
            changeCurrentProcent(procent??0);
        }
        changeLastProcent(currentTask?.progress ? Number(currentTask?.progress) : 0);
    }, [currentData]);

    const setRequest = () => {
        if (!currentTask) return false;

        if (lastProcent !== currentProcent && !clearValue.trim()) {
            showInfoAlert({
                type: 'error',
                text: 'Добавьте комментарий при изменении прогресса.',
                format: 'full',
            });
            return false;
        }

        let request: any = {
            login: currentUser.login,
            ciStatus: statusValue,
            title: editorValue,
            procent: currentProcent,
            idTask: currentTask?.id,
        }
        if (currentData) request.id = currentData.id;
        return request;
    }

    const postCheckIN = async (request: CheckINCreateRequest, openNextTask = false) => {
        setFormLoading(true);
        try {
            let response = await  CheckinAPIService.createCheckIN(request);
            if (response) {
                addNewCheckIN(response);
                dispatchUpdateItem(response);
                openNextTask
                    ? setNextTask()
                    : closeFunc();
               
                showInfoAlert({
                    type: 'success',
                    text: `CHECK IN по задаче "${currentTask?.title}" успешно создан!`,
                    format: 'mini',
                });
            }
        } catch (error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не удалось создать CHECK IN: ${error.message}. Попробуйте еще раз`,
                format: 'full',
            });
        } finally {
            setFormLoading(false)
        }
    }

    const dispatchUpdateItem = (response: CheckinItemType) => {
        const dispatchItem = {
            id: response.idTask, 
            statusCheckin: response.ciStatus, 
            procent: response.procent,
        };
        dispatch(updateOKRTask(dispatchItem));
        dispatch(updateChildTask(dispatchItem));
    }

    const updateCheckIN = async (request : CheckINUpdateRequest, openNextTask = false) => {
        setFormLoading(true);
        try {
            let response = await  CheckinAPIService.updateCheckIN(request);
            
            if (response) {
                changeCheckIN(response);
                dispatchUpdateItem(response);
                if (openNextTask) setNextTask();
                else closeFunc();

                
                showInfoAlert({
                    type: 'success',
                    text: `CHECK IN (oт ${currentData?.updateDate}) по задаче "${currentTask?.title}" успешно изменен!`,
                    format: 'mini',
                });
            }
        } catch (error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не удалось создать CHECK IN: ${error.message}. Попробуйте еще раз`,
                format: 'full',
            });
        } finally {
            setFormLoading(false)
        }
    }

    const handlerSubmit = async (goNext = false) => {
        let request = setRequest();
        if (request) {
            !currentData
                ? await postCheckIN(request, goNext)
                : await updateCheckIN(request, goNext);
                updateTask();
        }
    }
    
    const editorHandler = (value: string,_: DeltaStatic,__: Sources,editor: ReactQuill.UnprivilegedEditor) => {
			setEditorValue(value)
			setClearValue(editor?.getText())
		} 

    const getStarStatus = (lastCheckinStatus: CheckinStatus) => {
        switch (lastCheckinStatus) {
            case CheckinStatus.danger: return 'danger';
            case CheckinStatus.warning: return 'warning';
            default: return 'success';
        }
    }


	const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
		if (
			event.target instanceof HTMLElement &&
			event.target.id === 'drag-modal-header'
		) {
			controls.start(event)
		}
	}
   
	return (
		<DragModal controls={controls} dialogClassName={cl.modalDialog}>
			{/* заголовок */}
			<div
				id='drag-modal-header'
				onPointerDown={startDrag}
				className={`d-flex flex-row justify-content-between align-items-start border-bottom ${cl.header}`}
			>
				<div className={cl.title}>
					<div>
						Check-in по задаче{' '}
						{currentTask?.id ? `"${currentTask.title}"` : null}
					</div>
					<StarList
						classList={cl.titleStars}
						status={getStarStatus(historyList[0]?.ciStatus)}
						value={currentTask?.complexity ?? 0}
					/>
				</div>
				<Button
					color='light'
					onClick={closeFunc}
					className='pt-0 pb-0'
					size='sm'
					title='Закрыть модальное окно'
				>
					<i className='ri-close-fill fs-24'></i>
				</Button>
			</div>

			{/* тело */}
			<Modal.Body className={`${cl.contentContainer}`}>
				<div className={`${cl.gridContainer}`}>
					<div className={`${cl.leftContainer}`}>
						<Field
							label={'Выберите текущий статус и укажите прогресс по задаче:'}
							className={`mb-3`}
							labelClassname={cl.label}
						>
							<div className={`${cl.statusValuesContainer}`}>
								<div key={'1'}>
									<Form.Check type={'radio'} id={`check-api-radio-1`}>
										<Form.Check.Input
											checked={statusValue == CheckinStatus.normal}
											type={'radio'}
											className={cl.check}
											onChange={() => {
												setStatusValue(CheckinStatus.normal)
											}}
											name='status'
										/>
										<Form.Check.Label
											className={cl.checkLabel}
										>{`По плану`}</Form.Check.Label>
									</Form.Check>
								</div>
								<div key={'2'}>
									<Form.Check
										type={'radio'}
										id={`check-api-radio-2`}
										name='status'
										className={cl.checkLabel}
									>
										<Form.Check.Input
											type={'radio'}
											className={cl.check}
											name='status'
											checked={statusValue == CheckinStatus.warning}
											onChange={() => {
												setStatusValue(CheckinStatus.warning)
											}}
										/>
										<Form.Check.Label>{`С опозданием`}</Form.Check.Label>
									</Form.Check>
								</div>
								<div key={'3'}>
									<Form.Check
										type={'radio'}
										id={`check-api-radio-3`}
										name='status'
										className={cl.checkLabel}
									>
										<Form.Check.Input
											checked={statusValue == CheckinStatus.danger}
											type={'radio'}
											className={cl.check}
											onChange={() => {
												setStatusValue(CheckinStatus.danger)
											}}
											name='status'
										/>
										<Form.Check.Label>{`Под угрозой`}</Form.Check.Label>
									</Form.Check>
								</div>
							</div>
						</Field>
						{currentTask?.calcType == 0 && (
							<div className={cl.progressInputs}>
								<div className={cl.progressInputContainer}>
									<Input
										borderRadius='default'
										className={`${cl.progressInput}`}
										type='number'
										value={`${lastProcent}`}
										disabled={true}
										handlerInput={() => {}}
										handlerBlur={() => {}}
										size='sm'
										iconRigth={<>%</>}
									/>
									<div className={cl.labelInfo}>
										<TooltipWhite
											position='top'
											content={'Прогресс с прошлого Check in'}
										>
											<i
												ref={toolRefInput}
												className={`ri-information-line`}
												style={{
													color: '#9A9FA5',
													cursor: 'pointer',
												}}
											/>
										</TooltipWhite>
									</div>
								</div>
								<div>-{'>'}</div>
								<div className={cl.progressInputContainer}>
									<Input
										borderRadius='default'
										size='sm'
										className={cl.progressInput}
										type='number'
										value={`${currentProcent}`}
										disabled={false}
										handlerBlur={setValidCurrentProcent}
										handlerInput={value => {
											changeCurrentProcent(value)
										}}
										iconRigth={<>%</>}
									/>
								</div>
							</div>
						)}

						<Field
							labelClassname={`${cl.planValueLabel}`}
							className={`mb-3`}
							label={
								<>
									Плановый прогресс
									<TooltipWhite
										position='top'
										content={'Исходя из оставшихся дней по работе над задачей'}
									>
										<i
											className='d-block ri-information-line me-1 ms-1 fw-normal fs-16'
											ref={toolRefComment}
											style={{
												cursor: 'pointer',
											}}
										/>
									</TooltipWhite>
									-&nbsp;&nbsp;
									{currentTask && currentTask.createDate && currentTask.dueDate
										? getProgressPlanColor(
												lastProcent,
												new Date(
													moment(currentTask.dueDate, 'DD.MM.YYYY').format(
														'YYYY-MM-DD'
													)
												),
												new Date(
													moment(currentTask.createDate, 'DD.MM.YYYY').format(
														'YYYY-MM-DD'
													)
												)
										  ).planValue + '%'
										: 'Не установлен дэдлайн'}
								</>
							}
						></Field>
						<Field
							labelClassname={`${cl.planValueLabel}`}
							label={
								<>
									Комментарий к Check In
									<TooltipWhite
										position='top'
										content={'Добавьте краткий комментарий о выполнении задачи'}
									>
										<i
											ref={toolRefComment}
											style={{
												cursor: 'pointer',
											}}
											className='d-inline-block ri-information-line ms-2 fw-normal fs-16'
										></i>
									</TooltipWhite>
								</>
							}
							className={`mb-3`}
						>
							<div>
								<ReactQuill
									theme='snow'
									value={editorValue}
									onChange={editorHandler}
									className={`${cl.editor}`}
								/>
							</div>
						</Field>
					</div>
					<div className={cl.rightContainer}>
						<div className={cl.historyTitle}>История:</div>
						<div
							className='customScroll'
							style={{
								maxHeight: '80%',
								height: '100%',
								minHeight: 'fit-content',
							}}
						>
							<div className={cl.historyList}>
								{historyList.map(item => {
									let statusColor = bgThemeEnum.success
									if (item.ciStatus == CheckinStatus.danger)
										statusColor = bgThemeEnum.danger
									if (item.ciStatus == CheckinStatus.warning)
										statusColor = bgThemeEnum.warning

									const [start, end] = item.cd
										? getWeekStartEndDate(
												Number(item.cd.split('-')[1]),
												item.cd.split('-')[0],
												'DD.MM.YYYY'
										  )
										: ['_', '_']

									let weekDay =
										item.cd &&
										item.cd
											.split('-')
											.reverse()
											.map((el, index) => {
												if (index == 0) {
													if (el.startsWith('0')) {
														el = el.substring(1)
													}
													el = el + '-я неделя'
												}
												return el
											})
											.join(' ')

									return (
										<div key={item.id ?? item.cd} className={cl.historyItem}>
											<div className={cl.historyItemHeader}>
												<div className={cl.historyItemTitle}>
													{!item.ciSeen && item.id && (
														<TooltipWhite content='Чекин не просмотрен руководителем!'>
															<span className={cl.historyItemIsSeen}></span>
														</TooltipWhite>
													)}
													{weekDay}&nbsp;
													<span className={cl.historyItemTitleStartEnd}>
														({start} - {end})
													</span>
												</div>

												{item.id && (
													<div className={cl.historyItemStats}>
														<Badge
															className={cl.historyItemStatus}
															theme={statusColor}
														>
															{item.ciStatus}
														</Badge>
														<div className={cl.historyItemProgress}>
															{item.progresschange ?? 0}% -{'>'}{' '}
															{item.procent ?? 0}%
														</div>
													</div>
												)}
											</div>

											{item.id && (
												<div className={cl.historyItemBody}>
													{item.title.replace(/<[^>]+>/g, '').length ? (
														<div
															className={cl.historyItemComment}
															dangerouslySetInnerHTML={{ __html: item.title }}
														/>
													) : (
														<div
															className={`${cl.historyItemComment} ${cl.historyItemCommentNoComment}`}
														>
															Без комментария
														</div>
													)}

													<div className={cl.historyItemUserInfo}>
														<AvatarItem
															className={cl.historyItemUserAvatar}
															login={item.updateLogin}
															fio={item.updateFIO}
														/>
														<div className={cl.historyItemDateComment}>
															{item.updateDate}
														</div>
													</div>
												</div>
											)}

											{!item.id && (
												<div
													className={`${cl.historyItemComment} ${cl.historyItemCommentNoCheckin}`}
												>
													Check-in не произведен
												</div>
											)}
										</div>
									)
								})}
								{historyList.length === 0 && (
									<div
										style={{
											backgroundColor: '#80B8F0',
											borderRadius: '14px',
											padding: '15px',
											textAlign: 'center',
											fontSize: '12px',
											fontWeight: '600',
											color: 'black',
											marginTop: '15px',
										}}
									>
										По выбранной задаче еще не было CHECK IN - ов
									</div>
								)}
							</div>
						</div>
						{historiesLength > 0 && (
							<div className='d-flex flex-row justify-content-center'>
								<Button
									disabled={historyReloading}
									color='outline-dark'
									size='sm'
									onClick={() => getReloadCheckinList()}
								>
									<i
										className='ri-arrow-down-line me-2'
										style={{ verticalAlign: 'middle' }}
									></i>
									Загрузить еще
									{historyReloading && (
										<SpinnerButton classNames='ms-2' size='sm' />
									)}
									{!historyReloading && ` (${historiesLength})`}
								</Button>
							</div>
						)}
					</div>
				</div>
				{(taskListLoading || historyListLoading || formLoading) && (
					<div className={cl.modalLoader}>
						<Spinner animation='border' variant='primary' />
						<div className='mt-1'>
							{taskListLoading
								? 'Загружаем список ваших задач'
								: historyListLoading
								? 'Загружаем последние CHECK IN-ы'
								: 'Отправляем данные на сервер'}
						</div>
					</div>
				)}
			</Modal.Body>
			<div
				className={`d-flex flex-row justify-content-between align-items-center pt-3 pb-3 ${cl.modalFooter}`}
			>
				<div></div>
				<div>
					<Button
						onlyIcon={true}
						className={`${cl.footerBtn} me-3`}
						disabled={formLoading || taskListLoading || historyListLoading}
						onClick={() => closeFunc()}
					>
						Отмена
					</Button>
					<Button
						color='primary'
						disabled={formLoading || taskListLoading || historyListLoading}
						onlyIcon={true}
						className={`${cl.footerBtn} me-2`}
						onClick={() => handlerSubmit(false)}
					>
						Check in
					</Button>

					{taskList.length > 1 && (
						<Button
							color='primary'
							onlyIcon={true}
							className={`${cl.footerBtn} me-2`}
							disabled={formLoading || taskListLoading || historyListLoading}
							onClick={() => handlerSubmit(true)}
						>
							Check in и перейти к следующей задаче
						</Button>
					)}
				</div>
			</div>
		</DragModal>
	)
}


        // <Modal
        //     className="checkINModal"
        //     show={true}
        //     onHide={closeFunc}
        //     centered
        //     dialogClassName={cl.modalDialog}
        //     contentClassName={cl.contentModal}
        //     scrollable={true}
        //     backdrop="static"          
        // ></Modal>