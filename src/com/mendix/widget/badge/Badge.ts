import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render } from "react-dom";
import { Badge, BadgeType, OnClickProps } from "./components/Badge";
import { BadgeButton } from "./components/BadgeButton";
import { BadgeLabel } from "./components/BadgeLabel";

class BootstrapBadge extends WidgetBase {
    // Attributes from modeler
    private attrValue: string;
    private attrStyle: string;
    private attrLabel: string;
    private badgeType: BadgeType;
    private label: string;
    private badgeClass: string;
    private onclickMicroflow: string;
    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private handles: number[];

    postCreate() {
        this.handles = [];
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        callback();
    }

    unsubscribe() {
        for (let handle of this.handles) {
            mx.data.unsubscribe(handle);
        }
    }

    private updateRendering() {
        const BadgeElement = this.badgeType === "btn"
            ? BadgeButton
            : this.badgeType === "label"
                ? BadgeLabel : Badge;

        const clickParams = {
                applyto: "selection",
                guid: this.contextObject ? this.contextObject.getGuid() : "",
                microflow: this.onclickMicroflow
        };

        const clickAble = this.contextObject && this.contextObject.getGuid() && this.onclickMicroflow;

        render(createElement(BadgeElement as any, {
            badgeValue: this.getValue(this.attrValue, ""),
            label: this.getValue(this.attrLabel, this.label),
            onClick: clickAble ? () => this.onClickMF(this.onClickProps()) : undefined,
            style: this.getValue(this.attrStyle, this.badgeClass)
        }), this.domNode);
    }

    private getValue(attributeName: string, defaultValue: string) {
        if (this.contextObject) {
            return this.contextObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
    }
    private onClickProps(): OnClickProps {
        return ({
            applyto: "selection",
            guid: this.contextObject ? this.contextObject.getGuid() : "",
            microflow: this.onclickMicroflow
        });
    }

    private onClickMF (props: OnClickProps) {
        if (props.microflow && props.guid) {
            window.mx.ui.action(props.microflow, {
                error: (error: Error) =>
                    window.mx.ui.error(`Error while executing MicroFlow: ${props.microflow}: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids: [ props.guid ]
                }
            });
        }
    }

    private resetSubscriptions() {
        this.unsubscribe();

        if (this.contextObject) {
            this.handles.push(mx.data.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            }));
            this.handles.push(mx.data.subscribe({
                attr: this.attrValue,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            }));
            this.handles.push(mx.data.subscribe({
                attr: this.attrStyle,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            }));
            this.handles.push(mx.data.subscribe({
                attr: this.attrLabel,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            }));
        }
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare(
    "com.mendix.widget.BootstrapBadge.BootstrapBadge",
    [ WidgetBase ],
    (function(Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(BootstrapBadge))
);
