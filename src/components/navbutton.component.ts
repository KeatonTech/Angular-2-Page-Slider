import { Component, Input, Output, EventEmitter, Attribute } from '@angular/core';

@Component({
	selector: 'kb-nav-button',
	template: `
		<a	(click)="OnClick()"
			[innerHTML]="symbol"
			[class.circle]="showBackground"
			[class.disabled]="disabled"
			[style.width]="derivedSize" [style.height]="derivedSize"
			[style.borderRadius]="halfSize"
			[style.fontSize]="derivedSize"
			[style.color]="derivedIconColor"
			[style.backgroundColor]="derivedBackgroundColor"
		></a>
	`,
	styles: [
		`:host {
			cursor: pointer;
			-webkit-touch-callout: none; /* iOS Safari */
			-webkit-user-select: none;   /* Chrome/Safari/Opera */
			-khtml-user-select: none;    /* Konqueror */
			-moz-user-select: none;      /* Firefox */
			-ms-user-select: none;       /* Internet Explorer/Edge */
			user-select: none;
		}`,
		`a {
			display: block;
			text-align: center;
    		line-height: 36px;
		}`,
		`:host[forward] a {
			padding-left: 3px;
		}`,
		`:host[backward] a {
			padding-right: 3px;
		}`,
		`a.circle {
			box-shadow: 0px 1px 2px rgba(0,0,0,0.25);
		}`,
		`a.disabled {
			opacity: 0.33;
		}`
	]
})
export class KBNavButtonComponent {

	private isForward : boolean;
	constructor(
		@Attribute('forward') forward: string,
		@Attribute('backward') backward: string
	){
		if (forward != undefined) {
			if (backward != undefined) {
				throw new Error("Nav Button cannot be both forward and backwards");
			} else {
				this.isForward = true;
			}
		} else if (backward != undefined) {
			this.isForward = false;
		} else {
			throw new Error("Must specify either 'forward' or 'backward' on nav button");
		}
	}


	// PUBLIC INTERFACE

	@Input() page : number;
	@Output() pageChange = new EventEmitter<number>();
	@Input() pageCount : number;

	@Input() size : number = 44;
	@Input() showBackground : boolean = false;
	@Input() iconColor : string;
	@Input() backgroundColor :  string = "white";


	// TEMPLATE FEATURES

	public get disabled() {
		if (this.isForward) {
			return this.page >= this.pageCount - 1;
		} else {
			return this.page <= 0;
		}
	}

	public get derivedIconColor() {
		if (this.iconColor !== undefined) return this.iconColor;
		return (this.showBackground) ? "black" : "white";
	}

	public get derivedBackgroundColor() {
		return (this.showBackground) ? this.backgroundColor : "none";
	}

	public get derivedSize() {return this.size + "px";}
	public get halfSize() {return this.size / 2 + "px";}

	public get symbol() {
		return (this.isForward) ? "&rsaquo;" : "&lsaquo;";
	}

	public OnClick() {
		if (this.disabled) return;
		this.pageChange.emit((this.isForward) ? ++this.page : --this.page);
	}
}