import { ProgressModal } from '../ProgressModal/ProgressModal';
import { ProgressBar, typeProgressBar } from '../ProgressBar/ProgressBar';
import { useId, useState } from 'react';
import { Progress } from '../../data/progressData';

type Props = {
    progressData: Progress;
}

export function Progress({ progressData}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {name, icon, completedCount, progress, complexity, description, stats, details} = progressData;

    return (
        <>
            <ProgressBar
                type={typeProgressBar.button}
                openHandler={() => setIsModalOpen(true)}
                name={name}
                isVisibilityName={false}
                completedCount={completedCount}
                progress={progress}
                SVGIcon={icon}
            />
            <ProgressModal
                name={name}
                closeHandler={() => setIsModalOpen(false)}
                isOpened={isModalOpen}
                completedCount={completedCount}
                complexity={complexity}
                description={description}
                progress={progress}
                SVGIcon={icon}
                stats={stats}
                details={details}
            />
        </>
    )
}
