
import { IconKebab } from '@consta/icons/IconKebab';
import Dropdown from 'react-bootstrap/Dropdown';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import './GuidingPurpose.scss';
import type { GuidingPurposePropsType } from '../types/GuidingPurposePropsType';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { GuidingPurposeModal } from './GuidingPurposeModal/GuidingPurposeModal';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchGuidingPurposeName } from '../model/slices/guidingPurposeSlice';



export function GuidingPurpose() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
  const guidingPurposeName = useSelector((state: StoreReducerType) => state?.guidingPurpose?.name);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchGuidingPurposeName({login: currentUser.login}));
  }, [guidingPurposeName]);

  return (
    <div className="GuidingPurposeItem">
      <div className="GuidingPurposeItem__data">
        <div className="GuidingPurposeItem__label">Руководящая идея</div>
        <div className="GuidingPurposeItem__title">{guidingPurposeName}</div>
      </div>
      <div className="GuidingPurposeItem__control">
        {
          currentUser.role === 'super-user'
          &&
          <Dropdown align="start" className="me-3">
            <CustomDropdownToggle>
              <button className="btn btn-light btn-sm rounded-circle">
                <IconKebab size="l" />
              </button>
            </CustomDropdownToggle>

            <Dropdown.Menu className="end-0">
              <Dropdown.Item onClick={() => setIsModalEditOpen(true)}>Изменить</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
      </div>
      { isModalEditOpen && <GuidingPurposeModal onClose={() => setIsModalEditOpen(false)} />}
    </div>
  );
}