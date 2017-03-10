import { Component, createElement } from "react";

import { BadgeButton, BadgeButtonOnclick, PageSettings } from "./BadgeButton";
import { Alert } from "./Alert";

interface BadgeButtonContainerProps {
    contextObject: mendix.lib.MxObject;
    valueAttribute: string;
    styleAttribute: string;
    labelAttribute: string;
    label: string;
    badgeClass: string;
    microflow: string;
    onClickEvent: BadgeButtonOnclick;
    page: string;
    pageSettings: PageSettings;
}

interface BadgeButtonContainerState {
    alertMessage?: string;
    badgeValue: string;
    label: string;
    showAlert?: boolean;
    style: string;
}

class BadgeButtonContainer extends Component<BadgeButtonContainerProps, BadgeButtonContainerState> {
    private subscriptionHandles: number[];

    constructor(props: BadgeButtonContainerProps) {
        super(props);

        this.state = {
            alertMessage: this.checkConfig(),
            badgeValue: this.getValue(props.valueAttribute, ""),
            label: this.getValue(props.labelAttribute, this.props.label),
            showAlert: !!this.checkConfig(),
            style: this.getValue(props.styleAttribute, props.badgeClass)
        };
        this.subscriptionHandles = [];
        this.resetSubscriptions(props.contextObject);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    render() {
        if (this.state.showAlert) {
            return createElement(Alert, { message: this.state.alertMessage });
        }

        return createElement(BadgeButton, {
            alertMessage: this.state.alertMessage,
            badgeValue: this.state.badgeValue,
            disabled: this.props.contextObject ? undefined : "disabled",
            label: this.state.label,
            microflow: this.props.microflow,
            onClickAction: this.handleOnClick,
            style: this.state.style
        });
    }

    componentWillReceiveProps(newProps: BadgeButtonContainerProps) {
        this.resetSubscriptions(newProps.contextObject);
        this.updateValues();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    private updateValues() {
        this.setState({
            badgeValue: this.getValue(this.props.valueAttribute, ""),
            label: this.getValue(this.props.labelAttribute, this.props.label),
            style: this.getValue(this.props.styleAttribute, this.props.badgeClass)
        });
    }

    private getValue(attributeName: string, defaultValue: string) {
        if (this.props.contextObject) {
            return this.props.contextObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
    }

    private resetSubscriptions(contextObject: mendix.lib.MxObject) {
        this.unsubscribe();

        if (contextObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.updateValues(),
                guid: contextObject.getGuid()
            }));

            [ this.props.valueAttribute, this.props.styleAttribute, this.props.labelAttribute ].forEach((attr) =>
                this.subscriptionHandles.push(window.mx.data.subscribe({
                    attr,
                    callback: () => this.updateValues(),
                    guid: contextObject.getGuid()
                }))
            );
        }
    }

    private unsubscribe() {
        if (this.subscriptionHandles) {
            this.subscriptionHandles.forEach((handle) => window.mx.data.unsubscribe(handle));
        }
    }

    private checkConfig(): string {
        let errorMessage = "";
        if (this.props.onClickEvent === "callMicroflow" && !this.props.microflow) {
            errorMessage = "on click microflow is required";
        } else if (this.props.onClickEvent === "showPage" && !this.props.page) {
            errorMessage = "on click page is required";
        }
        if (errorMessage) {
            errorMessage = `Error in badge button configuration: ${errorMessage}`;
        }

        return errorMessage;
    }

    private handleOnClick() {
        if (this.props.onClickEvent === "callMicroflow"
            && this.props.microflow && this.props.contextObject.getGuid()) {
            const context = new mendix.lib.MxContext();
            context.setTrackId(this.props.contextObject.getGuid());
            context.setTrackEntity(this.props.contextObject.getEntity());

            window.mx.ui.action(this.props.microflow, {
                error: (error) => {
                    this.setState({
                        alertMessage:
                        `Error while executing microflow: ${this.props.microflow}: ${error.message}`,
                        showAlert: false
                    });
                },
                params: {
                    applyto: "selection",
                    guids: [ this.props.contextObject.getGuid() ]
                }
            });
        } else if (this.props.onClickEvent === "showPage"
            && this.props.page && this.props.contextObject.getGuid()) {
            const context = new mendix.lib.MxContext();
            context.setTrackId(this.props.contextObject.getGuid());
            context.setTrackEntity(this.props.contextObject.getEntity());

            window.mx.ui.openForm(this.props.page, {
                 error: (error) =>
                    this.setState({
                        alertMessage: `Error while opening page ${this.props.page}: ${error.message}`,
                        showAlert: false
                    }),
                context,
                location: this.props.pageSettings
            });
        }
    }
}

export { BadgeButtonContainer as default };
