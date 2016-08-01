declare module "src/types" {
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
declare module "src/components/render.component" {
    import { EventEmitter, ViewContainerRef, TemplateRef } from '@angular/core';
    import { StackLocation } from "src/types";
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
        private _lastPageCount;
        pageCount: number;
        pageCountChange: EventEmitter<number>;
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
declare module "src/components/dotindicator.component" {
    export class KBDotIndicatorComponent {
        private _page;
        private _pageCount;
        page: number;
        pageCount: number;
        dotColor: string;
        items: {
            active: boolean;
        }[];
        private updateItems();
        private updateSelected();
    }
}
declare module "src/components/navbutton.component" {
    import { EventEmitter } from '@angular/core';
    export class KBNavButtonComponent {
        private isForward;
        constructor(forward: string, backward: string);
        page: number;
        pageChange: EventEmitter<number>;
        pageCount: number;
        size: number;
        showBackground: boolean;
        iconColor: string;
        backgroundColor: string;
        disabled: boolean;
        private derivedIconColor;
        private derivedBackgroundColor;
        private derivedSize;
        private halfSize;
        private symbol;
        private OnClick();
    }
}
declare module "src/functionality/animation" {
    export class SlideAnimation {
        private element;
        private current_px;
        private dest_px;
        private momentum_px;
        private default_duration;
        private on_complete;
        then(on_complete: () => void): this;
        constructor(element: HTMLElement, current_px: number, dest_px: number, momentum_px: number, default_duration?: number);
        private CalculateDuration();
    }
}
declare module "src/functionality/sideclick" {
    /**
     * When the user clicks very close to the edge of a page, move in that direction.
     */
    import { PageSliderControlAPI } from "src/types";
    export class SideClickHandler {
        private delegate;
        private element;
        constructor(delegate: PageSliderControlAPI, element: HTMLElement);
        enabled: boolean;
        threshold: number;
        private ClickHandler(e);
    }
}
declare module "src/functionality/touchevents" {
    import { PageSliderControlAPI } from "src/types";
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
declare module "src/functionality/arrowkeys" {
    /**
     * When the user clicks very close to the edge of a page, move in that direction.
     */
    import { PageSliderControlAPI } from "src/types";
    export class ArrowKeysHandler {
        private delegate;
        private element;
        constructor(delegate: PageSliderControlAPI, element: HTMLElement);
        enabled: boolean;
        private KeyHandler(e);
    }
}
declare module "src/components/pageslider.component" {
    export { KBPagesRendererDirective, KBPage } from "src/components/render.component";
    import { EventEmitter, ElementRef } from '@angular/core';
    import { KBPagesRendererDirective } from "src/components/render.component";
    import { PageSliderControlAPI } from "src/types";
    import { SlideAnimation } from "src/functionality/animation";
    export class KBPageSliderComponent implements PageSliderControlAPI {
        private element;
        private innerContainer;
        private touchEventHandler;
        private sideClickHandler;
        private arrowKeysHandler;
        constructor(element: ElementRef);
        page: number;
        pageChange: EventEmitter<number>;
        pageSizeChange: EventEmitter<[number, number]>;
        pageCount: number;
        pageCountChange: EventEmitter<number>;
        showIndicator: boolean;
        overlayIndicator: boolean;
        dotColor: string;
        locked: boolean;
        transitionDuration: number;
        enableOverscroll: boolean;
        enableSideClicks: boolean;
        enableArrowKeys: boolean;
        private _pageOffset;
        protected pageOffset: number;
        private pxOffset;
        buttons: any;
        buttonTop: string;
        pageWidth: any;
        pageHeight: number;
        containerWidth: string;
        containerHeight: string;
        private dotBottom;
        renderer: KBPagesRendererDirective;
        ngOnInit(): void;
        protected Resize(): void;
        private blockInteraction;
        ScrollTo(x: number): void;
        AnimateToNextPage(momentum?: number): SlideAnimation;
        AnimateToPreviousPage(momentum?: number): SlideAnimation;
        AnimateToX(x: number, momentum: number): SlideAnimation;
        protected ClampX(x: number): number;
        protected OverscrollRamp(input: number): number;
    }
}
declare module "index" {
    export { KBPageSliderComponent } from "src/components/pageslider.component";
    export { KBPagesRendererDirective } from "src/components/render.component";
    export { KBDotIndicatorComponent } from "src/components/dotindicator.component";
    export { KBNavButtonComponent } from "src/components/navbutton.component";
}
