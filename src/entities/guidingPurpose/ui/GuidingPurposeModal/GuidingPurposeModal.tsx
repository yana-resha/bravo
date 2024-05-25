import cl from "./GuidingPurposeModal.module.scss";
import { Form, Modal } from 'react-bootstrap';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { useState } from "react";
import { editGuidingPurposeName } from "../../model/slices/guidingPurposeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

type Props = {
  onClose: () => void;
}

export function GuidingPurposeModal({ onClose }: Props): JSX.Element {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
  const guidingPurposeName = useSelector((state: StoreReducerType) => state?.guidingPurpose?.name);
  const [editInutText, setEditInputText] = useState(guidingPurposeName);

  const onSave = () => {
    dispatch(editGuidingPurposeName({login: currentUser.login, title: editInutText}));
    onClose();
  }

  return (
    <Modal
      className="targetModal"
      show
      onHide={onClose}
      centered
      dialogClassName={cl.modalDialog}
      contentClassName={cl.contentModal}
      scrollable
      backdrop="static"
    >
      <div className="d-flex flex-row justify-content-between mb-3">
        <div className={cl.modalTitle}>Изменить руководящую идею</div>
        <Button
          color="light"
          onClick={onClose}
          className="pt-0"
          size="sm"
          title="Закрыть модальное окно"
        >
          <i className="ri-close-fill fs-24" />
        </Button>
      </div>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className={cl.label}>
            Наименование руководящей идеи
            <span className={cl.labelStar}>*</span>
          </Form.Label>
          <Form.Control
            className={cl.modalInput}
            type="text"
            maxLength={64}
            placeholder="Введите наименование руководящей идеи, не более 64 символов"
            value={editInutText}
            onInput={(evt) => setEditInputText(evt.currentTarget.value)}
          />
        </Form.Group>
      </Modal.Body>
      <div className="d-flex flex-row justify-content-between mb-2 mt-2">
        <div />
        <div>
          <Button
            borderRadius="pill"
            size="lg"
            color="primary"
            className="me-2"
            onClick={onSave}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  )
}
