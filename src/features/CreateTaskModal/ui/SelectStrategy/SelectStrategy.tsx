
import { useEffect, useState } from "react";
import cl from './SelectStrategy.module.scss';
import { Button } from "@/shared/ui/Button";
import { SelectStrategyGroupType, SelectStrategyItemType } from "../../types/SelectStrategyDataTypes";
import { IndicatorValuesType } from "../../types/IndicatorValuesType";
import { AutoCompleteInput } from '@/features/AutoCompleteInput';


export type SelectStrategyPropsType = {
    index?: number | string | false,
    closeBtn?: boolean,
    closeFunc?: (index: number | string) => void,
    isLoading?: boolean,
    groups?: SelectStrategyGroupType [],
    items: SelectStrategyItemType [],
    changeIndicatorValues: (value: IndicatorValuesType) => void;
    className?:string,
    placeholder?: string,
    defaultValue?: {id: number | string, type: SelectStrategyGroupType['type']} | null,
  }

export function CustomItem({item, onClick, active} : {item: any, onClick: (id: string) => void, active: boolean}) {
    return (
      <div
        aria-selected={active}
        aria-hidden="true"
        onClick={() => {
          console.log('onCLick')
    
        }}
        className={`${cl.listItem} d-flex`}
        >
            {item.title}
            <div className={cl.itemType}>{'test'}</div>
        </div>
    )
}
  

export function SelectStrategy(props : SelectStrategyPropsType) {
    const {
    closeBtn = false, 
    closeFunc = (value) => {}, 
    isLoading = false, 
    groups=[], 
    items,
    changeIndicatorValues,
    className = "",
    index = false,
    placeholder="",
    defaultValue = null,
    } = props;
    const [value, setValue] = useState< SelectStrategyItemType | null>(null);

    useEffect(() => {
      if (defaultValue) {
        let item = items.find(el => el.id == defaultValue.id && el.taskType == defaultValue.type);
        if (item) {
          setValue(item);
          changeIndicatorValues({...item, index: index, type: item.taskType});
          
        } else {
          setValue(null);
          changeIndicatorValues({index: index});
        }
      } else {
        setValue(null);
        changeIndicatorValues({index: index});
      }
      
    }, [items]);

    const changeHandler = (item : any | null) => {
      if (item) {
         changeIndicatorValues({...item, index: index, type: item.taskType});
      } else {
        changeIndicatorValues({index: index});
      }
    }
    
    return (
      <div className="d-flex flex-direction-row flex-nowrap align-items-center mb-3">
        <AutoCompleteInput 
            getItemID={'id'}
            getItemLabel={'title'}
            placeholder={placeholder}
            isListLoad={isLoading}
            list={ items }
            setValues={changeHandler}
            defaultValue={value}
            CustomItem={({item, handlerClick, active}) => {
                const itemType = groups.find(group => item.groupId == group.id);
                return (
                  <div
                    onClick={() => {
                      handlerClick(item.id)
                    }}
                    className={`${cl.listItem} d-flex`}
                    >
                        {item.title}
                        <div className={cl.itemType}>{itemType?.label}</div>
                    </div>
                )
            }}
        />

          {
            closeBtn && (
                <Button
                  onClick={() => {
                    changeIndicatorValues({index: index});
                    if (index) closeFunc(index);
                  }}
                  color="light"
                  borderRadius="circle"
                  size="sm"
                  className={cl.closeBtn}
                  >
                    <i className="ri-close-line"></i>
                </Button>
            )
          }
          
      </div>

        

    )
}