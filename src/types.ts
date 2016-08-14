/*
	This file contains some helpful types that are used throughout the module
*/

// The slider renders 3 pages to DOM at once, as follows
export enum StackLocation {
	Previous,
	Current,
	Next
};

// Internal API for event handlers to control the page slider
export interface PageSliderControlAPI {
	ScrollTo(x: number);
	AnimateToX(x: number, momentum: number);
	AnimateToNextPage(momentum: number);
	AnimateToPreviousPage(momentum: number);
	StartScroll();
	EndScroll();

	pageWidth : number;
	pageHeight : number;
}