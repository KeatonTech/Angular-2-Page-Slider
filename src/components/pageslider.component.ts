export { KBPagesRendererDirective, KBPage } from "./render.component";

import {
	Component, Input, Output, EventEmitter, ContentChild, ContentChildren, ElementRef
} from '@angular/core';

import { KBPagesRendererDirective, KBPage } from "./render.component";
import { KBDotIndicatorComponent } from './dotindicator.component';
import { KBNavButtonComponent } from './navbutton.component';
import { PageSliderControlAPI } from "../types";
import { SlideAnimation } from "../functionality/animation";

import { SideClickHandler } from "../functionality/sideclick";
import { TouchEventHandler } from "../functionality/touchevents";
import { ArrowKeysHandler } from "../functionality/arrowkeys";


// PAGE CONTAINER DIRECTIVE =================================================================
// Handles fancy things like page animation and controls KBPagesRendererDirective

@Component({
	selector: 'kb-page-slider',
	template: `
		<!-- Display the actual pages -->
		<div class="inner" 
				[style.width]="containerWidth"
				[style.height]="containerHeight">
			<ng-content></ng-content>
		</div>

		<div class="buttons" *ngIf="buttons.length > 0" [style.top]="buttonTop">
			<!-- Display navigation buttons -->
			<ng-content select="kb-nav-button[forward]"></ng-content>
			<ng-content select="kb-nav-button[backward]"></ng-content>
		</div>

		<!-- Display the page indicator -->
		<kb-dot-indicator *ngIf="showIndicator"
				[page]="page"
				[pageCount]="pageCount"
				[dotColor]="dotColor"
				[style.bottom]="dotBottom">
		</kb-dot-indicator>
	`,
	styles: [
		`:host {
			overflow: hidden;
			display: block;
			position: relative;
		}`,
		`.inner {
			position: absolute;
			top: 0;
			will-change: left;
		}`,
		`kb-dot-indicator {
			position: absolute;
			width: 100%;
		}`,
		`.buttons {
			position: absolute;
			z-index: 100;
			width: 100%;
		}`,
		`.buttons >>> kb-nav-button {
			position: absolute;
			top: 0;
		}`,
		`.buttons >>> kb-nav-button[backward] {left: 15px;}`,
		`.buttons >>> kb-nav-button[forward] {right: 15px;}`,
	]
})
export class KBPageSliderComponent implements PageSliderControlAPI {

	private innerContainer : HTMLElement;
	private touchEventHandler : TouchEventHandler;
	private sideClickHandler : SideClickHandler;
	private arrowKeysHandler : ArrowKeysHandler;

	constructor(
		private element: ElementRef
	) {
		var htmlElement = this.element.nativeElement;

		this.touchEventHandler = new TouchEventHandler(this, htmlElement);
		this.sideClickHandler = new SideClickHandler(this, htmlElement);
		this.arrowKeysHandler = new ArrowKeysHandler(this, htmlElement);
	}


	// PUBLIC INTERFACE =====================================================================

	@Input() public set page(pn: number) {
		if (pn < 0 || pn >= this.pageCount) return;
		if (pn == this.renderer.page) return;
		if (this.renderer) {
			if (pn == this.renderer.page + 1) {
				if (this.blockInteraction) {this.pageChange.emit(this.page); return;}
				this.AnimateToNextPage();
			} else if (pn == this.renderer.page - 1) {
				if (this.blockInteraction) {this.pageChange.emit(this.page); return;}
				this.AnimateToPreviousPage();
			} else {
				if (this.blockInteraction) {this.pageChange.emit(this.page); return;}
				this.renderer.page = pn;
				this.pageChange.emit(pn);
			}
		}
	}
	public get page(){return (this.renderer) ? this.renderer.page : 0;}
	@Output() pageChange = new EventEmitter<number>();
	@Output() pageSizeChange = new EventEmitter<[number, number]>();

	public get pageCount(){return (this.renderer) ? this.renderer.pageCount : 0;}
	@Output() pageCountChange = new EventEmitter<number>();

	// Dot Indicator
	@Input() public showIndicator : boolean = true;
	@Input() public overlayIndicator : boolean = true;
	@Input() public dotColor : string = "white";

	// Interactivity
	@Input() public locked: boolean = false;
	@Input() public transitionDuration : number;
	@Input() public enableOverscroll : boolean = true;
	@Input() public set enableSideClicks(enabled: boolean) {
		(this.sideClickHandler) ? this.sideClickHandler.enabled = enabled : null;
	}
	@Input() public set enableArrowKeys(enabled: boolean) {
		(this.arrowKeysHandler) ? this.arrowKeysHandler.enabled = enabled : null;
	}

	@Output() scrollStateChange = new EventEmitter<boolean>();


	// INTERNAL STATE =======================================================================

