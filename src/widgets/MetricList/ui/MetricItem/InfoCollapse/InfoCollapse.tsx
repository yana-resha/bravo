import "./InfoCollapse.scss";
import { IconArrowDown } from "@consta/icons/IconArrowDown";
import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";

type InfoCollapseProps = {
    title: string | JSX.Element;
    control?: JSX.Element;
    children: JSX.Element;
    closeCollapse?: boolean;
}

export function InfoCollapse({ title, control, children, closeCollapse = false }: InfoCollapseProps): JSX.Element {
    const [isOpenCollapse, setIsOpenCollapse] = useState<boolean>(false);

    useEffect(() => {
        if (closeCollapse === true) setIsOpenCollapse(false)
    }, [closeCollapse])
    return (
        <div className={`info-collapse ${isOpenCollapse && 'info-collapse--opened'}`}>
            <div className='info-collapse__header'>
                <p className="info-collapse__title" onClick={() => setIsOpenCollapse(!isOpenCollapse)}>
                    { title }
                    <IconArrowDown className="info-collapse__title-arrow" size='xs' />
                </p>
                { control }
            </div>
            <Collapse className="info-collapse__info" in={isOpenCollapse}>{ children }</Collapse>
        </div>
    )
}
