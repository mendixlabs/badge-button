import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { Badge, BadgeProps, ValidationAlert } from "../Badge";

import { MockContext, mockMendix } from "tests/mocks/Mendix";

describe("Badge", () => {
    const createBadge = (props: BadgeProps) => shallow(createElement(Badge, props));
    const newBadgeInstance = (props: BadgeProps) => createBadge(props).instance() as Badge;

    beforeEach(() => {
        window.mx = mockMendix;
        window.mendix = { lib: { MxContext: MockContext } };
    });

    describe("should render the structure", () => {
        it("for badge", () => {
            const badgeProps: BadgeProps = {
                microflow: { onClickType: "doNothing" },
                badgeType: "badge",
                badgeValue: "0",
                label: "default",
                style: "default"
            };

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                DOM.div(
                    {
                        className: "widget-badge-display widget-badge-link",
                        onClick: jasmine.any(Function) as any
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "widget-badge badge label-default" }, badgeProps.badgeValue)
                )
            );
        });

        it("for button", () => {
            const badgeProps: BadgeProps = {
                microflow: { onClickType: "doNothing" },
                badgeType: "button",
                badgeValue: "0",
                disabled: "false",
                label: "default",
                style: "default"
            };

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                createElement("button",
                    {
                        className: classNames("widget-badge btn",
                            { [`btn-${badgeProps.style}`]: !!badgeProps.style }
                        ),
                        disabled: "false",
                        onClick: jasmine.any(Function) as any
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "badge" }, badgeProps.badgeValue)
                )
            );
        });

        it("for label", () => {
            const badgeProps: BadgeProps = {
                microflow: { onClickType: "doNothing" },
                badgeType: "label",
                badgeValue: "0",
                disabled: "false",
                label: "default",
                style: "default"
            };

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                createElement("div",
                    {
                        className: classNames("widget-badge-display",
                            { "widget-badge-link": !!badgeProps.microflow }
                        ),
                        onClick: jasmine.any(Function) as any
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({
                        className: classNames("widget-badge", "label",
                            { [`label-${badgeProps.style}`]: !!badgeProps.style }
                        )
                    }, badgeProps.badgeValue)
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
        const badgeProps: BadgeProps = {
            microflow: { onClickType: "doNothing" },
            badgeType: "badge",
            style: "success"
        };

        const badgeComponent = createBadge(badgeProps);

        expect(badgeComponent.childAt(1).hasClass("widget-badge badge label-success")).toBe(true);
    });

    describe("with an on click microflow set", () => {
        it("executes the microflow when a badge is clicked", () => {
            const badgeProps: BadgeProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: "IVK_Onclick"
                    },
                    onClickType: "callMicroflow"
                },
                badgeType: "label",
                style: "success"
            };
            spyOn(window.mx.ui, "action").and.callThrough();

            const badge = createBadge(badgeProps);
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
            const badgeProps: BadgeProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: ""
                    },
                    onClickType: "callMicroflow"
                },
                badgeType: "label",
                style: "success"
            };

            const badge = createBadge(badgeProps);
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the Badge widget" +
                "\n" + "'On click' call a microFlow is set and there is no 'Microflow' Selected in tab Events");
        });

        it(" and has invalid microflow shows an error when a badge is clicked", () => {
            const invalidAction = "invalid_action";
            const errorMessage = "Error while executing microflow: invalid_action: mx.ui.action error mock";
            const badgeProps: BadgeProps = {
                microflow: {
                    microflowProps: {
                        guid: "2",
                        name: invalidAction
                    },
                    onClickType: "callMicroflow"
                },
                badgeType: "label",
                style: "success"
            };

            spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
                if (actionname === invalidAction) {
                    action.error(new Error("mx.ui.action error mock"));
                }
            });

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe(errorMessage);
        });
    });

    describe("with an on click show page configured", () => {
        it("opens a page", () => {
            const badgeProps: BadgeProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "TestSuite.badge",
                        guid: "2",
                        page: "showpage.xml",
                        pageSetting: "popup"
                    }
                },
                badgeType: "label",
                style: "success"
            };
            spyOn(window.mx.ui, "openForm").and.callThrough();

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(badgeProps.microflow.pageProps.page, {
                context: new mendix.lib.MxContext(),
                location: "popup"
            });
        });

        it("without a page shows an error", () => {
            const badgeProps: BadgeProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "TestSuite.badge",
                        guid: "2",
                        page: "",
                        pageSetting: "popup"
                    }
                },
                badgeType: "label",
                style: "success"
            };
            const badge = createBadge(badgeProps);
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the Badge widget" +
                "\n" + "'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'");
        });
    });

    describe("without a on click", () => {
        it("should not respond on user click", () => {
            const badgeProps: BadgeProps = {
                microflow: {
                    onClickType: "showPage",
                    pageProps: {
                        entity: "",
                        guid: "2",
                        page: "",
                        pageSetting: "popup"
                    }
                },
                badgeType: "label",
                style: "success"
            };
            spyOn(window.mx.ui, "error");
            spyOn(window.mx.ui, "openForm");
            spyOn(window.mx.ui, "action");

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.error).not.toHaveBeenCalled();
            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
            expect(window.mx.ui.action).not.toHaveBeenCalled();
        });
    });
});
