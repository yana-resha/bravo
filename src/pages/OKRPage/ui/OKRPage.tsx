
import { useTitle } from '@/shared/hooks/useTitle';
import { AnimationPage } from '@/shared/ui/AnimationPage';
import { ScrollupBtn } from '@/shared/ui/ScrollupBtn';
import { OKRList } from '@/widgets/OKRList';
import { OKRListV2 } from '@/widgets/OKRList/ui/OKRList/OKRList.v2';
import { useRef } from 'react';


// ------------------------------------
// Временное версионирование страниц
type OKRPageProps = {
    version?: number;
}

function OKRPage ({ version = 1 }: OKRPageProps) {
    const pageRef = useRef<null | HTMLDivElement>(null);
    useTitle('Задачи');
    return (
        <AnimationPage
        ref={pageRef}
        >
            <ScrollupBtn
            parentContainer={pageRef}
            />
            {version === 2 ? <OKRListV2 /> : <OKRList />}
        </AnimationPage>
    )
}
export default OKRPage;
