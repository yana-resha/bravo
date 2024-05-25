import { TooltipWhite } from "@/shared/ui/TooltipWhite";
import './TitleCell.scss';

export const TitleCell = ({ hasChildrenTasks = false, taskCollapse, toggleTaskCollapse, title, className }: any) => {
    return (
        <div 
            onClick={() => {
                if (!hasChildrenTasks) return;
                toggleTaskCollapse();
            }}
            className={`TitleCell ${className}`}
        >
            <div className='me-1' style={{width: '24px', height: '24px'}}>
                { hasChildrenTasks && taskCollapse && (
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}

                { hasChildrenTasks && !taskCollapse && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 6H11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}

                { !hasChildrenTasks && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V11" stroke="#979797" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 6H11" stroke="#979797" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </div>
            <TooltipWhite
                position='top'
                content={title}
                childrenContainerStyle={{overflow: 'hidden'}}
            >
                <div className='text-truncate'>
                    {title}
                </div>
            </TooltipWhite> 
        </div>
    );
}