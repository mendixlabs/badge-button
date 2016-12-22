import { DOM, createElement } from "react";
import * as classNames from "classnames";
import { BadgeProps } from "./Badge";

export const BadgeLabel = (props: BadgeProps) =>
    createElement("div",
        {
            className: classNames("widget-badge-display",
                { "widget-badge-link": !!props.onClick }
            ),
            onClick: props.onClick
        },
        DOM.span({ className: "widget-badge-text" }, props.label),
        DOM.span({
            className: classNames("widget-badge", "label",
                { [`label-${props.style}`]: !!props.style }
            )
        }, props.badgeValue)
    );
