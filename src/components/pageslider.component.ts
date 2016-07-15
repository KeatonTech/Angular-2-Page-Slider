export { KBPagesRendererDirective, KBPage } from "./render.component";

import {
	Component, Input, Output, EventEmitter, ContentChild, ElementRef
} from '@angular/core';

import { KBPagesRendererDirective, KBPage } from "./render.component";
import { KBDotIndicatorComponent } from './dotindicator.component';
import { PageSliderControlAPI } from "../types";
import { TouchEventHandler } from "../functionality/touchevents";
import { SlideAnimation } from "../functionality/animation";


// PAGE CONTAINER DIRECTIVE =================================================================
// Handles fancy things like page animation and controls KBPagesRendererDirective

@Component({
	selector: 'kb-page-slider',
	directives: [KBDotIndicatorComponent],
	template: `
		<div class="inner" 
				[style.width]="containerWidth"
				[style.height]="containerHeight">
			<ng-content></ng-content>
		</div>
		<kb-dot-indicator *ngIf="showIndicator"
				[page]="page"
				[pageCount]="pageCount">
		</kb-dot-indicator>
	`,
	styles: [
		`:host {
			overflow: hidden;
			display: block;
		}`,
		`.inner {
			position: absolute;
			top: 0;
			will-change: left;
		}`,
		`kb-dot-indicator {
			position: absolute;
			bottom: 16px;
			width: 100%;
		}`
	]
})
export class KBPageSliderComponent implements PageSliderControlAPI {

	private eventHandler : TouchEventHandler;
	private innerContainer : HTMLElement;
	constructor(
		private element: ElementRef
	) {
		this.eventHandler = new TouchEventHandler(this, this.element.nativeElement);
	}


	// INTERFACE

	@Input() public set page(pn: number) {
		if (this.renderer) this.renderer.page = pn;
		this.pageChange.emit(pn);
	}
	public get page(){return (this.renderer) ? this.renderer.page : 0;}
	@Output() pageChange = new EventEmitter<number>();

	public get pageCount(){return (this.renderer) ? this.renderer.pageCount : 0;}
	@Output() pageCountChange = new EventEmitter<number>();

	@Input() public showIndicator : boolean = true;
	@Input() public overlayIndicator : boolean = true;


	// PRIVATE VARIABLES

	private _pageOffset : number = 1;
	private get pageOffset() {return this._pageOffset;}
	private set pageOffset(v: number) {
		this._pageOffset = v;
		if (!this.blockInteraction) {
			this.innerContainer.style.left = this.pxOffset;
		}
	}
	private get pxOffset() { return -this.pageOffset * this.pageWidth + "px"; }


	// SIZING

	public get pageWidth() {return this.element.nativeElement.offsetWidth;}
	public get pageHeight() {return this.element.nativeElement.offsetHeight;}
	private get containerWidth() {return this.pageWidth * 3 + "px";}
	private get containerHeight() {
		var chin = (this.showIndicator && !this.overlayIndicator) ? 40 : 0;
		return (this.pageHeight - chin) + "px";
	}


	// LIFECYCLE METHODS

	// Get the page renderer loop and keep its size up to date
	@ContentChild(KBPagesRendererDirective) renderer : KBPagesRendererDirective;
	ngOnInit(){
		this.innerContainer = this.element.nativeElement.querySelector(".inner");
		this.innerContainer.style.left = -this.pageWidth + "px";

		this.renderer.Resize(this.pageWidth, this.pageHeight);
		window.addEventListener("resize", ()=>{
			this.renderer.Resize(this.pageWidth, this.pageHeight);
		});
	}


	// INTERACTION HANDLER ==================================================================
	private blockInteraction : boolean = false;

	public ScrollTo(x: number) {
		if (this.blockInteraction) return;
		this.pageOffset = this.ClampX(x);
	}

	public AnimateToNextPage(momentum: number) {
		if (this.blockInteraction) return;
		if (this.page == this.renderer.pageCount - 1) return;
		this.AnimateToX(2, momentum).then(()=>{
			this.page++;
			this.pageOffset = 1;
		});
	}

	public AnimateToPreviousPage(momentum: number) {
		if (this.blockInteraction) return;
		if (this.page == 0) return;
		this.AnimateToX(0, momentum).then(()=>{
			this.page--;
			this.pageOffset = 1;
		});
	}

	public AnimateToX(x: number, momentum: number) {
		if (this.blockInteraction) return;
		this.blockInteraction = true;

		var w = this.pageWidth;
		return new SlideAnimation(
			this.innerContainer,	 	// Element to animate
			-this.pageOffset * w,		// Current position (px)
			-x * w,	 					// Destination position (px)
			momentum * w			 	// User scroll momentum (px/s)
		).then(()=>{
			this.blockInteraction = false;
		});
	}


	// HELPERS

	// Get X to a reasonable range, taking into account page boundaries
	public ClampX(x: number) {
		if (x < 0) x = 0;
		if (x > 2) x = 2;
		if (this.page == 0 && x < 1) x = 1;
		if (this.page == this.renderer.pageCount - 1 && x > 1) x = 1;
		return x;
	}
}