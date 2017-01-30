import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render } from "react-dom";

import { BadgeButton as BadgeButtonComponent, BadgeButtonOnclick, PageSettings } from "./components/BadgeButton";

class BadgeButton extends WidgetBase {
    // Attributes from modeler
    private valueAttribute: string;
    private styleAttribute: string;
    private labelAttribute: string;
    private label: string;
    private badgeClass: string;
    private microflow: string;
    onClickEvent: BadgeButtonOnclick;
    page: string;
    pageSettings: PageSettings;

    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

   update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = contextObject;
        this.resetSubscriptions();
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

   private updateRendering() {
       render(createElement(BadgeButtonComponent, {
           microflow: {
               microflowProps: {
                   guid: this.contextObject ? this.contextObject.getGuid() : undefined,
                   name: this.microflow
               },
               onClickType: this.onClickEvent,
               pageProps: {
                   entity: this.contextObject ? this.contextObject.getEntity() : undefined,
                   guid: this.contextObject ? this.contextObject.getGuid() : undefined,
                   page: this.page,
                   pageSetting: this.pageSettings
               }
           },
           badgeValue: this.getValue(this.valueAttribute, ""),
           disabled: this.contextObject ? undefined : "disabled",
           label: this.getValue(this.labelAttribute, this.label),
           style: this.getValue(this.styleAttribute, this.badgeClass)
       }), this.domNode);
   }

    private getValue(attributeName: string, defaultValue: string) {
        if (this.contextObject) {
            return this.contextObject.get(attributeName) as string || defaultValue;
        }
        return defaultValue;
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
dojoDeclare("com.mendix.widget.badgebutton.BadgeButton", [ WidgetBase ], (function(Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(BadgeButton))
);