	private _pageOffset : number = 1;
	protected get pageOffset() {return this._pageOffset;}
	protected set pageOffset(v: number) {
		this._pageOffset = v;
		if (!this.blockInteraction) {
			this.innerContainer.style.left = this.pxOffset;
		}
	}
	private get pxOffset() { return -this.pageOffset * this.pageWidth + "px"; }


	// NAV BUTTONS

	@ContentChildren(KBNavButtonComponent) buttons;
	public get buttonTop() {
		return this.pageHeight / 2 - this.buttons.first.size / 2 + "px"
	}


	// SIZING

	public get pageWidth() {return this.element.nativeElement.offsetWidth;}
	public get pageHeight() {
		var fullHeight = this.element.nativeElement.offsetHeight;
		var chin = (this.showIndicator && !this.overlayIndicator) ? 20 : 0;
		return fullHeight - chin;
	}

	public get containerWidth() {return this.pageWidth * 3 + "px";}
	public get containerHeight() {return this.pageHeight + "px";}

	private get dotBottom() {return (this.overlayIndicator) ? "16px" : "0px";}

	// Get the page renderer loop and keep its size up to date
	@ContentChild(KBPagesRendererDirective) renderer : KBPagesRendererDirective;
	ngOnInit(){
		if (!this.renderer) {
			console.log(`
				The *kbPages directive is used to render pages efficiently, such that only
				pages that are visible are in the DOM. Without this directive, the page
				slider will not display anything.
			`);
			throw new Error('No *kbPages directive found inside kb-page-slider');
		}

		this.renderer.pageCountChange.subscribe((count)=>{
			this.pageCountChange.emit(count);
		});

		this.Resize();
		this.renderer.Resize(this.pageWidth, this.pageHeight);
		window.addEventListener("resize", ()=>{
			this.Resize();
			this.renderer.Resize(this.pageWidth, this.pageHeight);
			this.pageSizeChange.emit([this.pageWidth, this.pageHeight]);
		});
	}

	protected Resize() {
		this.innerContainer = this.element.nativeElement.querySelector(".inner");
		this.innerContainer.style.left = -this.pageWidth + "px";
	}


	// INTERACTIVE NAVIGATION ===============================================================

	private blockInteraction : boolean = false;

	public ScrollTo(x: number) {
		if (this.locked || this.blockInteraction) return;
		this.pageOffset = this.ClampX(x);
	}

	public AnimateToNextPage(momentum?: number) {
		if (this.locked || this.blockInteraction) return;
		if (this.page == this.renderer.pageCount - 1) {
			return this.AnimateToX(1, 0).then(()=>{this.pageOffset = 1;})
		}
		if (momentum === undefined) momentum = 0;

		this.AnimateToX(2, momentum).then(()=>{
			this.renderer.page++;
			this.pageChange.emit(this.renderer.page);
			this.pageOffset = 1;
		});
	}

	public AnimateToPreviousPage(momentum?: number) {
		if (this.locked || this.blockInteraction) return;
		if (this.page == 0) {
			return this.AnimateToX(1, 0).then(()=>{this.pageOffset = 1;})
		}
		if (momentum === undefined) momentum = 0;

		this.AnimateToX(0, momentum).then(()=>{
			this.renderer.page--;
			this.pageChange.emit(this.renderer.page);
			this.pageOffset = 1;
		});
	}

	public AnimateToX(x: number, momentum: number) {
		if (this.locked || this.blockInteraction) return;
		this.blockInteraction = true;

		var w = this.pageWidth;
		return new SlideAnimation(
			this.innerContainer,	 	// Element to animate
			-this.pageOffset * w,		// Current position (px)
			-x * w,	 					// Destination position (px)
			momentum * w,			 	// User scroll momentum (px/s)
			this.transitionDuration		// Default duration, when momentum = 0
		).then(()=>{
			this.blockInteraction = false;
		});
	}

	public StartScroll() {this.scrollStateChange.emit(true);}
	public EndScroll() {this.scrollStateChange.emit(false);}

	// OVERSCROLL (iOS STYLE) ===============================================================

	// Get X to a reasonable range, taking into account page boundaries
	protected ClampX(x: number) {
		if (x < 0) x = 0;
		if (x > 2) x = 2;

		// Allow some overscrolling on the first and last page
		if (this.page == 0 && x < 1) {
			if (this.enableOverscroll) x = 1 - this.OverscrollRamp(1 - x);
			else x = 1;
		}
		if (this.page == this.renderer.pageCount - 1 && x > 1) {
			if (this.enableOverscroll) x = 1 + this.OverscrollRamp(x - 1);
			else x = 1;
		}
		return x;
	}

	// Exponential ramp to simulate elastic pressure on overscrolling
	protected OverscrollRamp(input: number) : number {
		return Math.pow(input, 0.5) / 5;
	}
}
