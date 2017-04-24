import { DOM, SFC } from "react";

export const Alert: SFC<{ message?: string }> = ({ message }) =>
    message
        ? DOM.button({ className: "alert alert-danger widget-badge-button btn-alert" }, message)
        : null as any;

Alert.displayName = "Alert";
