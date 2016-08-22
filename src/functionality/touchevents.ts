// INTERACTIVITY - TOUCH EVENTS =============================================================
// Handles HTML touch events and formats it nicely for 

import { PageSliderControlAPI } from "../types";

// Snap back if user has moved less than 10% of the page
const kDistanceThreshold = 0.1;

// If the user has moved less than 50% of the page, snap back
// unless that are moving at more than 30% the page width every second
const kMomentumThreshold = 0.3;
const kDistanceMomentumThreshold = 0.5;

// Ignore scrolls until they have moved at least 3% along X. If, during that time, they
// move more than 20px on Y, they will be rejected and interpreted instead as a vertical
// scroll gesture
const kAcceptAtX = 0.03;
const kRejectAtY = 20;


export class TouchEventHandler {
	constructor(
		private delegate : PageSliderControlAPI,
		private element : HTMLElement
	) {

		// Add touch event listeners
		element.addEventListener("touchstart",  this.TouchStart.bind(this));
		element.addEventListener("touchmove",   this.TouchMove.bind(this));
		element.addEventListener("touchend",    this.TouchEnd.bind(this));
		element.addEventListener("touchcancel", this.TouchEnd.bind(this));
	}

	// Touch tracking state
	private start_x : number = 0;
	private current_x : number = 0;
	private start_ypx: number = 0;

	private current_scroll : number = 1;
	private tracking : number = null;
	public 	accepted : boolean = false;


	// MOMENTUM HIGH PASS

	diffs_x = [0, 0, 0];
	times_x = [20, 20, 20];
	last_sample_time : number;
	diffs_index = 0;
	private CaptureXDiff(diff: number) {
		this.diffs_x[this.diffs_index] = diff;

		var ctime = new Date().getTime();
		this.times_x[this.diffs_index] = ctime - this.last_sample_time;
		this.last_sample_time = ctime;

		if (++this.diffs_index == this.diffs_x.length) this.diffs_index = 0;
	}

	// Returns the scroll momentum in fractional page widths per second.
	// (fpw/s * page width = px/s)
	private get momentum_x() : number {
		var acc = 0;
		for (let i = 0; i < this.diffs_x.length; i++) {
			acc += (this.diffs_x[i] / this.times_x[i]) * 1000 / 3;
		}
		return acc;
	}


	// DOM EVENT HANDLERS ===================================================================

	public TouchStart(event: TouchEvent) {
		if (this.tracking) return;
		if (event.touches.length > 1) return;

		this.tracking = event.touches.item(0).identifier;
		this.start_x = event.touches.item(0).clientX / this.delegate.pageWidth;
		this.current_x = this.start_x;
		this.start_ypx = event.touches.item(0).clientY;
		this.last_sample_time = new Date().getTime();
		this.accepted = false;
	}

	public TouchMove(event: TouchEvent) {
		var touch = this.GetTrackingTouch(event.changedTouches);
		if (touch == null) return;

		var new_x = touch.clientX / this.delegate.pageWidth;
		var diff_x = new_x - this.current_x;

		if (!this.accepted) {
			if (Math.abs(new_x - this.start_x) >= kAcceptAtX) {
				if (Math.abs(touch.clientY - this.start_ypx) > kRejectAtY) {
					this.tracking = null;
					return;
				} else {
					this.accepted = true;
					this.delegate.StartScroll();
				}
			} else return;
		}

		this.CaptureXDiff(diff_x);
		this.current_scroll = this.current_scroll - diff_x;
		this.delegate.ScrollTo(this.current_scroll);
		this.current_x = new_x;
	}

	public TouchEnd(event: TouchEvent) {
		var touch = this.GetTrackingTouch(event.changedTouches);
		if (touch == null) return;

		this.tracking = null;
		if (this.start_x == this.current_x) return;
		if (!this.accepted) return;
		event.preventDefault();
		this.delegate.EndScroll();

		this.current_scroll = 1;
		var ending_momentum_x = this.momentum_x;

		if (this.current_x + kDistanceThreshold < this.start_x) {
			if (
				this.current_x + kDistanceMomentumThreshold < this.start_x ||
				-ending_momentum_x > kMomentumThreshold
			) {
				this.delegate.AnimateToNextPage(ending_momentum_x);
			} else {
				this.delegate.AnimateToX(1, ending_momentum_x);
			}
		} else if (this.current_x - kDistanceThreshold > this.start_x) {
			if (
				this.current_x - kDistanceMomentumThreshold > this.start_x ||
				ending_momentum_x > kMomentumThreshold
			) {
				this.delegate.AnimateToPreviousPage(ending_momentum_x);
			} else {
				this.delegate.AnimateToX(1, ending_momentum_x);
			}
		} else {
			this.delegate.AnimateToX(1, ending_momentum_x);
		}
	}


	// HELPERS

	private GetTrackingTouch(list: TouchList) {
		if (this.tracking === null) return null;
		for (var i = 0; i < list.length; i++) {
			var touch = list.item(i);
			if (touch.identifier == this.tracking) return touch;
		}
		return null;
	}
}