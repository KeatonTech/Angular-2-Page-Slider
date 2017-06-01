export declare enum StackLocation {
    Previous = 0,
    Current = 1,
    Next = 2,
}
export interface PageSliderControlAPI {
    ScrollTo(x: number): void;
    AnimateToX(x: number, momentum: number): void;
    AnimateToNextPage(momentum: number): void;
    AnimateToPreviousPage(momentum: number): void;
    StartScroll(): void;
    EndScroll(): void;
    pageWidth: number;
    pageHeight: number;
}
