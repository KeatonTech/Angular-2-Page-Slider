import { PageSliderControlAPI } from "../types";
export declare class TouchEventHandler {
    private delegate;
    constructor(delegate: PageSliderControlAPI, element: HTMLElement);
    private start_x;
    private current_x;
    private start_ypx;
    private current_scroll;
    private tracking;
    accepted: boolean;
    diffs_x: number[];
    times_x: number[];
    last_sample_time: number;
    diffs_index: number;
    private CaptureXDiff(diff);
    private readonly momentum_x;
    TouchStart(event: TouchEvent): void;
    TouchMove(event: TouchEvent): void;
    TouchEnd(event: TouchEvent): void;
    private GetTrackingTouch(list);
}
