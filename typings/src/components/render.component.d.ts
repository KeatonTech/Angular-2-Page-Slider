import { EventEmitter, ViewContainerRef, TemplateRef } from '@angular/core';
import { StackLocation } from "../types";
export declare class KBPage {
    $implicit: any;
    index: number;
    private parent;
    constructor($implicit: any, index: number, parent: KBPagesRendererDirective);
    readonly isActive: boolean;
    readonly isFirst: boolean;
    readonly isLast: boolean;
}
export declare class KBPagesRendererDirective {
    private viewContainer;
    private template;
    constructor(viewContainer: ViewContainerRef, template: TemplateRef<KBPage>);
    private collection;
    kbPagesOf: Array<any>;
    private isInitialized;
    ngOnInit(): void;
    private _lastPageCount;
    readonly pageCount: number;
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
