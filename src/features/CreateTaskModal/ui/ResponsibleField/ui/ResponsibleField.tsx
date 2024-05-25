import { Form } from "react-bootstrap";
import cl from '../../createTaskModal.module.scss';
import { InvalidInputText } from "@/shared/ui/InvalidInputText";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import { ResponsibleSelect } from "./ResponsibleSelect";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";
import { TaskType } from "@/features/CreateTaskModal/types/TaskType";
import { ACTIONTYPE } from "@/features/CreateTaskModal/libs/hooks/okr/useResponsible";
import IResponsible from "@/entities/user/types/IResponsible";

type fieldProps = {
    list: IResponsible[],
    items: IResponsible[],
    listInLoad: boolean,
    showValid: boolean,
    handlerItem: (obj : ACTIONTYPE) => void;
    validError: string | boolean,
    addBtn?: boolean,
    taskType: TaskType| null,
    requare?:boolean,
}

export function ResponsibleField(props: fieldProps) {
    const {
        list, 
        items = [], 
        handlerItem, 
        listInLoad, 
        showValid, 
        addBtn, 
        validError, 
        taskType,
        requare = false,
    } = props;

    const [fields, setFields] = useState<any[]>([]);
    
    // удадяю ответственных доп полей из массива при изменении типа задачи
    useEffect(() => {
        fields.forEach(el => {
            handlerItem({type: 'update', payload: { index: Object.keys(el)[0] }})
        });
        setFields([]);
    }, [taskType]);

    useEffect(() => {
        if (items.length > 1) {
            addInitialRows(items.length - 1);
        }
    }, [items]);

    const addInitialRows = (count:number = 1) => {
        let newArr = [];
        for (let i = 0; i < count; ++i) {
            let newField = {[Math.floor(Math.random() * 1000) + 1] : true, item : items[i + 1]??null};
            newArr.push(newField);
        }
        let itemsArr: IFormResponsible[] = [];
        itemsArr = newArr.map(el => {
            return {
                ...el.item,
                index:Object.keys(el)[0],
            }
        })
        
        setFields([...fields, ...newArr]);
    }
    const addNewRow = () => {
        let newField = {[Math.floor(Math.random() * 1000) + 1] : true};
        setFields([...fields, newField]);
    }
    const deleteRow = (index : string | number) => {
        let currentArr = fields;
        currentArr = currentArr.map(el => {
            if (el[index]) {
                el[index] = false;
            }
            
            return el;
        });
        setFields(currentArr);
    }

    return (
        <Form.Group className={`${cl.w4} flex-grow-1 ms-5`}>
            <Form.Label className={cl.label}>
                Владелец
            </Form.Label>
            <div className={`${cl.w4} mb-2`}>
            <ResponsibleSelect
                key={'-2'}
                list={list}
                item={items[0]}
                validError={validError}
                listInLoad={listInLoad}
                showValid={showValid}
                handlerItem={handlerItem}
                index={undefined}
                requare={requare}
            />
            </div>
            <div>{showValid && <InvalidInputText className='ps-1'>{validError}</InvalidInputText>}</div>
            {fields.map(el => {
                    
                    let show = Object.values(el)[0];
                    let index = Object.keys(el)[0];
                    let item = el.item;
                    if (show) {
                        return (
                            <div 
                            className="position-relative mb-2"
                            key={Object.keys(el)[0]}
                            >
                                <ResponsibleSelect
                                key={index}
                                list={list}
                                item={item}
                                validError={undefined}
                                listInLoad={listInLoad}
                                showValid={false}
                                handlerItem={handlerItem}
                                index={index}
                                />
                                <div 
                                style={{
                                    height: '100%',
                                    right: '-10%',
                                }}
                                className='d-flex flex-row align-items-center position-absolute top-0'
                                >
                                    <Button
                                      onClick={() => {
                                        deleteRow(index);
                                        handlerItem({type: 'update', payload: {index: index}});
                                      }}
                                      color="light"
                                      borderRadius="circle"
                                      size="sm"
                                      className={cl.closeBtn}
                                      >
                                        <i className="ri-close-line"></i>
                                    </Button>
                                </div>
                            </div>
                        )
                    } else {
                        return <></>
                    }
            })
            }
            {
                addBtn && (
                    <Button color='clear'
                        className={cl.addPeriodBtn}
                        onClick={() => addNewRow()}
                    >
                        <i className="bx bx-plus me-1" ></i>
                        Добавить владельца
                    </Button>
                )
            }
        </Form.Group>
    )
}