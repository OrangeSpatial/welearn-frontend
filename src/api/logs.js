import { service } from "./url.js"

export function getLogsByUsername(username) {
    return service({
        url: "/logs/"+ username,
        method: "get"
    });
}
