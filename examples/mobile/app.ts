/**
 * Highest level controller for the app. Basically just defers to the router.
 */
import { Component } 	from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { KBPagesRendererDirective, KBPageSliderComponent } from '../../pageslider';

@Component({
	selector: 'mobile-example-app',
	directives: [KBPagesRendererDirective, KBPageSliderComponent],
	template: `
		<kb-page-slider>
			<div *kbPages="let page of pages" class="page" [style.background]="page.color">
				<h1>{{page.title}}</h1>
			</div>
		</kb-page-slider>
	`,
	styles: [
		`:host {
			position: relative;
			display: block;
			width: 100%;
			height: 100%;
		}`,
		`kb-page-slider {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}`,
		`.page {
			padding: 15px 5px;
			text-align: center;
		}`
	]
})
export class AppComponent {
	public pages = [
		{
			title: "Page One",
			color: "red"
		},
		{
			title: "Page II",
			color: "green"
		},
		{
			title: "Page The Third",
			color: "blue"
		},
		{
			title: "Page4",
			color: "purple"
		},
		{
			title: "Page 5",
			color: "maroon"
		},
		{
			title: "Page  6",
			color: "seagreen"
		},
		{
			title: "Page   7",
			color: "grey"
		}
	]
}

// Angular Bootstrap
bootstrap(AppComponent);