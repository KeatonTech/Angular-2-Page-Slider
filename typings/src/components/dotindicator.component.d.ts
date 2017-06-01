export declare class KBDotIndicatorComponent {
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
