import { Component, DOM, StatelessComponent , createElement } from "react";

import * as classNames from "classnames";
import { Alert } from "./Alert";

export type BadgeButtonOnclick = "doNothing" | "showPage" | "callMicroflow";
export type PageSettings = "content" | "popup" | "modal";

export const ValidationAlert: StatelessComponent<{ message: string }> = (props) =>
    DOM.div({ className: "alert alert-danger widget-validation-message" }, props.message);

export interface BadgeButtonProps {
    alertMessage?: string;
    label?: string;
    badgeValue?: string;
    style?: string;
    microflow?: string;
    onClickAction?: () => void;
    disabled?: string;
}

export class BadgeButton extends Component<BadgeButtonProps, { alertMessage?: string }> {
    static defaultProps: BadgeButtonProps = { label: "default", style: "default" };

    constructor(props: BadgeButtonProps) {
        super(props);

        this.state = { alertMessage: props.alertMessage };
    }

    componentWillReceiveProps(newProps: BadgeButtonProps) {
        if (newProps.alertMessage !== this.props.alertMessage) {
            this.setState({ alertMessage: newProps.alertMessage });
        }
    }

    render() {
        return createElement("button",
            {
                className: classNames("widget-badgebutton btn",
                    { [`btn-${this.props.style}`]: !!this.props.style }
                ),
                disabled: this.props.disabled,
                onClick: this.props.onClickAction
            },
            DOM.span({ className: "widget-badgebutton-text" }, this.props.label),
            DOM.span({ className: "badge" }, this.props.badgeValue),
            createElement(Alert, { message: this.state.alertMessage })
        );
    }
}
