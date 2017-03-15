import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeButton, BadgeButtonProps } from "../BadgeButton";

describe("BadgeButton", () => {
    const createBadgeButton = (props: BadgeButtonProps) => shallow(createElement(BadgeButton, props));

    describe("should render the structure", () => {
        const badgeProps: BadgeButtonProps = { badgeValue: "0", label: "default" };
        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent).toBeElement(
            createElement("button",
                {
                    className: classNames("widget-badgebutton btn",
                        { [`btn-${badgeProps.style}`]: !!badgeProps.style })
                },
                DOM.span({ className: "widget-badgebutton-text" }, badgeProps.label),
                DOM.span({ className: "badge" }, badgeProps.badgeValue)
            )
        );
    });

    it("should render with style 'success'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "success",
            style: "success"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-success")).toBe(true);
    });
});
