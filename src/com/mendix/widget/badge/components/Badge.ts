import { Component, DOM, MouseEventHandler, StatelessComponent , createElement } from "react";
import * as classNames from "classnames";

export type BadgeOnclick = "doNothing" | "showPage" | "callMicroflow";
export type PageSettings = "content" | "popup" | "modal";

export const ValidationAlert: StatelessComponent<{ message: string }> = (props) =>
    DOM.div({ className: "alert alert-danger widget-validation-message" }, props.message);

export interface OnClickProps {
    onClickType: BadgeOnclick;
    microflowProps?: {
        microflow: string;
        guid: string;
    };
    pageProps?: {
        page: string;
        pageSetting: PageSettings;
        entity: string;
        guid: string;
    };
}

export interface BadgeProps {
    label?: string;
    badgeType: string;
    badgeValue?: string;
    style?: string;
    badgeOnClick?: OnClickProps;
    disabled?: string;
}

export class Badge extends Component<BadgeProps, { alertMessage: string }> {
    static defaultProps: BadgeProps = { badgeType: "badge", label: "default", style: "default" };
    private onClickEvent: MouseEventHandler<HTMLDivElement>;

    constructor(props: BadgeProps) {
        super(props);

        this.onClickEvent = () => this.handleOnClick(this.props.badgeOnClick);
        this.state = { alertMessage: "" };
    }

    componentDidMount() {
        this.checkConfig();
    }

    render() {
        if (this.props.badgeType === "button") {
            return this.createBadgeButton();
        } else if (this.props.badgeType === "label") {
            return this.createBadgeLabel();
        } else {
            return this.createBadge();
        }
    }

    private createBadge() {
        return createElement("div",
            {
                className: classNames("widget-badge-display",
                    { "widget-badge-link": !!this.props.badgeOnClick }
                ),
                onClick: this.onClickEvent
            },
            DOM.span({ className: "widget-badge-text" }, this.props.label),
            DOM.span({
                className: classNames("widget-badge", "badge",
                    { [`label-${this.props.style}`]: !!this.props.style }
                )
            }, this.props.badgeValue),
            this.state.alertMessage ? createElement(ValidationAlert, { message: this.state.alertMessage }) : null
        );
    }

    private createBadgeButton() {
        return createElement("button",
            {
                className: classNames("widget-badge btn",
                    { [`btn-${this.props.style}`]: !!this.props.style }
                ),
                disabled: this.props.disabled,
                onClick: this.onClickEvent
            },
            DOM.span({ className: "widget-badge-text" }, this.props.label),
            DOM.span({ className: "badge" }, this.props.badgeValue),
            this.state.alertMessage ? createElement(ValidationAlert, { message: this.state.alertMessage }) : null
        );
    }

    private createBadgeLabel() {
        return createElement("div",
            {
                className: classNames("widget-badge-display",
                    { "widget-badge-link": !!this.props.badgeOnClick }
                ),
                onClick: this.onClickEvent
            },
            DOM.span({ className: "widget-badge-text" }, this.props.label),
            DOM.span({
                className: classNames("widget-badge", "label",
                    { [`label-${this.props.style}`]: !!this.props.style }
                )
            }, this.props.badgeValue),
            this.state.alertMessage ? createElement(ValidationAlert, { message: this.state.alertMessage }) : null
        );
    }

    private checkConfig() {
        const errorMessage: string[] = [];
        if (this.props.badgeOnClick.onClickType === "callMicroflow"
            && !this.props.badgeOnClick.microflowProps.microflow) {
            errorMessage.push("'On click' call a microFlow is set " +
                "and there is no 'Microflow' Selected in tab Events");
        }
        if (this.props.badgeOnClick.onClickType === "showPage" && !this.props.badgeOnClick.pageProps.page) {
            errorMessage.push("'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'");
        }
        if (errorMessage.length > 0) {
            errorMessage.unshift("Error in configuration of the Badge widget");
            this.setState({ alertMessage: errorMessage.join("\n") });
        }
    }

    private handleOnClick(props: OnClickProps) {
        if (props.onClickType === "callMicroflow" && props.microflowProps.microflow && props.microflowProps.guid) {
            window.mx.ui.action(props.microflowProps.microflow, {
                error: (error) => {
                    this.setState({ alertMessage:
                        `Error while executing microflow: ${props.microflowProps.microflow}: ${error.message}`
                    });
                },
                params: {
                    applyto: "selection",
                    guids: [ props.microflowProps.guid ]
                }
            });
        } else if (props.onClickType === "showPage" && props.pageProps.page && props.pageProps.guid) {
            const context = new mendix.lib.MxContext();
            context.setTrackId(props.pageProps.guid);
            context.setTrackEntity(props.pageProps.entity);

            window.mx.ui.openForm(props.pageProps.page, {
                context,
                location: props.pageProps.pageSetting
            });
        }
    }
}
