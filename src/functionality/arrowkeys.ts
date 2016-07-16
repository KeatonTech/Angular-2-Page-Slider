/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */

import { PageSliderControlAPI } from "../types";

export class ArrowKeysHandler {
	constructor(
		private delegate : PageSliderControlAPI,
		private element : HTMLElement
	) {
		document.addEventListener("keydown",  this.KeyHandler.bind(this));
	}

	public enabled : boolean = true;

	private KeyHandler(e: KeyboardEvent) {
		if (!this.enabled) return;
		if (e.keyCode == 37) {
			this.delegate.AnimateToPreviousPage(0);
		} else if (e.keyCode == 39) {
			this.delegate.AnimateToNextPage(0);
		}
	}
}