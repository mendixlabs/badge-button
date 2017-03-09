import { DOM , createElement } from "react";

import * as classNames from "classnames";
import { Alert } from "./Alert";

export type BadgeButtonOnclick = "doNothing" | "showPage" | "callMicroflow";
export type PageSettings = "content" | "popup" | "modal";

export interface BadgeButtonProps {
    alertMessage?: string;
    label?: string;
    badgeValue?: string;
    style?: string;
    microflow?: string;
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
