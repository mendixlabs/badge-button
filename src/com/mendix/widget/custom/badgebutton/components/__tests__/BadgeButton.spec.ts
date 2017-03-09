import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeButton, BadgeButtonProps, ValidationAlert } from "../BadgeButton";

import { MockContext, mockMendix } from "tests/mocks/Mendix";

describe("BadgeButton", () => {
    const createBadgeButton = (props: BadgeButtonProps) => shallow(createElement(BadgeButton, props));

    beforeEach(() => {
        window.mx = mockMendix;
        window.mendix = { lib: { MxContext: MockContext } };
    });

    describe("should render the structure", () => {
        it("for button", () => {
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

        it("for validation alert", () => {
            const message = "This is an error";
            const validationAlert = shallow(createElement(ValidationAlert, { message }));

            expect(validationAlert).toBeElement(
                DOM.div({ className: "alert alert-danger widget-validation-message" }, message)
            );
        });
    });

    it("should render with style 'success'", () => {
        const badgeProps: BadgeButtonProps = {
            label: "success",
            microflow: "doNothing",
            style: "success"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-success")).toBe(true);
    });

    describe("without a on click", () => {
        it("should not respond on user click", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: "showPage",
                style: "success"
            };
            spyOn(window.mx.ui, "error");
            spyOn(window.mx.ui, "openForm");
            spyOn(window.mx.ui, "action");

            const badge = createBadgeButton(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.error).not.toHaveBeenCalled();
            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
            expect(window.mx.ui.action).not.toHaveBeenCalled();
        });
    });
});
