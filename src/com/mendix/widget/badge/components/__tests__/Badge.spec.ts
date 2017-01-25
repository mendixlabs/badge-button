import { shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as classNames from "classnames";

import { Badge, BadgeProps, OnClickProps, ValidationAlert } from "../Badge";

import { MockContext, mockMendix } from "tests/mocks/Mendix";

describe("Badge", () => {
    let badgeProps: BadgeProps;
    const createBadge = (props: BadgeProps) => shallow(createElement(Badge, props));
    const newBadgeInstance = (props: BadgeProps) => createBadge(props).instance() as Badge;
    const clickProps: OnClickProps = { onClickType: "doNothing" };

    beforeEach(() => {
        badgeProps = {
            badgeOnClick: clickProps,
            badgeType: "badge",
            badgeValue: "0",
            label: "default",
            style: "default"
        };
        window.mx = mockMendix;
        window.mendix = { lib: { MxContext: MockContext } };
    });

    describe("should render the structure", () => {
        it("for badge", () => {
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
            badgeProps.badgeType = "button";
            badgeProps.disabled = "false";

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
            badgeProps.badgeType = "label";

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                createElement("div",
                    {
                        className: classNames("widget-badge-display",
                            { "widget-badge-link": !!badgeProps.badgeOnClick }
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
        badgeProps.style = "success";

        const badgeComponent = createBadge(badgeProps);

        expect(badgeComponent.childAt(1).hasClass("widget-badge badge label-success")).toBe(true);
    });

    describe("with an on click microflow set", () => {
        it("executes the microflow when a badge is clicked", () => {
            const onclickProps: OnClickProps = {
                microflowProps: {
                    guid: "2",
                    microflow: "IVK_Onclick"
                },
                onClickType: "callMicroflow"
            };
            spyOn(window.mx.ui, "action").and.callThrough();

            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            badge.simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalledWith(onclickProps.microflowProps.microflow, {
                error: jasmine.any(Function),
                params: {
                    applyto: "selection",
                    guids: [ onclickProps.microflowProps.guid ]
                }
            });
        });

        it("shows an error in configuration", () => {
            const onclickProps: OnClickProps = {
                microflowProps: {
                    guid: "2",
                    microflow: ""
                },
                onClickType: "callMicroflow"
            };

            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the Badge widget" +
                "\n" + "'On click' call a microFlow is set and there is no 'Microflow' Selected in tab Events");
        });

        it(" and has invalid microflow shows an error when a badge is clicked", () => {
            const invalidAction = "invalid_action";
            const errorMessage = "Error while executing microflow: invalid_action: mx.ui.action error mock";
            const onclickProps: OnClickProps = {
                microflowProps: {
                    guid: "2",
                    microflow: "invalid_action"
                },
                onClickType: "callMicroflow"
            };

            spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
                if (actionname === invalidAction) {
                    action.error(new Error("mx.ui.action error mock"));
                }
            });

            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            badge.simulate("click");

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe(errorMessage);
        });
    });

    describe("with an on click show page configured", () => {
        it("opens a page", () => {
            const onclickProps: OnClickProps = {
                onClickType: "showPage",
                pageProps: {
                    entity: "TestSuite.badge",
                    guid: "2",
                    page: "showpage.xml",
                    pageSetting: "popup"
                }
            };
            spyOn(window.mx.ui, "openForm").and.callThrough();

            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            badge.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(onclickProps.pageProps.page, {
                context: new mendix.lib.MxContext(),
                location: "popup"
            });
        });

        it("without a page shows an error", () => {
            const onclickProps: OnClickProps = {
                onClickType: "showPage",
                pageProps: {
                    entity: "TestSuite.badge",
                    guid: "2",
                    page: "",
                    pageSetting: "popup"
                }
            };
            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            const validationAlert = badge.find(ValidationAlert);
            expect(validationAlert.props().message).toBe("Error in configuration of the Badge widget" +
                "\n" + "'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'");
        });
    });

    describe("without a on click", () => {
        it("should not respond on user click", () => {
            const onclickProps: OnClickProps = {
                onClickType: "showPage",
                pageProps: {
                    entity: "",
                    guid: "2",
                    page: "",
                    pageSetting: "popup"
                }
            };
            spyOn(window.mx.ui, "error");
            spyOn(window.mx.ui, "openForm");
            spyOn(window.mx.ui, "action");

            const badge = createBadge({ badgeOnClick: onclickProps, badgeType: "badge", badgeValue: "New" });
            badge.simulate("click");

            expect(window.mx.ui.error).not.toHaveBeenCalled();
            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
            expect(window.mx.ui.action).not.toHaveBeenCalled();
        });
    });
});
