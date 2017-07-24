import { SFC, SyntheticEvent, createElement } from "react";

export const Overlay: SFC<{ myRef: (node: HTMLElement) => void }> = ({ children, myRef }) =>
    createElement("div", {
            ref: (node: HTMLElement) => myRef(node),
            style: { position: "relative" }
        },
        children,
        createElement("div", {
            onClick: preventEvent,
            onTouchStart: preventEvent,
            style: {
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
                zIndex: 10
            }
        })
    );

const preventEvent = <T extends SyntheticEvent<any>>(event: T) => {
    event.preventDefault();
    event.stopPropagation();
};

Overlay.displayName = "Overlay";
