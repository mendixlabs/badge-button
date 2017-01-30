import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { BadgeButton, BadgeButtonProps, ValidationAlert } from "../BadgeButton";

import { MockContext, mockMendix } from "tests/mocks/Mendix";

describe("BadgeButton", () => {
    const createBadgeButton = (props: BadgeButtonProps) => shallow(createElement(BadgeButton, props));
    const newBadgeButtonInstance = (props: BadgeButtonProps) => createBadgeButton(props).instance() as BadgeButton;

    beforeEach(() => {
        window.mx = mockMendix;
        window.mendix = { lib: { MxContext: MockContext } };
    });

    describe("should render the structure", () => {
        it("for button", () => {
            const badgeProps: BadgeButtonProps = {
                badgeValue: "0",
                disabled: "false",
                label: "default",
                microflow: { onClickType: "doNothing" },
                style: "default"
            };

            const badgeComponent = createBadgeButton(badgeProps);

            expect(badgeComponent).toBeElement(
                createElement("button",
                    {
                        className: classNames("widget-badgebutton btn",
                            { [`btn-${badgeProps.style}`]: !!badgeProps.style }
                        ),
                        disabled: "false",
                        onClick: jasmine.any(Function) as any
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
            microflow: { onClickType: "doNothing" },
            style: "success"
        };

        const badgeComponent = createBadgeButton(badgeProps);

        expect(badgeComponent.hasClass("widget-badgebutton btn btn-success")).toBe(true);
    });

    describe("with an on click microflow set", () => {
        it("executes the microflow when a badge is clicked", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: "IVK_Onclick"
                    },
                    onClickType: "callMicroflow"
                },
                style: "success"
            };
            spyOn(window.mx.ui, "action").and.callThrough();

            const badge = createBadgeButton(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalledWith(badgeProps.microflow.microflowProps.name, {
                error: jasmine.any(Function),
                params: {
                    applyto: "selection",
                    guids: [ badgeProps.microflow.microflowProps.guid ]
                }
            });
        });

        it("shows an error in configuration", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: ""
                    },
                    onClickType: "callMicroflow"
                },
                style: "success"
            };

            const badge = createBadgeButton(badgeProps);
            const badgeComponent = badge.instance() as BadgeButton;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the BadgeButton widget" +
                "\n" + "'On click' call a microFlow is set and there is no 'Microflow' Selected in tab Events");
        });

        it(" and has invalid microflow shows an error when a badge is clicked", () => {
            const invalidAction = "invalid_action";
            const errorMessage = "Error while executing microflow: invalid_action: mx.ui.action error mock";
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: invalidAction
                    },
                    onClickType: "callMicroflow"
                },
                style: "success"
            };

            spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
                if (actionname === invalidAction) {
                    action.error(new Error("mx.ui.action error mock"));
                }
            });

            const badge = createBadgeButton(badgeProps);
            badge.simulate("click");

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe(errorMessage);
        });
    });

    describe("with an on click show page configured", () => {
        it("opens a page", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "TestSuite.badge",
                        guid: "2",
                        page: "showpage.xml",
                        pageSetting: "popup"
                    }
                },
                style: "success"
            };
            spyOn(window.mx.ui, "openForm").and.callThrough();

            const badge = createBadgeButton(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(badgeProps.microflow.pageProps.page, {
                context: new mendix.lib.MxContext(),
                location: "popup"
            });
        });

        it("without a page shows an error", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "TestSuite.badge",
                        guid: "2",
                        page: "",
                        pageSetting: "popup"
                    }
                },
                style: "success"
            };
            const badge = createBadgeButton(badgeProps);
            const badgeComponent = badge.instance() as BadgeButton;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the BadgeButton widget" +
                "\n" + "'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'");
        });
    });

    describe("without a on click", () => {
        it("should not respond on user click", () => {
            const badgeProps: BadgeButtonProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "",
                        guid: "2",
                        page: "",
                        pageSetting: "popup"
                    }
                },
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
