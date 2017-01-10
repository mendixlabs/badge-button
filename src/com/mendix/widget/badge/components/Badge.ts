import { DOM, createElement } from "react";
import * as classNames from "classnames";

export interface BadgeProps {
    label?: string;
    badgeValue?: string;
    style?: string;
    onClick?: () => void;
    disabled?: string;
}

export const Badge = (props: BadgeProps) =>
    createElement("div",
        {
            className: classNames("widget-badge-display",
                { "widget-badge-link": !!props.onClick }
            ),
            onClick: props.onClick,
            disabled: props.disabled
        },
        DOM.span({ className: "widget-badge-text" }, props.label),
        DOM.span({
            className: classNames("widget-badge", "badge",
                { [`label-${props.style}`]: !!props.style }
            )
        }, props.badgeValue)
    );
