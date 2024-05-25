
import CloseModalBtn from '@/shared/ui/CloseModalBtn';
import { ApprovalItem } from './ApprovalItem';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { AnimatePresence, motion } from "framer-motion";
import { ReadResponse } from '@/entities/request';

type ListApprovalsCardPropsType = {
    task: any,
    closeModalFunc: Function,
    isShow: boolean
}

export const ListApprovalsCard = ({ task, closeModalFunc, isShow }: ListApprovalsCardPropsType) => {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const approvalsSlice = useSelector((state: StoreReducerType) => state?.approvalsList);
    const sortedApprovalsList = useSelector((state: StoreReducerType) => state?.approvalsList.list
        .toSorted((_: ReadResponse, approval: ReadResponse) => (approval.status !== null) ? -1 : 1));

    return (
        <AnimatePresence>
            <motion.div 
                className={`TaskCard__tab`}
                animate={isShow ? "show" : "hide"}
                transition={{ duration: 0.5,}}
                initial={"hide"}
                variants={{
                    show: {
                        x: 0,
                        opacity: 1,
                        display: 'block',
                    },

                    hide: {
                        x: -100,
                        opacity: 0,
                        display: 'none',
                    }
                }}
            >
                <div className="TaskCard__tab" id="TaskCard-ServiceMessages">
                
                    <div className="TaskCard__tabTitle">Список согласований</div>

                    <div className="ServiceMessagesList">
                        { Boolean(approvalsSlice.loading) && (
                            <div>Загрузка</div>
                        )}

                        { Boolean(approvalsSlice.error) && (
                            <div>Ошибка: {approvalsSlice.error}</div>
                        )}

                        { !approvalsSlice.list.length && (
                            <div>Список пуст</div>
                        )}

                        { Boolean(sortedApprovalsList.length) && (
                            sortedApprovalsList.map((approvalItem: any) => {
                                return (
                                    <ApprovalItem key={approvalItem.id} taskData={task} {...approvalItem}/>
                                )
                            })
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}