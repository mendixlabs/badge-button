import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeProps } from "./Badge";

export const BadgeButton = (props: BadgeProps) =>
    createElement("button",
        {
            className: classNames("widget-badge btn",
                { [`btn-${props.style}`]: !!props.style }
            ),
            onClick: props.onClick
        },
        DOM.span({ className: "widget-badge-text" }, props.label),
        DOM.span({ className: "badge" }, props.badgeValue)
    );
