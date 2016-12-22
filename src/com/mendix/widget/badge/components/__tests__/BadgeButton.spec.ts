import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Badge, BadgeProps, OnClickProps } from "../Badge";
import { BadgeButton } from "../BadgeButton";

describe("BadgeComponent", () => {
    let badgeProps: BadgeProps;
    beforeEach(() => {
        badgeProps = {
            badgeValue: "0",
            label: "default",
            onClick: jasmine.createSpy("OnClick"),
            style: "default"
        };
    });

    const createBadge = (props: BadgeProps) => shallow(createElement(BadgeButton, props));

    it("should render the structure", () => {
        const badgeComponent = createBadge(badgeProps);
        expect(badgeComponent).toBeElement(
            DOM.button(
                {
                    className: "widget-badge btn btn-default",
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                DOM.span({ className: "badge" }, badgeProps.badgeValue)
            )
        );
    });

    it("with style 'success' should have class 'widget-badge btn btn-success'", () => {
        badgeProps.style = "success";
        const badgeComponent = createBadge(badgeProps);
        expect(badgeComponent.hasClass("widget-badge btn btn-success")).toBe(true);
    });

    it("should respond to click event", () => {
        let clickReturn = 0;
        badgeProps.onClick = () => clickReturn++;
        const badgeComponent = createBadge(badgeProps);

        badgeComponent.simulate("click");

        expect(clickReturn).toBe(1);
    });

    describe("without an onClick microflow", () => {
        it("should render structure", () => {
            badgeProps.onClick = undefined;

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                DOM.button(
                    {
                        className: "widget-badge btn btn-default"
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "badge" }, badgeProps.badgeValue)
                )
            );

        });
    });

});
