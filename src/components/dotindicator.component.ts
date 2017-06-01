import { Component, Input } from '@angular/core';

@Component({
	selector: 'kb-dot-indicator',
	template: `
		<div *ngFor="let item of items" class="dot"
			 [style.background]="dotColor"
			 [class.active]="item.active"></div>
	`,
	styles: [
		`:host {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: horizontal;
			-webkit-box-direction: normal;
				-ms-flex-direction: row;
					flex-direction: row;
			-webkit-box-pack: center;
				-ms-flex-pack: center;
					justify-content: center;
		}`,
		`.dot {
			width: 6px;
			height: 6px;
			border-radius: 3px;
			margin: 0 2px;
			opacity: 0.33;

			transition: opacity 90ms linear;
			-webkit-transition: opacity 90ms linear;
		}`,
		`.dot.active {
			opacity: 1.0;
		}`,
	]
})
export class KBDotIndicatorComponent {

	// PUBLIC PROPERTIES
	private _page : number = 0;
	private _pageCount : number = 0;

	@Input() set page(p : number) {
		this._page = p;
		this.updateSelected();
	}

	@Input() set pageCount(p : number) {
		this._pageCount = p || 0;
		this.updateItems();
	}

	@Input() dotColor : string = "white";


	// DATA REPRESENTATION

	// An array of page dots, one of which (the active one) is true.
	public items : {active:boolean}[] = [];
	private updateItems() {
		this.items = new Array(this._pageCount);
		for (let i = 0; i < this._pageCount; i++) {
			this.items[i] = {active: i == this._page};
		}
	}

	private updateSelected() {
		if (this.items.length != this._pageCount) return this.updateItems();
		if (this.items.length == 0) return;
		for (let i = 0; i < this._pageCount; i++) this.items[i].active = false;
		this.items[this._page].active = true;
	}
}