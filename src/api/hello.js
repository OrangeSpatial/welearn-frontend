
import { service } from "./url.js"

export function getStatistic() {
    return service({
        url: "/hello/statistic",
        method: "get"
    });
}
