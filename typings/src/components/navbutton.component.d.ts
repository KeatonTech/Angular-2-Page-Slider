import { EventEmitter } from '@angular/core';
export declare class KBNavButtonComponent {
    private isForward;
    constructor(forward: string, backward: string);
    page: number;
    pageChange: EventEmitter<number>;
    pageCount: number;
    size: number;
    showBackground: boolean;
    iconColor: string;
    backgroundColor: string;
    readonly disabled: boolean;
    readonly derivedIconColor: string;
    readonly derivedBackgroundColor: string;
    readonly derivedSize: string;
    readonly halfSize: string;
    readonly symbol: string;
    OnClick(): void;
}
