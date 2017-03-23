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
                    className: classNames("widget-badgebutton btn",
                        { [`btn-${badgeProps.style}`]: !!badgeProps.style }
                    ),
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badgebutton-text" }, badgeProps.label),
                DOM.span({ className: "badge" }, badgeProps.value),
                createElement(Alert)
            )
        );
    });

    it("with click function should respond to click event", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            onClickAction: jasmine.createSpy("onClick"),
            value: "0"
        };
        const onClick = badgeProps.onClickAction = jasmine.createSpy("onClick");
        const badge = createBadgeButton(badgeProps);

        badge.simulate("click");

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should render with style 'default'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "default"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-default")).toBe(true);
    });

    it("should render with style 'primary'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "primary"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-primary")).toBe(true);
    });

    it("should render with style 'success'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "success"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-success")).toBe(true);
    });

    it("should render with style 'info'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "info"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-info")).toBe(true);
    });

    it("should render with style 'warning'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "warning"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-warning")).toBe(true);
    });

    it("should render with style 'danger'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "Custom Label",
            style: "danger"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-danger")).toBe(true);
    });
});
