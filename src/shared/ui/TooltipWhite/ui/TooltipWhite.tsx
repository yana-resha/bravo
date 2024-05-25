import React, { Children, useEffect } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";


type tooltipProps = {
    position?: 'top' | 'bottom' | 'left' | 'right',
    children: React.ReactElement,
    el?: React.ReactNode,
    content: React.ReactNode | React.ReactElement | string,
    childrenContainerStyle?: React.CSSProperties,
    withoutMaxWidth?: boolean,
}




export function TooltipWhite ({position, children, content, childrenContainerStyle = {}, withoutMaxWidth = false} : tooltipProps) {

    
    return (
        <OverlayTrigger
        
        placement={position}
        trigger={["hover", "hover"]}
        overlay={
            <Popover 
            style={{maxWidth: withoutMaxWidth ? '100%' : '300px'}}
            id={`popover-positioned-${position}`}>
            <Popover.Body style={{paddingTop: '8px', paddingBottom: '8px'}}>
                {content}
            </Popover.Body>
            </Popover>
        }
        >
            <span style={childrenContainerStyle}>
                {children}
            </span>        
        </OverlayTrigger>

        
    )
}