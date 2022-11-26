import React, { FC, MouseEventHandler, ReactElement } from "react";
import { IconType } from "react-icons";

interface Props {
    className?: string;
    icon: ReactElement;
    text: string;
    onClick?: MouseEventHandler;
}

const MenuIcon: FC<Props> = ({ className, icon, text, onClick }) => {
    return (
        <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : '' }} className={className}><>{React.cloneElement(icon, { size: '30px' })}<br />{text}</></div>
    )
}

export default MenuIcon;