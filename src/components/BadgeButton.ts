import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";

import "../ui/BadgeButton.css";

export interface BadgeButtonProps {
    alertMessage?: string;
    label?: string;
    value?: string;
    style?: string;
    clickable?: string;
    onClickAction?: () => void;
}

export const BadgeButton = (props: BadgeButtonProps) =>
    createElement("button",
        {
            className: classNames("widget-badge-button btn", { [`btn-${props.style}`]: !!props.style }),
            onClick: props.onClickAction
        },
        DOM.span({ className: "widget-badge-button-text" }, props.label),
        DOM.span({ className: "badge" }, props.value),
        createElement(Alert, { message: props.alertMessage })
    );
