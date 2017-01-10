import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render } from "react-dom";

import { Badge as BadgeComponent } from "./components/Badge";
import { BadgeButton } from "./components/BadgeButton";
import { BadgeLabel } from "./components/BadgeLabel";

export interface OnClickProps {
    microflow?: string;
    guid?: string;
    applyto?: string;
}

class Badge extends WidgetBase {
    // Attributes from modeler
    private attrValue: string;
    private attrStyle: string;
    private attrLabel: string;
    private badgeType: "btn" | "label" | "badge";
    private label: string;
    private badgeClass: string;
    private onclickMicroflow: string;
    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        callback();
    }

    private updateRendering() {
        const BadgeElement = this.badgeType === "btn" ? BadgeButton
            : this.badgeType === "label" ? BadgeLabel
            : BadgeComponent;

        const clickAble = this.contextObject && this.contextObject.getGuid() && this.onclickMicroflow;

        render(createElement(BadgeElement as any, {
            badgeValue: this.getValue(this.attrValue, ""),
            disabled: this.contextObject ? undefined : "disabled",
            label: this.getValue(this.attrLabel, this.label),
            onClick: clickAble ? () => this.onClickMF() : undefined,
            style: this.getValue(this.attrStyle, this.badgeClass)
        }), this.domNode);
    }

    private getValue(attributeName: string, defaultValue: string) {
        if (this.contextObject) {
            return this.contextObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
    }

    private onClickMF () {
        window.mx.ui.action(this.onclickMicroflow, {
            error: (error: Error) =>
                window.mx.ui.error(`Error while executing MicroFlow: ${this.onclickMicroflow}: ${error.message}`),
            params: {
                applyto: "selection",
                guids: [this.contextObject.getGuid()]
            }
        });
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.attrValue,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.attrStyle,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.attrLabel,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.badge.Badge", [ WidgetBase ],
    (function(Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(Badge))
);
