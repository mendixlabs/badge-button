import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Badge, BadgeProps, OnClickProps } from "../Badge";

describe("Badge", () => {
    let badgeProps: BadgeProps;
    let onClickProps: {};

    beforeEach(() => {

        badgeProps = {
            badgeValue: "0",
            label: "default",
            onClick: jasmine.createSpy("OnClick"),
            style: "default"
        };
    });

    const createBadge = (props: BadgeProps) => shallow(createElement(Badge, props));

    describe("of type badge", () => {

        it("should render the structure", () => {
            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                DOM.div(
                    {
                        className: "widget-badge-display",
                        onClick: jasmine.any(Function) as any
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "widget-badge badge label-default" }, badgeProps.badgeValue)
                )
            );
        });

        it("with style 'success' should have class 'widget-badge badge label-success'", () => {
            badgeProps.style = "success";
            const badgeComponent = createBadge(badgeProps);
            expect(badgeComponent.childAt(1).hasClass("widget-badge badge label-success")).toBe(true);
        });

        it("should respond to click event", () => {
            let clickReturn = 0;
            badgeProps.onClick = () => clickReturn++;
            const badgeComponent = createBadge(badgeProps);

            badgeComponent.simulate("click");

            expect(clickReturn).toBe(1);
        });

    });

    // describe("with an onClick microflow", () => {
    //     it("executes the microflow when a badge / label item is clicked", () => {
    //         spyOn(window.mx.ui, "action").and.callThrough();
    //         const badgeComponent = createBadge(badgeProps);

    //         badgeComponent.simulate("click");

    //         expect(window.mx.ui.action).toHaveBeenCalledWith(badgeProps.MicroflowProps.microflow, {
    //             error: jasmine.any(Function),
    //             params: {
    //                 applyto: "selection",
    //                 guids: [ badgeProps.MicroflowProps.guid ]
    //             }
    //         });
    //     });
    // });

    describe("without an onClick microflow", () => {

        it("should render the structure", () => {
            badgeProps.onClick = undefined;

            const badgeComponent = createBadge(badgeProps);
            expect(badgeComponent).toBeElement(
                DOM.div(
                    {
                        className: "widget-badge-display"
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "widget-badge badge label-default" }, badgeProps.badgeValue)
                )
            );

        });
    });

});
