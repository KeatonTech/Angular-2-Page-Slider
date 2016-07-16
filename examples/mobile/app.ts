/**
 * Highest level controller for the app. Basically just defers to the router.
 */
import { Component } 	from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { KBPagesRendererDirective, KBPageSliderComponent } from '../../ng2-page-slider';

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
export class MobileAppComponent {
	public pages = [
		{
			title: "Page 1",
			color: "red"
		},
		{
			title: "Page 2",
			color: "green"
		},
		{
			title: "Page 3",
			color: "blue"
		},
		{
			title: "Page 4",
			color: "purple"
		},
		{
			title: "Page 5",
			color: "maroon"
		},
		{
			title: "Page 6",
			color: "seagreen"
		},
		{
			title: "Page 7",
			color: "orange"
		}
	]
}

// Angular Bootstrap
bootstrap(MobileAppComponent);