/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */
import { PageSliderControlAPI } from "../types";
export declare class ArrowKeysHandler {
    private delegate;
    constructor(delegate: PageSliderControlAPI);
    enabled: boolean;
    private KeyHandler(e);
}
