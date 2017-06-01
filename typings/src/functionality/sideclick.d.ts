/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */
import { PageSliderControlAPI } from "../types";
export declare class SideClickHandler {
    private delegate;
    private element;
    constructor(delegate: PageSliderControlAPI, element: HTMLElement);
    enabled: boolean;
    threshold: number;
    private ClickHandler(e);
}
