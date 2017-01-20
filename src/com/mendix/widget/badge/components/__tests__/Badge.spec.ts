import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Badge, BadgeProps, OnClickProps } from "../Badge";

import { MockContext, mockMendix } from "tests/mocks/Mendix";

describe("Badge", () => {
    let badgeProps: BadgeProps;
    const createBadge = (props: BadgeProps) => shallow(createElement(Badge, props));
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

    it("should render the structure", () => {
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

    it("with style 'success' should have class 'widget-badge badge label-success'", () => {
        badgeProps.style = "success";

        const badgeComponent = createBadge(badgeProps);

        expect(badgeComponent.childAt(1).hasClass("widget-badge badge label-success")).toBe(true);
    });

    describe("with an onClick microflow set", () => {
        it("executes the microflow when a badge Circle is clicked", () => {
            const onclickProps: OnClickProps = {
                microflowProps: {
                    guid: "2",
                    microflow: "IVK_Onclick"
                },
                onClickType: "callMicroflow"
            };
            spyOn(window.mx.ui, "action").and.callThrough();

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalledWith(onclickProps.microflowProps.microflow, {
                error: jasmine.any(Function),
                params: {
                    applyto: "selection",
                    guids: [ onclickProps.microflowProps.guid ]
                }
            });
        });

        it("microflow selected it shows an error in configuration", () => {
            const onclickProps: OnClickProps = {
                microflowProps: {
                    guid: "2",
                    microflow: ""
                },
                onClickType: "callMicroflow"
            };
            spyOn(window.mx.ui, "error").and.callThrough();

            const badge = createBadge(badgeProps);
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            expect(window.mx.ui.error).toHaveBeenCalledWith("Error in configuration of the badge circle widget" +
                "\n" + "'On click' call a microFlow is set and there is no 'Microflow' Selected in tab Events"
            );
        });

        it("invalid microflow shows an error when a badge circle is clicked", () => {
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

            spyOn(window.mx.ui, "error").and.callThrough();

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.error).toHaveBeenCalledWith(errorMessage);
        });
    });

    describe("with an onClick show page set", () => {
        it("opens the page when a badge Circle is clicked", () => {
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

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(onclickProps.pageProps.page, {
                context: new mendix.lib.MxContext(),
                location: "popup"
            });
        });

        it("without a page selected it shows an error in configuration", () => {
            const onclickProps: OnClickProps = {
                onClickType: "showPage",
                pageProps: {
                    entity: "",
                    guid: "2",
                    page: "",
                    pageSetting: "popup"
                }
            };
            spyOn(window.mx.ui, "error").and.callThrough();

            const badge = createBadge(badgeProps);
            const badgeComponent = badge.instance() as Badge;
            badgeComponent.componentDidMount();

            expect(window.mx.ui.error).toHaveBeenCalledWith("Error in configuration of the badge circle widget" +
                "\n" + "'On click' Show a page is set and there is no 'Page' Selected in tab 'Events'"
            );
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

            const badge = createBadge(badgeProps);
            badge.simulate("click");

            expect(window.mx.ui.error).not.toHaveBeenCalled();
            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
            expect(window.mx.ui.action).not.toHaveBeenCalled();
        });
    });

});
