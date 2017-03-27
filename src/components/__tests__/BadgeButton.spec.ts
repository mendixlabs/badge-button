import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeButton, BadgeButtonProps } from "../BadgeButton";
import { Alert } from "../Alert";

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
                        { [`btn-${badgeProps.style}`]: !!badgeProps.style }
                    ),
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badge-button-text" }, badgeProps.label),
                DOM.span({ className: "badge" }, badgeProps.value),
                createElement(Alert)
            )
        );
    });

    it("with a click function should respond to click event", () => {
        const badgeProps: BadgeButtonProps = { onClickAction: jasmine.createSpy("onClick") };
        const onClick = badgeProps.onClickAction = jasmine.createSpy("onClick");
        const badge = createBadgeButton(badgeProps);

        badge.simulate("click");

        expect(onClick).toHaveBeenCalled();
    });

    it("with style default should render with class btn-default", () => {
        const badgeProps: BadgeButtonProps = { style: "default" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-default")).toBe(true);
    });

    it("with style primary should render with class btn-primary", () => {
        const badgeProps: BadgeButtonProps = { style: "primary" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-primary")).toBe(true);
    });

    it("with style success should render with class btn-success", () => {
        const badgeProps: BadgeButtonProps = { style: "success" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-success")).toBe(true);
    });

    it("with style info should render with class btn-info", () => {
        const badgeProps: BadgeButtonProps = { style: "info" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-info")).toBe(true);
    });

    it("with style warning should render with class btn-warning", () => {
        const badgeProps: BadgeButtonProps = { style: "warning" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-warning")).toBe(true);
    });

    it("with style danger should render with class btn-danger", () => {
        const badgeProps: BadgeButtonProps = { style: "danger" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("btn-danger")).toBe(true);
    });
});
