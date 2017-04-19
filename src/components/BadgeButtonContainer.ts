import { Component, createElement } from "react";

import { BadgeButton } from "./BadgeButton";
import { Alert } from "./Alert";

interface BadgeButtonContainerProps {
    mxObject: mendix.lib.MxObject;
    valueAttribute: string;
    styleAttribute: string;
    labelAttribute: string;
    label: string;
    badgeStyle: string;
    badgeButtonValue: string;
    microflow: string;
    onClickEvent: OnClickOptions;
    page: string;
}

interface BadgeButtonContainerState {
    alertMessage?: string;
    value: string;
    label: string;
    showAlert?: boolean;
    style: string;
}

type OnClickOptions = "doNothing" | "showPage" | "callMicroflow";

export default class BadgeButtonContainer extends Component<BadgeButtonContainerProps, BadgeButtonContainerState> {
    private subscriptionHandles: number[];

    constructor(props: BadgeButtonContainerProps) {
        super(props);

        this.state = {
            alertMessage: this.validateProps(),
            label: this.getValue(props.mxObject, props.labelAttribute, this.props.label),
            showAlert: !!this.validateProps(),
            style: this.getValue(props.mxObject, props.styleAttribute, props.badgeStyle),
            value: this.getValue(props.mxObject, props.valueAttribute, props.badgeButtonValue)
        };
        this.subscriptionHandles = [];
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    render() {
        if (this.state.showAlert) {
            return createElement(Alert, { message: this.state.alertMessage });
        }

        return createElement(BadgeButton, {
            alertMessage: this.state.alertMessage,
            clickable: this.props.microflow,
            label: this.state.label,
            onClickAction: this.handleOnClick,
            style: this.state.style,
            value: this.state.value
        });
    }

    componentWillReceiveProps(newProps: BadgeButtonContainerProps) {
        this.resetSubscriptions(newProps.mxObject);
        this.updateValues(newProps.mxObject);
    }

    componentWillUnmount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    }

    private updateValues(mxObject: mendix.lib.MxObject) {
        this.setState({
            label: this.getValue(mxObject, this.props.labelAttribute, this.props.label),
            style: this.getValue(mxObject, this.props.styleAttribute, this.props.badgeStyle),
            value: this.getValue(mxObject, this.props.valueAttribute, this.props.badgeButtonValue)
        });
    }

    private getValue(mxObject: mendix.lib.MxObject, attributeName: string, defaultValue: string) {
        if (mxObject) {
            return mxObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
    }

    private resetSubscriptions(mxObject: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);

        if (mxObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.updateValues(mxObject),
                guid: mxObject.getGuid()
            }));

            [ this.props.valueAttribute, this.props.styleAttribute, this.props.labelAttribute ].forEach((attr) =>
                this.subscriptionHandles.push(window.mx.data.subscribe({
                    attr,
                    callback: () => this.updateValues(mxObject),
                    guid: mxObject.getGuid()
                }))
            );
        }
    }

    private validateProps(): string {
        let errorMessage = "";
        if (this.props.onClickEvent === "callMicroflow" && !this.props.microflow) {
            errorMessage = "on click microflow is required";
        } else if (this.props.onClickEvent === "showPage" && !this.props.page) {
            errorMessage = "on click page is required";
        }
        if (errorMessage) {
            errorMessage = `Error in badge button configuration: ${errorMessage}`;
        }

        return errorMessage && `Error in badge button configuration: ${errorMessage}`;
    }

    private handleOnClick() {
        const { mxObject, onClickEvent, microflow, page } = this.props;
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        const context = new mendix.lib.MxContext();
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (onClickEvent === "callMicroflow" && microflow && mxObject.getGuid()) {
            window.mx.ui.action(microflow, {
                error: (error) => window.mx.ui.error(`Error while executing microflow: ${microflow}: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids: [ mxObject.getGuid() ]
                }
            });
        } else if (onClickEvent === "showPage" && page && mxObject.getGuid()) {
            window.mx.ui.openForm(page, {
                context,
                error: (error) => window.mx.ui.error(`Error while opening page ${page}: ${error.message}`)
            });
        }
    }
}
