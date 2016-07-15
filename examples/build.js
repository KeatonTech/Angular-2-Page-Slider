var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("app", ['@angular/core', '@angular/platform-browser-dynamic', '../../pageslider'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, platform_browser_dynamic_1, pageslider_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (pageslider_1_1) {
                pageslider_1 = pageslider_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.pages = [
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
                    ];
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'mobile-example-app',
                        directives: [pageslider_1.KBPagesRendererDirective, pageslider_1.KBPageSliderComponent],
                        template: "\n\t\t<kb-page-slider>\n\t\t\t<div *kbPages=\"let page of pages\" class=\"page\" [style.background]=\"page.color\">\n\t\t\t\t<h1>{{page.title}}</h1>\n\t\t\t</div>\n\t\t</kb-page-slider>\n\t",
                        styles: [
                            ":host {\n\t\t\tposition: relative;\n\t\t\tdisplay: block;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}",
                            "kb-page-slider {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tbottom: 0;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t}",
                            ".page {\n\t\t\tpadding: 15px 5px;\n\t\t\ttext-align: center;\n\t\t}"
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
            // Angular Bootstrap
            platform_browser_dynamic_1.bootstrap(AppComponent);
        }
    }
});
