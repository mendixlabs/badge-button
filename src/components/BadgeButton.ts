import { DOM, createElement } from "react";

import * as classNames from "classnames";
import { Alert } from "./Alert";

export interface BadgeButtonProps {
    alertMessage?: string;
    label?: string;
    badgeValue?: string;
    style?: string;
    clickable?: string;
    onClickAction?: () => void;
    disabled?: string;
}

export const BadgeButton = (props: BadgeButtonProps) =>
    createElement("button",
        {
            className: classNames("widget-badgebutton btn",
                { [`btn-${props.style}`]: !!props.style }
            ),
            disabled: props.disabled,
            onClick: props.onClickAction
        },
        DOM.span({ className: "widget-badgebutton-text" }, props.label),
        DOM.span({ className: "badge" }, props.badgeValue),
        createElement(Alert, { message: props.alertMessage })
    );
