declare module "types" {
    export enum StackLocation {
        Previous = 0,
        Current = 1,
        Next = 2,
    }
    export interface PageSliderControlAPI {
        ScrollTo(x: number): any;
        AnimateToX(x: number, momentum: number): any;
        AnimateToNextPage(momentum: number): any;
        AnimateToPreviousPage(momentum: number): any;
        pageWidth: number;
        pageHeight: number;
    }
}
declare module "components/render.component" {
    import { ViewContainerRef, TemplateRef } from '@angular/core';
    import { StackLocation } from "types";
    export class KBPage {
        $implicit: any;
        index: number;
        private parent;
        constructor($implicit: any, index: number, parent: KBPagesRendererDirective);
        isActive: boolean;
        isFirst: boolean;
        isLast: boolean;
    }
    export class KBPagesRendererDirective {
        private viewContainer;
        private template;
        constructor(viewContainer: ViewContainerRef, template: TemplateRef<KBPage>);
        private collection;
        kbPagesOf: Array<any>;
        private isInitialized;
        ngOnInit(): void;
        pageCount: number;
        private _page;
        page: number;
        SetPage(page: number): boolean;
        private pageWidth;
        private pageHeight;
        Resize(width: number, height: number): void;
        private views;
        private CreateDOM();
        private ClearDOM();
        private BuildPage(pageNumber, loc);
        protected StyleAsPage(pageElement: HTMLElement): void;
        protected StyleAtStackLocation(pageElement: HTMLElement, loc: StackLocation): void;
        private ChangeStackLocationOfView(curr, to);
        private ChangePage(newPage, oldPage);
        private GoToNextPage();
        private GoToPreviousPage();
    }
}
declare module "functionality/touchevents" {
    import { PageSliderControlAPI } from "types";
    export class TouchEventHandler {
        private delegate;
        private element;
        constructor(delegate: PageSliderControlAPI, element: HTMLElement);
        private start_x;
        private current_x;
        private current_scroll;
        private tracking;
        diffs_x: number[];
        times_x: number[];
        last_sample_time: number;
        diffs_index: number;
        private CaptureXDiff(diff);
        private momentum_x;
        TouchStart(event: TouchEvent): void;
        TouchMove(event: TouchEvent): void;
        TouchEnd(event: TouchEvent): void;
        private GetTrackingTouch(list);
    }
}
declare module "functionality/animation" {
    export class SlideAnimation {
        private element;
        private current_px;
        private dest_px;
        private momentum_px;
        private on_complete;
        then(on_complete: () => void): this;
        constructor(element: HTMLElement, current_px: number, dest_px: number, momentum_px: number);
        private CalculateDuration();
    }
}
declare module "components/pageslider.component" {
    export { KBPagesRendererDirective, KBPage } from "components/render.component";
    import { EventEmitter, ElementRef } from '@angular/core';
    import { KBPagesRendererDirective } from "components/render.component";
    import { PageSliderControlAPI } from "types";
    import { SlideAnimation } from "functionality/animation";
    export class KBPageSliderComponent implements PageSliderControlAPI {
        private element;
        private eventHandler;
        private innerContainer;
        constructor(element: ElementRef);
        page: number;
        pageChange: EventEmitter<number>;
        pageCount: number;
        pageCountChange: EventEmitter<number>;
        private _pageOffset;
        private pageOffset;
        private pxOffset;
        pageWidth: any;
        pageHeight: any;
        private containerWidth;
        private containerHeight;
        renderer: KBPagesRendererDirective;
        ngOnInit(): void;
        private blockInteraction;
        ScrollTo(x: number): void;
        AnimateToNextPage(momentum: number): void;
        AnimateToPreviousPage(momentum: number): void;
        AnimateToX(x: number, momentum: number): SlideAnimation;
        ClampX(x: number): number;
    }
}
declare module "main" {
    export { KBPageSliderComponent } from "components/pageslider.component";
    export { KBPagesRendererDirective } from "components/render.component";
}
