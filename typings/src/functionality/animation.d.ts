export declare class SlideAnimation {
    private current_px;
    private dest_px;
    private momentum_px;
    private default_duration;
    private on_complete;
    then(on_complete: () => void): this;
    constructor(element: HTMLElement, current_px: number, dest_px: number, momentum_px: number, default_duration?: number);
    private CalculateDuration();
}
