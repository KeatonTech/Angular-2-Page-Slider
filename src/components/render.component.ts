import {
	Directive, Input, Output, EventEmitter, ContentChild,
	ViewContainerRef, TemplateRef, EmbeddedViewRef
} from '@angular/core';

import { StackLocation } from "../types";


// PAGE CLASS ===============================================================================
// Stores information about each page that is accessible from the template

export class KBPage {
	constructor(
		public $implicit: any,
		public index: number,
		private parent: KBPagesRendererDirective
	) {};

	get isActive() {return this.parent.page == this.index};

	get isFirst() {return this.index == 0;}
	get isLast() {return this.index == this.parent.pageCount - 1;}
}


// PAGE RENDERER DIRECTIVE ==================================================================
// Similar to ngFor, but renders items as stacked full-screen pages

@Directive({selector: '[kbPages]'})
export class KBPagesRendererDirective {

	// Angular Injection
	constructor(
		private viewContainer: ViewContainerRef,
		private template: TemplateRef<KBPage>
	) {}


	// LOOP TEMPLATING

	// Get the input data (using loop syntax)
	private collection: Array<any>;
	@Input() set kbPagesOf(coll:Array<any>) {
		this.collection = coll;

		if (this.isInitialized) {
			this.ClearDOM();
			this.CreateDOM();
		}
	}

	// Initialization
	private isInitialized: boolean = false;
	ngOnInit() {
		this.isInitialized = true;
		this.CreateDOM();
	}

	
	// PAGINATION

	// Calculate page count from the loop
	private _lastPageCount : number;
	public get pageCount() {
		var count = (this.collection) ? this.collection.length : 0;
		if (this._lastPageCount != count) this.pageCountChange.emit(count);
		return count;
	}
	public pageCountChange = new EventEmitter<number>();

	// Page access
	private _page: number = 0;
	public set page(page: number) {this.SetPage(page);}
	public SetPage(page: number) : boolean {
		if (page < 0 || page >= this.pageCount) return false;
		var oldPage = this._page;
		this._page = page;
		this.ChangePage(page, oldPage);
		return true;
	}
	public get page() {return this._page;}


	// SIZING

	private pageWidth: number = 0;
	private pageHeight: number = 0;
	public Resize(width: number, height: number) {
		this.pageWidth = width;
		this.pageHeight = height;

		if (this.isInitialized) {
			this.ClearDOM();
			this.CreateDOM();
		}
	}


	// DOM RENDERING ========================================================================
	private views: EmbeddedViewRef<any>[] = [null, null, null];

	// Renders 3 pages
	private CreateDOM() {
		if (this.pageCount == 0 || this.collection == undefined) return;
		if (this.page > 0)
			this.BuildPage(this.page - 1, StackLocation.Previous);
		this.BuildPage(this.page, StackLocation.Current);
		if (this.page < this.pageCount - 1)
			this.BuildPage(this.page + 1, StackLocation.Next);
	}

	// Clears all pages out of the DOM, useful for re-rendering
	private ClearDOM() {
		for (let view of this.views) {
			if (view) view.destroy();
		}
		this.views = [null, null, null];
	}


	// HTML CONSTRUCTION AND MANAGEMENT

	private BuildPage(pageNumber: number, loc: StackLocation) {
		if (pageNumber < 0 || pageNumber >= this.pageCount)
			throw new Error("Attempted to create non-existent page: " + pageNumber);

		// Create the page given the template
		this.views[loc] = this.viewContainer.createEmbeddedView(
			this.template,
			new KBPage(this.collection[pageNumber], pageNumber, this));

		// Style the page accordingly
		for (let rootNode of this.views[loc].rootNodes) {
			this.StyleAsPage(rootNode);
			this.StyleAtStackLocation(rootNode, loc);
		}
	}

	// Styles a DOM element to be an absolute-positioned page-sized container
	protected StyleAsPage(pageElement: HTMLElement) {
		pageElement.style.display = "block";
		pageElement.style.position = "absolute";
		pageElement.style.width = this.pageWidth + "px";
		pageElement.style.height = this.pageHeight + "px";
	}

	// Styles a DOM element with an X location in the container
	protected StyleAtStackLocation(pageElement: HTMLElement, loc: StackLocation) {
		var xLocationInContainer = loc * this.pageWidth;
		pageElement.style.left = xLocationInContainer + "px";
	}

	// Moves an existing page to a new stack location
	private ChangeStackLocationOfView(curr: StackLocation, to: StackLocation) {
		if (!this.views[curr]) throw new Error("View does not exist at location: " + curr);
		for (let rootNode of this.views[curr].rootNodes) {
			this.StyleAtStackLocation(rootNode, to);
		}
		this.views[to] = this.views[curr];
		this.views[curr] = null;
	}


	// NAVIGATION

	// Updates rendering to display a new page
	private ChangePage(newPage: number, oldPage: number) {

		// If the page is incrementing or decrementing, we can simply shift existing views
		if (newPage == oldPage + 1) {
			this.GoToNextPage();
		} else if (newPage == oldPage - 1) {
			this.GoToPreviousPage();

		// Otherwise, just rebuild the DOM around this new page
		} else {
			this.ClearDOM();
			this.CreateDOM();
		}
	}

	private GoToNextPage() {
		// Remove the previous page from the DOM
		if (this.views[StackLocation.Previous]) {
			this.views[StackLocation.Previous].destroy();
			this.views[StackLocation.Previous] = null;
		}

		// Shift the Current and Next pages backwards
		this.ChangeStackLocationOfView(StackLocation.Current, StackLocation.Previous);
		this.ChangeStackLocationOfView(StackLocation.Next, StackLocation.Current);

		// Render a new page, if possible
		if (this.page < this.pageCount - 1) {
			this.BuildPage(this.page + 1, StackLocation.Next);
		}
	}

	private GoToPreviousPage() {
		// Remove the previous page from the DOM
		if (this.views[StackLocation.Next]) {
			this.views[StackLocation.Next].destroy();
			this.views[StackLocation.Next] = null;
		}

		// Shift the Current and Next pages backwards
		this.ChangeStackLocationOfView(StackLocation.Current, StackLocation.Next);
		this.ChangeStackLocationOfView(StackLocation.Previous, StackLocation.Current);

		// Render a new page, if possible
		if (this.page > 0) {
			this.BuildPage(this.page - 1, StackLocation.Previous);
		}
	}
}