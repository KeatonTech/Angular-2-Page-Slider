/*
	A special class that wraps CSS3 animations and also determines their ideal duration
	based on momentum and distance to travel.
*/

const kEasingFunction = "cubic-bezier(.35,.45,.5,1)";
const kEasingStartSlope = 1.33;
const kDefaultDuration = 250;
const kMinDuration = 60;
const kMaxDuration = 660;

export class SlideAnimation {

	// Pseudo-promise
	private on_complete : Array<()=>void> = [];
	public then(on_complete : ()=>void) {
		this.on_complete.push(on_complete);
		return this;
	}

	// The real meat of the animation code
	// Hard-coded to the 'left' property because that's all we use here
	// but certainly this code could be generalized if needed.
	constructor (
		element : HTMLElement,
		private current_px : number,
		private dest_px : number,
		private momentum_px : number,
		private default_duration? : number
	){
		if (default_duration === undefined) {
			this.default_duration = kDefaultDuration;
		}

		// Set up the CSS transition
		let duration = Math.round(this.CalculateDuration());
		let tProperty = `left ${duration}ms ${kEasingFunction}`;
		element.style.transition = tProperty;
		element.style.webkitTransition = tProperty;

		// Wait for that to propogate
		setTimeout(()=>{

			// Move to the destination location
			element.style.left = dest_px + "px";

			// Wait for that to finish and clean it up
			setTimeout(()=>{
				for (let f of this.on_complete) f();

				element.style.transition = "";
				element.style.webkitTransition = "";
			}, duration + 10);

		}, 10);
	}


	// HELPERS

	// First step is figuring out the duration such that the starting
	// momentum of the transition matches the user's scroll momentum.
	// We could do this with 100% accuracy by determining the slope
	// of the bezier easing curve but ... meh. It's about 1.5-ish.
	private CalculateDuration() {
		let travel_px = this.dest_px - this.current_px;

		// If the momentum is going the same direction as the movement, use it!
		if (this.momentum_px != 0 && (this.momentum_px < 0) == (travel_px < 0)) {
			let linear_duration = 1000 * Math.abs(travel_px) / Math.abs(this.momentum_px);
			let estimate = linear_duration * kEasingStartSlope;
			return Math.max(Math.min(estimate, kMaxDuration), kMinDuration);

		// Otherwise, throw it out and use our default duration
		} else {
			return this.default_duration;
		}
	}
}