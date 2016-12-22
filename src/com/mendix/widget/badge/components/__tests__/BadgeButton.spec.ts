import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Badge, BadgeProps } from "../Badge";
import { BadgeButton } from "../BadgeButton";

describe("Badge button", () => {
    let badgeProps: BadgeProps;
    const createBadge = (props: BadgeProps) => shallow(createElement(BadgeButton, props));

    beforeEach(() => {
        badgeProps = {
            badgeValue: "0",
            label: "default",
            onClick: jasmine.createSpy("OnClick"),
            style: "default"
        };
    });

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

    describe("click event", () => {

        it("with click function should respond to click event", () => {
            const onClick = badgeProps.onClick = jasmine.createSpy("onClick");
            const badgeComponent = createBadge(badgeProps);

            badgeComponent.simulate("click");

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it("without click function should render structure", () => {
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
