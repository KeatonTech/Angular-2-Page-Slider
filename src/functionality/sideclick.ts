/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */

import { PageSliderControlAPI } from "../types";

export class SideClickHandler {
	constructor(
		private delegate : PageSliderControlAPI,
		private element : HTMLElement
	) {
		element.addEventListener("click",  this.ClickHandler.bind(this));
	}

	public enabled : boolean = true;
	public threshold : number = 20; // 20px from the edge of the screen

	private ClickHandler(e: MouseEvent) {
		if (!this.enabled) return;

		var elementX = e.clientX - this.element.getBoundingClientRect().left;
		if (elementX < this.threshold) {
			this.delegate.AnimateToPreviousPage(0);
		} else if (elementX > this.element.offsetWidth - this.threshold) {
			this.delegate.AnimateToNextPage(0);
		}
	}
}