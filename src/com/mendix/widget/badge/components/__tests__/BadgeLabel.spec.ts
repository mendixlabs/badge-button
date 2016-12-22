import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { BadgeProps, OnClickProps } from "../Badge";
import { BadgeLabel } from "../BadgeLabel";

import { mockMendix } from "../../../../../../../tests/mocks/Mendix";

describe("BadgeLabel", () => {
    let badgeProps: BadgeProps;

    beforeEach(() => {

        badgeProps = {
            badgeValue: "0",
            label: "default",
            onClick: jasmine.createSpy("OnClick"),
            style: "default"
        };
    });

    const createBadge = (props: BadgeProps) => shallow(createElement(BadgeLabel, props));

    it("should render the structure", () => {
        const badgeComponent = createBadge(badgeProps);
        expect(badgeComponent).toBeElement(
            DOM.div(
                {
                    className: "widget-badge-display",
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                DOM.span({ className: "widget-badge label label-default" }, badgeProps.badgeValue)
            )
        );
    });

    it("with style 'success' should have class 'widget-badge label label-success'", () => {
        badgeProps.style = "success";
        const badgeComponent = createBadge(badgeProps);
        expect(badgeComponent.childAt(1).hasClass("widget-badge label label-success")).toBe(true);
    });

    it("should respond to click event", () => {
        let clickReturn = 0;
        badgeProps.onClick = () => clickReturn++;
        const badgeComponent = createBadge(badgeProps);

        badgeComponent.simulate("click");

        expect(clickReturn).toBe(1);
    });

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
                    DOM.span({ className: "widget-badge label label-default" }, badgeProps.badgeValue)
                )
            );

        });
    });

});
