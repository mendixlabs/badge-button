import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render } from "react-dom";

import { Badge as BadgeComponent } from "./components/Badge";
import { BadgeButton } from "./components/BadgeButton";
import { BadgeLabel } from "./components/BadgeLabel";

export interface OnClickProps {
    onClickType: badgeOnclick;
    microflowProps?: MicroflowProps;
    pageProps?: PageProps;
}

export interface MicroflowProps {
    microflow: string;
    guid: string;
}

export interface PageProps {
    page: string;
    pageSetting: PageSettings;
    entity: string;
    guid: string;
}

export type badgeOnclick = "doNothing" | "showPage" | "callMicroflow";
export type PageSettings = "content" | "popup" | "modal";

class Badge extends WidgetBase {
    // Attributes from modeler
    private valueAttribute: string;
    private styleAttribute: string;
    private labelAttribute: string;
    private badgeType: "button" | "label" | "badge";
    private label: string;
    private badgeClass: string;
    private microflow: string;
    onClickEvent: badgeOnclick;
    page: string;
    pageSettings: PageSettings;

    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();
        this.checkConfig();

        callback();
    }

    private updateRendering() {
        const BadgeElement = this.badgeType === "button" ? BadgeButton
            : this.badgeType === "label" ? BadgeLabel
            : BadgeComponent;

        const clickable = this.contextObject && this.microflow;

        render(createElement(BadgeElement as any, {
            badgeValue: this.getValue(this.valueAttribute, ""),
            disabled: this.contextObject ? undefined : "disabled",
            label: this.getValue(this.labelAttribute, this.label),
            onClick: () => this.onClickMicroflow({
                microflowProps: {
                    guid: this.contextObject.getGuid(),
                    microflow: this.microflow
                },
                onClickType: this.onClickEvent,
                pageProps: {
                    entity: this.contextObject.getEntity(),
                    guid: this.contextObject.getGuid(),
                    page: this.page,
                    pageSetting: this.pageSettings
                }
            }),
            style: this.getValue(this.styleAttribute, this.badgeClass)
        }), this.domNode);
    }

    private getValue(attributeName: string, defaultValue: string) {
        if (this.contextObject) {
            return this.contextObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
    }

    private checkConfig() {
        const errorMessage: string[] = [];
        if (this.onClickEvent === "callMicroflow"
            && !this.microflow) {
            errorMessage.push("'On click' call a microFlow is set " +
                "and there is no 'Microflow' Selected in tab Events");
        }
        if (this.onClickEvent === "showPage" && !this.page) {
            errorMessage.push("'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'");
        }
        if (errorMessage.length > 0) {
            errorMessage.unshift("Error in configuration of the Progress circle widget");
            window.mx.ui.error(errorMessage.join("\n"));
        }
    }

    private onClickMicroflow(props: OnClickProps) {
        if (props.onClickType === "callMicroflow" && props.microflowProps.microflow && props.microflowProps.guid) {
            window.mx.ui.action(this.microflow, {
                error: (error: Error) =>
                    window.mx.ui.error(`Error while executing MicroFlow: ${this.microflow}: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids: [ this.contextObject.getGuid() ]
                }
            });
        } else if (props.onClickType === "showPage" && props.pageProps.page && props.pageProps.guid) {
            const context = new window.mendix.lib.MxContext();
            context.setTrackId(props.pageProps.guid);
            context.setTrackEntity(props.pageProps.entity);

            window.mx.ui.openForm(props.pageProps.page, {
                context,
                location: props.pageProps.pageSetting
            });
        }
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.valueAttribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.styleAttribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.labelAttribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.badge.Badge", [ WidgetBase ], (function(Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(Badge))
);
