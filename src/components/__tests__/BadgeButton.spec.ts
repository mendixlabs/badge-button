import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeButton, BadgeButtonProps } from "../BadgeButton";

describe("BadgeButton", () => {
    const createBadgeButton = (props: BadgeButtonProps) => shallow(createElement(BadgeButton, props));

    it("should render the structure", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            onClickAction: jasmine.createSpy("onClick"),
            value: "0"
        };
        const badge = createBadgeButton(badgeProps);

        expect(badge).toBeElement(
            createElement("button",
                {
                    className: classNames("widget-badge-button btn",
                        { [`btn-${badgeProps.bootstrapStyle}`]: !!badgeProps.bootstrapStyle }
                    ),
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badge-button-text" }, badgeProps.label),
                DOM.span({ className: "badge" }, badgeProps.value)
            )
        );
    });

    it("with a click action should respond to click events", () => {
        const badgeProps: BadgeButtonProps = { onClickAction: jasmine.createSpy("onClick") };
        const onClick = badgeProps.onClickAction = jasmine.createSpy("onClick");
        const badge = createBadgeButton(badgeProps);

        badge.simulate("click");

        expect(onClick).toHaveBeenCalled();
    });

    it("with bootstrap style default should have the class btn-default", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "default" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-default")).toBe(true);
    });

    it("with bootstrap style primary should have the class btn-primary", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "primary" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-primary")).toBe(true);
    });

    it("with bootstrap style success should have the class btn-success", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "success" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-success")).toBe(true);
    });

    it("with bootstrap style info should have the class btn-info", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "info" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-info")).toBe(true);
    });

    it("with bootstrap style warning should have the class btn-warning", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "warning" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-warning")).toBe(true);
    });

    it("with bootstrap style danger should have the class btn-danger", () => {
        const badgeProps: BadgeButtonProps = { bootstrapStyle: "danger" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-danger")).toBe(true);
    });
});
