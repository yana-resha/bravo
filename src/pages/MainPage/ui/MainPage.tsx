import { IntensiveCheckInBlock } from "@/widgets/IntensiveCheckIn";
import { PersonalBlock } from "@/widgets/PersonalBlock";
import { PriorityTaskBlock } from "@/widgets/PriorityTasksBlock";
import cl from './mainPage.module.scss';
import { SelfRatingBlock } from "@/widgets/SelfRating";
import { MyCurrentProgress } from "@/widgets/MyCurrentProgress";
import { MyProgressHistory } from "@/widgets/MyProgressHistory";
import { CheckInEvents } from "@/widgets/CheckInEvents";
import { ProgressHistory } from "@/widgets/ProgressHistory";
import { SuccessBoard } from "@/widgets/SuccessBoard";
import { AnimationPage } from "@/shared/ui/AnimationPage";
import { useTitle } from "@/shared/hooks/useTitle";

function MainPage() {
    useTitle('Я - Браво');

    return (
        <AnimationPage>
            <div className={`${cl.gridRow} mt-5 mb-3`}>
                <IntensiveCheckInBlock />
                <div>
                    <div>
                        <MyCurrentProgress className="mb-3" />
                        <MyProgressHistory />
                    </div>
                </div>
            </div>
            <CheckInEvents className={`mb-3`} />
        </AnimationPage>
    )
}

export default MainPage