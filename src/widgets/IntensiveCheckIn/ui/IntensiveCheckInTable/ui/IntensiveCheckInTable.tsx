import cl from './intensiveCheckInTable.module.scss';
import './intensiveCheckInTable.scss';
import DefaultAvatar from '../../../../../shared/assets/img/users/default-avatar.png';
import { TextField } from "@consta/uikit/TextField";
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { CheckINIntensityStats } from '@/entities/checkIn/types/CheckinType';
import checkinAPIService, { TypeCheckinList } from '@/entities/checkIn/services/CheckinAPIService';
import { Plug } from '@/shared/ui/Plug/PLug';
import { setCheckinUser } from '@/entities/checkIn/model/slices/checkinSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { motion } from 'framer-motion';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';


type EmployeeProps = {
    fio: string;
    avatar: string | null;
    login: string | null;
}

function Employee({ fio, avatar, login }: EmployeeProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const handleSelectDR = () => {
        dispatch(setCheckinUser({ login, fio, avatar }));
    };

    return (
        <motion.div whileHover={{opacity: 0.85}} whileTap={{scale: 0.95}} role='button' className={cl.employeeRow} onClick={handleSelectDR}>
            <div className="me-3">
                <img src={avatar ?? DefaultAvatar} alt='' className="rounded-circle border border-white border-2 avatar-sm" />
            </div>
            <div className={cl.fioText}>{fio}</div>
        </motion.div>
    )
}

type WeekProps = {
    status: string;
    lastDate: string;
}

// функция по созданию кружочков, вынести в компонент
function Week({ status }: WeekProps) {
    let customClass = '';
    switch (status) {
        case 'не все чекин есть':
            customClass = cl.outline;
            break;
        case 'все чекин есть':
            customClass = cl.fill;
            break;
    }
    return (
        <div className="w-100 d-flex justify-content-center">
            <div className={`${cl.value} ${customClass}`} title={status}></div>
        </div>
        
    )
}

type WeekHeaderProps = {
    numberWeek: number;
}

function WeekHeader({ numberWeek }: WeekHeaderProps) {
    return (
        <div className='w-100 d-flex justify-content-center align-items-center'>
            <div className={cl.weekHeaderCell}>{numberWeek}</div>
        </div>
    )
}

type AdaptItem = {
    user: {
        login: string;
        fio: string;
        avatar: string | null;
    };
    months: {
        name: string;
        weeks: {
            lastDate: string,
            status: string
        }[];
    }[];
};

type AdaptData = AdaptItem[];

export function IntensiveCheckInTable () {
    let numberRenderWeek = 0;
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [currentData, setCurrentData] = useState<AdaptData>();
    const [searchText, setSearchText] = useState<string | null>(null);
    const [filtredData, setFiltredData] = useState<AdaptData>();
    const handleSearch = setSearchText;

    const searchUser = (text: string, data: AdaptData) => data
        .filter((item => item.user.fio.toLowerCase().includes(text.toLowerCase())));

    const adaptData = (data: CheckINIntensityStats): AdaptData => data.map((item) => {
        const newItem: AdaptItem = {
            user: {...item.user},
            months: []
        };
        item.weeks
            .slice()
            .reverse()
            .forEach((wk) => {
                const currentMonth = moment(wk.lastDate).locale('ru').format('MMMM');

                if (newItem.months.findIndex(({ name }) => name === currentMonth) !== -1) {
                    const month = newItem.months.find(({ name }) => name === currentMonth);
                    if (month?.weeks) {
                        month.weeks = [
                            ...month.weeks,
                            wk
                        ];
                    }
                } else {
                    newItem.months.push({
                        name: currentMonth,
                        weeks: [wk],
                    });
                }
            })
        return newItem;
    });

    const filterFavoritesDR = (data: CheckINIntensityStats) => {
        const searchUsers = ['khabas', 'mikhalev_aa', 'kovalev_ra', '11pushkin_av'];
        return data.filter(item => searchUsers.includes(item.user.login));
    }

    const getIntensiveCheckin = async () => {
        await checkinAPIService.getList(TypeCheckinList.IntensityStats, { login: currentUser.login })
            .then((response) => {
                if (response !== null) {
                    currentUser.login === 'ivanovskiy_el'
                        ? setCurrentData(adaptData(filterFavoritesDR(response)))
                        : setCurrentData(adaptData(response));
                }
            });
    }
    
    useEffect(() => {
        if (!currentData) getIntensiveCheckin();
        else if (searchText) {
            setFiltredData(searchUser(searchText, currentData))
            return;
        }

        setFiltredData(currentData);
    }, [currentData, searchText]);

    return (
        <div className="intensive-checkin-wrapper">
            <table className='intensive-checkin'>
                <thead className='intensive-checkin__head'>
                    <tr>
                        <th className='intensive-checkin__cell--search' scope="col" rowSpan={2}>
                            <TextField
                                onChange={handleSearch}
                                value={searchText}
                                form="round" 
                                placeholder="Cотрудник"
                                size="s"
                                className={'tableSearchInput'}
                                rightSide={IconSearchStroked}
                                view="clear"
                            />
                        </th>
                        {currentData && currentData[0].months.map((item) => (
                            <th 
                                className={`intensive-checkin__month ${item.weeks.length < 3 && 'intensive-checkin__month--short'}`}
                                scope="col" 
                                colSpan={item.weeks.length}
                            >
                                { item.name }
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {currentData && currentData[0].months.map((item) => item.weeks.map(() => {
                            numberRenderWeek++;
                            
                            return <th className="intensive-checkin__cell intensive-checkin__cell--week" scope="col"><WeekHeader numberWeek={numberRenderWeek} /></th>
                    }))}
                    </tr>
                </thead>
                <tbody>
                    {
                    filtredData?.length
                        ? filtredData.map((data, index) => {
                            return (
                                <tr>
                                    <th className='intensive-checkin__cell--user' scope="row">
                                        <Employee {...data.user} />
                                    </th>

                                    {data.months.map((item) => {
                                        return item.weeks.map((week, index) => {
                                            const extremeClass = item.weeks.length - 1 === index
                                            ? 'intensive-checkin__cell--extreme'
                                            : '';

                                            return <td className={`intensive-checkin__col ${extremeClass}`}><Week {...week} /></td>
                                        })
                                    })}
                                </tr>
                            )
                        })
                        : <tr><td colSpan={13}><Plug title="Не найдено" /></td></tr>
                    }
                </tbody>
            </table>
        </div>
    )
}