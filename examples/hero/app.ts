/**
 * Highest level controller for the app. Basically just defers to the router.
 */
import { Component } 	from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import {
	KBPagesRendererDirective, KBPageSliderComponent, KBNavButtonComponent 
} from '../../ng2-page-slider';

@Component({
	selector: 'hero-example-app',
	directives: [KBPagesRendererDirective, KBPageSliderComponent, KBNavButtonComponent],
	template: `
		<div class="header">
			<h1>My Great Website</h1>
		</div>
		<kb-page-slider [overlayIndicator]="false" dotColor="black"
						[(page)]="pageNumber" [(pageCount)]="pageCount">

			<!-- Pages -->
			<div *kbPages="let page of pages" class="page" [style.background]="page.color">
				<div class="pageTitle">{{page.title}}</div>
			</div>

			<!-- Navigation -->
			<kb-nav-button backward [showBackground]="true"
						[(page)]="pageNumber" [pageCount]="pageCount">
			</kb-nav-button>
			<kb-nav-button forward [showBackground]="true"
						[(page)]="pageNumber" [pageCount]="pageCount">
			</kb-nav-button>
		</kb-page-slider>
	`,
	styles: [
		`.pageTitle {
			position: absolute;
			left: 0px;
			bottom: 0px;
			width: 100%;
			height: 44px;
			line-height: 44px;

			background-color: rgba(0,0,0,0.25);
			color: white;

			font-family: "San Francisco", "Arial", sans-serif;
			font-weight: bold;
			font-size: 18px;
			text-align: center;
		}`
	]
})
export class HeroAppComponent {
	public pageNumber : number = 0;
	public pageCount : number = 0;

	public pages = [
		{
			title: "About the Company",
			color: "red"
		},
		{
			title: "A Mission Statement",
			color: "green"
		},
		{
			title: "Diversity!",
			color: "seagreen"
		},
		{
			title: "World-class Business Things",
			color: "blue"
		},
		{
			title: "Ideas! Do You Have Any?",
			color: "purple"
		},
		{
			title: "Leaders In A Field Maybe?",
			color: "maroon"
		},
		{
			title: "We Have Lawyers",
			color: "orange"
		}
	]
}

// Angular Bootstrap
bootstrap(HeroAppComponent);