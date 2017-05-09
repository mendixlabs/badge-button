import { Component, createElement } from "react";
import { BadgeButton, BadgeButtonProps } from "./components/BadgeButton";
import BadgeButtonContainer, { BadgeButtonContainerProps } from "./components/BadgeButtonContainer";

export class preview extends Component<BadgeButtonContainerProps, {}> {
    render() {
        return createElement(BadgeButton, this.transformProps(this.props));
    }

    private transformProps(props: BadgeButtonContainerProps): BadgeButtonProps {
        return {
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            label: props.label || "[" + props.labelAttribute + "]",
            style: BadgeButtonContainer.parseStyle(props.style),
            value: props.badgeButtonValue || "[" + props.valueAttribute + "]"
        };
    }
}
