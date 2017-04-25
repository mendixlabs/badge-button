import { DOM, SFC, createElement } from "react";
import * as classNames from "classnames";

import "../ui/BadgeButton.css";

export interface BadgeButtonProps {
    className?: string;
    style?: object;
    label?: string;
    value?: string;
    bootstrapStyle?: BootstrapStyle;
    onClickAction?: () => void;
}

type BootstrapStyle = "default" | "info" | "primary" | "danger" | "success" | "warning";

const BadgeButton: SFC<BadgeButtonProps> = (props) =>
    createElement("button",
        {
            className: classNames("widget-badge-button btn", {
                [`btn-${props.bootstrapStyle}`]: !!props.bootstrapStyle
            }),
            onClick: props.onClickAction,
            style: props.style
        },
        DOM.span({ className: "widget-badge-button-text" }, props.label),
        DOM.span({ className: "badge" }, props.value)
    );

export { BadgeButton, BootstrapStyle };
