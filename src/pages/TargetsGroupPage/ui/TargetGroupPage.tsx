/* Hooks */
import { useState } from 'react';

/* Redux */
import { useSelector } from 'react-redux';

/* Widgets */
import DiagramAboutBravo from '@/widgets/DiagramAboutBravo';
import StrategyTargetsList from '@/widgets/StrategyTargetsList';

/* Entities */
import GuidingPurpose from '@/entities/guidingPurpose';

/* Components */
import { Button } from '@/shared/ui/Button';
import { SearchInput } from '@/shared/ui/SearchInput';
import { AnimationPage } from '@/shared/ui/AnimationPage';

/* Icons */
import { IconAdd } from '@consta/icons/IconAdd';
import { CreateTargetModal } from '@/features/CreateTargetModal';
import { useTitle } from '@/shared/hooks/useTitle';


const TargetGroupPage = () => {
    useTitle('Цели группы');

    const [searchValue, setSearchValue] = useState('');
    const [openTargetModal, setIsOpenTargetModal] = useState(false);
    function changeSearchValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value)
    }
    const currentUser = useSelector((state: any) => state?.userData?.user);
    return (
        <>
        <AnimationPage >
                
            <div className='p-3'>
                <h1 className='mb-0' style={{ fontSize: '36px' }}>Карта стратегических целей группы ТКБ</h1>
                <DiagramAboutBravo />

                <div className='d-flex justify-content-between align-items-end mb-3'>
                    <GuidingPurpose />

                    {currentUser.role === 'super-user' && (
                        <Button className='px-4 py-2' color='primary' onClick={() => setIsOpenTargetModal(true)}>
                            <IconAdd className='me-2' style={{ color: '#FFF' }} />
                            Новая стратегическая цель
                        </Button>
                    )}
                </div>


                <div>
                    <StrategyTargetsList />
                </div>
            </div>
        </AnimationPage>
        {openTargetModal && <CreateTargetModal closeFunc={() => setIsOpenTargetModal(false)}/>}
        </>
    );
}

export default TargetGroupPage;
