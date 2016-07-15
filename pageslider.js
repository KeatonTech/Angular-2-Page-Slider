var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    This file contains some helpful types that are used throughout the module
*/
System.register("src/types", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StackLocation;
    return {
        setters:[],
        execute: function() {
            // The slider renders 3 pages to DOM at once, as follows
            (function (StackLocation) {
                StackLocation[StackLocation["Previous"] = 0] = "Previous";
                StackLocation[StackLocation["Current"] = 1] = "Current";
                StackLocation[StackLocation["Next"] = 2] = "Next";
            })(StackLocation || (StackLocation = {}));
            exports_1("StackLocation", StackLocation);
            ;
        }
    }
});
System.register("src/components/render.component", ['@angular/core', "src/types"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_1, types_1;
    var KBPage, KBPagesRendererDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (types_1_1) {
                types_1 = types_1_1;
            }],
        execute: function() {
            // PAGE CLASS ===============================================================================
            // Stores information about each page that is accessible from the template
            KBPage = (function () {
                function KBPage($implicit, index, parent) {
                    this.$implicit = $implicit;
                    this.index = index;
                    this.parent = parent;
                }
                ;
                Object.defineProperty(KBPage.prototype, "isActive", {
                    get: function () { return this.parent.page == this.index; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(KBPage.prototype, "isFirst", {
                    get: function () { return this.index == 0; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPage.prototype, "isLast", {
                    get: function () { return this.index == this.parent.pageCount - 1; },
                    enumerable: true,
                    configurable: true
                });
                return KBPage;
            }());
            exports_2("KBPage", KBPage);
            // PAGE RENDERER DIRECTIVE ==================================================================
            // Similar to ngFor, but renders items as stacked full-screen pages
            KBPagesRendererDirective = (function () {
                // Angular Injection
                function KBPagesRendererDirective(viewContainer, template) {
                    this.viewContainer = viewContainer;
                    this.template = template;
                    // Initialization
                    this.isInitialized = false;
                    // Page access
                    this._page = 0;
                    // SIZING
                    this.pageWidth = 0;
                    this.pageHeight = 0;
                    // DOM RENDERING ========================================================================
                    this.views = [null, null, null];
                }
                Object.defineProperty(KBPagesRendererDirective.prototype, "kbPagesOf", {
                    set: function (coll) {
                        this.collection = coll;
                        if (this.isInitialized) {
                            this.ClearDOM();
                            this.CreateDOM();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                KBPagesRendererDirective.prototype.ngOnInit = function () {
                    this.isInitialized = true;
                    this.CreateDOM();
                };
                Object.defineProperty(KBPagesRendererDirective.prototype, "pageCount", {
                    // PAGINATION
                    // Calculate page count from the loop
                    get: function () {
                        return (this.collection) ? this.collection.length : 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPagesRendererDirective.prototype, "page", {
                    get: function () { return this._page; },
                    set: function (page) { this.SetPage(page); },
                    enumerable: true,
                    configurable: true
                });
                KBPagesRendererDirective.prototype.SetPage = function (page) {
                    if (page < 0 || page >= this.pageCount)
                        return false;
                    var oldPage = this._page;
                    this._page = page;
                    this.ChangePage(page, oldPage);
                    return true;
                };
                KBPagesRendererDirective.prototype.Resize = function (width, height) {
                    this.pageWidth = width;
                    this.pageHeight = height;
                    if (this.isInitialized) {
                        this.ClearDOM();
                        this.CreateDOM();
                    }
                };
                // Renders 3 pages
                KBPagesRendererDirective.prototype.CreateDOM = function () {
                    if (this.page > 0)
                        this.BuildPage(this.page - 1, types_1.StackLocation.Previous);
                    this.BuildPage(this.page, types_1.StackLocation.Current);
                    if (this.page < this.pageCount)
                        this.BuildPage(this.page + 1, types_1.StackLocation.Next);
                };
                // Clears all pages out of the DOM, useful for re-rendering
                KBPagesRendererDirective.prototype.ClearDOM = function () {
                    for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                        var view = _a[_i];
                        if (view)
                            view.destroy();
                    }
                    this.views = [null, null, null];
                };
                // HTML CONSTRUCTION AND MANAGEMENT
                KBPagesRendererDirective.prototype.BuildPage = function (pageNumber, loc) {
                    if (pageNumber < 0 || pageNumber >= this.pageCount)
                        throw new Error("Attempted to create non-existent page: " + pageNumber);
                    // Create the page given the template
                    this.views[loc] = this.viewContainer.createEmbeddedView(this.template, new KBPage(this.collection[pageNumber], pageNumber, this));
                    // Style the page accordingly
                    for (var _i = 0, _a = this.views[loc].rootNodes; _i < _a.length; _i++) {
                        var rootNode = _a[_i];
                        this.StyleAsPage(rootNode);
                        this.StyleAtStackLocation(rootNode, loc);
                    }
                };
                // Styles a DOM element to be an absolute-positioned page-sized container
                KBPagesRendererDirective.prototype.StyleAsPage = function (pageElement) {
                    pageElement.style.display = "block";
                    pageElement.style.position = "absolute";
                    pageElement.style.width = this.pageWidth + "px";
                    pageElement.style.height = this.pageHeight + "px";
                };
                // Styles a DOM element with an X location in the container
                KBPagesRendererDirective.prototype.StyleAtStackLocation = function (pageElement, loc) {
                    var xLocationInContainer = loc * this.pageWidth;
                    pageElement.style.left = xLocationInContainer + "px";
                };
                // Moves an existing page to a new stack location
                KBPagesRendererDirective.prototype.ChangeStackLocationOfView = function (curr, to) {
                    if (!this.views[curr])
                        throw new Error("View does not exist at location: " + curr);
                    for (var _i = 0, _a = this.views[curr].rootNodes; _i < _a.length; _i++) {
                        var rootNode = _a[_i];
                        this.StyleAtStackLocation(rootNode, to);
                    }
                    this.views[to] = this.views[curr];
                    this.views[curr] = null;
                };
                // NAVIGATION
                // Updates rendering to display a new page
                KBPagesRendererDirective.prototype.ChangePage = function (newPage, oldPage) {
                    // If the page is incrementing or decrementing, we can simply shift existing views
                    if (newPage == oldPage + 1) {
                        this.GoToNextPage();
                    }
                    else if (newPage == oldPage - 1) {
                        this.GoToPreviousPage();
                    }
                    else {
                        this.ClearDOM();
                        this.CreateDOM();
                    }
                };
                KBPagesRendererDirective.prototype.GoToNextPage = function () {
                    // Remove the previous page from the DOM
                    if (this.views[types_1.StackLocation.Previous]) {
                        this.views[types_1.StackLocation.Previous].destroy();
                        this.views[types_1.StackLocation.Previous] = null;
                    }
                    // Shift the Current and Next pages backwards
                    this.ChangeStackLocationOfView(types_1.StackLocation.Current, types_1.StackLocation.Previous);
                    this.ChangeStackLocationOfView(types_1.StackLocation.Next, types_1.StackLocation.Current);
                    // Render a new page, if possible
                    if (this.page < this.pageCount - 1) {
                        this.BuildPage(this.page + 1, types_1.StackLocation.Next);
                    }
                };
                KBPagesRendererDirective.prototype.GoToPreviousPage = function () {
                    // Remove the previous page from the DOM
                    if (this.views[types_1.StackLocation.Next]) {
                        this.views[types_1.StackLocation.Next].destroy();
                        this.views[types_1.StackLocation.Next] = null;
                    }
                    // Shift the Current and Next pages backwards
                    this.ChangeStackLocationOfView(types_1.StackLocation.Current, types_1.StackLocation.Next);
                    this.ChangeStackLocationOfView(types_1.StackLocation.Previous, types_1.StackLocation.Current);
                    // Render a new page, if possible
                    if (this.page > 0) {
                        this.BuildPage(this.page - 1, types_1.StackLocation.Previous);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], KBPagesRendererDirective.prototype, "kbPagesOf", null);
                KBPagesRendererDirective = __decorate([
                    core_1.Directive({ selector: '[kbPages]' }), 
                    __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.TemplateRef])
                ], KBPagesRendererDirective);
                return KBPagesRendererDirective;
            }());
            exports_2("KBPagesRendererDirective", KBPagesRendererDirective);
        }
    }
});
System.register("src/components/dotindicator.component", ['@angular/core'], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2;
    var KBDotIndicatorComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            KBDotIndicatorComponent = (function () {
                function KBDotIndicatorComponent() {
                    // PUBLIC PROPERTIES
                    this._page = 0;
                    this._pageCount = 0;
                    // DATA REPRESENTATION
                    // An array of page dots, one of which (the active one) is true.
                    this.items = [];
                }
                Object.defineProperty(KBDotIndicatorComponent.prototype, "page", {
                    set: function (p) {
                        this._page = p;
                        this.updateSelected();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBDotIndicatorComponent.prototype, "pageCount", {
                    set: function (p) {
                        this._pageCount = p;
                        this.updateItems();
                    },
                    enumerable: true,
                    configurable: true
                });
                KBDotIndicatorComponent.prototype.updateItems = function () {
                    this.items = new Array(this._pageCount);
                    for (var i = 0; i < this._pageCount; i++) {
                        this.items[i] = { active: i == this._page };
                    }
                };
                KBDotIndicatorComponent.prototype.updateSelected = function () {
                    if (this.items.length != this._pageCount)
                        return this.updateItems();
                    if (this.items.length == 0)
                        return;
                    for (var i = 0; i < this._pageCount; i++)
                        this.items[i].active = false;
                    this.items[this._page].active = true;
                };
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', Number), 
                    __metadata('design:paramtypes', [Number])
                ], KBDotIndicatorComponent.prototype, "page", null);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', Number), 
                    __metadata('design:paramtypes', [Number])
                ], KBDotIndicatorComponent.prototype, "pageCount", null);
                KBDotIndicatorComponent = __decorate([
                    core_2.Component({
                        selector: 'kb-dot-indicator',
                        template: "\n\t\t<div *ngFor=\"let item of items\" class=\"dot\"\n\t\t\t [class.active]=\"item.active\"></div>\n\t",
                        styles: [
                            ":host {\n\t\t\tdisplay: -webkit-box;\n\t\t\tdisplay: -ms-flexbox;\n\t\t\tdisplay: flex;\n\t\t\t-webkit-box-orient: horizontal;\n\t\t\t-webkit-box-direction: normal;\n\t\t\t\t-ms-flex-direction: row;\n\t\t\t\t\tflex-direction: row;\n\t\t\t-webkit-box-pack: center;\n\t\t\t\t-ms-flex-pack: center;\n\t\t\t\t\tjustify-content: center;\n\t\t}",
                            ".dot {\n\t\t\twidth: 7px;\n\t\t\theight: 7px;\n\t\t\tborder-radius: 3px;\n\t\t\tmargin: 0 2px;\n\t\t\tbackground: white;\n\t\t\topacity: 0.5;\n\n\t\t\ttransition: opacity 66ms linear;\n\t\t\t-webkit-transition: opacity 66ms linear;\n\t\t}",
                            ".dot.active {\n\t\t\topacity: 1.0;\n\t\t}",
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], KBDotIndicatorComponent);
                return KBDotIndicatorComponent;
            }());
            exports_3("KBDotIndicatorComponent", KBDotIndicatorComponent);
        }
    }
});
// INTERACTIVITY - TOUCH EVENTS =============================================================
// Handles HTML touch events and formats it nicely for 
System.register("src/functionality/touchevents", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var kDistanceThreshold, kMomentumThreshold, kDistanceMomentumThreshold, TouchEventHandler;
    return {
        setters:[],
        execute: function() {
            // Snap back if user has moved less than 10% of the page
            kDistanceThreshold = 0.1;
            // If the user has moved less than 50% of the page, snap back
            // unless that are moving at more than 30% the page width every second
            kMomentumThreshold = 0.3;
            kDistanceMomentumThreshold = 0.5;
            TouchEventHandler = (function () {
                function TouchEventHandler(delegate, element) {
                    this.delegate = delegate;
                    this.element = element;
                    // Touch tracking state
                    this.start_x = 0;
                    this.current_x = 0;
                    this.current_scroll = 1;
                    this.tracking = null;
                    // MOMENTUM HIGH PASS
                    this.diffs_x = [0, 0, 0];
                    this.times_x = [20, 20, 20];
                    this.diffs_index = 0;
                    // Add touch event listeners
                    element.addEventListener("touchstart", this.TouchStart.bind(this));
                    element.addEventListener("touchmove", this.TouchMove.bind(this));
                    element.addEventListener("touchend", this.TouchEnd.bind(this));
                    element.addEventListener("touchcancel", this.TouchEnd.bind(this));
                }
                TouchEventHandler.prototype.CaptureXDiff = function (diff) {
                    this.diffs_x[this.diffs_index] = diff;
                    var ctime = new Date().getTime();
                    this.times_x[this.diffs_index] = ctime - this.last_sample_time;
                    this.last_sample_time = ctime;
                    if (++this.diffs_index == this.diffs_x.length)
                        this.diffs_index = 0;
                };
                Object.defineProperty(TouchEventHandler.prototype, "momentum_x", {
                    // Returns the scroll momentum in fractional page widths per second.
                    // (fpw/s * page width = px/s)
                    get: function () {
                        var acc = 0;
                        for (var i = 0; i < this.diffs_x.length; i++) {
                            acc += (this.diffs_x[i] / this.times_x[i]) * 1000 / 3;
                        }
                        return acc;
                    },
                    enumerable: true,
                    configurable: true
                });
                // DOM EVENT HANDLERS ===================================================================
                TouchEventHandler.prototype.TouchStart = function (event) {
                    if (this.tracking)
                        return;
                    if (event.touches.length > 1)
                        return;
                    this.tracking = event.touches.item(0).identifier;
                    this.start_x = event.touches.item(0).clientX / this.delegate.pageWidth;
                    this.current_x = this.start_x;
                    this.last_sample_time = new Date().getTime();
                };
                TouchEventHandler.prototype.TouchMove = function (event) {
                    var touch = this.GetTrackingTouch(event.changedTouches);
                    if (touch == null)
                        return;
                    var new_x = touch.clientX / this.delegate.pageWidth;
                    var diff_x = new_x - this.current_x;
                    this.CaptureXDiff(diff_x);
                    this.current_scroll = this.current_scroll - diff_x;
                    this.delegate.ScrollTo(this.current_scroll);
                    this.current_x = new_x;
                };
                TouchEventHandler.prototype.TouchEnd = function (event) {
                    var touch = this.GetTrackingTouch(event.changedTouches);
                    if (touch == null)
                        return;
                    this.tracking = null;
                    this.current_scroll = 1;
                    var ending_momentum_x = this.momentum_x;
                    if (this.current_x + kDistanceThreshold < this.start_x) {
                        if (this.current_x + kDistanceMomentumThreshold < this.start_x ||
                            -ending_momentum_x > kMomentumThreshold) {
                            this.delegate.AnimateToNextPage(ending_momentum_x);
                        }
                        else {
                            this.delegate.AnimateToX(1, ending_momentum_x);
                        }
                    }
                    else if (this.current_x - kDistanceThreshold > this.start_x) {
                        if (this.current_x - kDistanceMomentumThreshold > this.start_x ||
                            ending_momentum_x > kMomentumThreshold) {
                            this.delegate.AnimateToPreviousPage(ending_momentum_x);
                        }
                        else {
                            this.delegate.AnimateToX(1, ending_momentum_x);
                        }
                    }
                    else {
                        this.delegate.AnimateToX(1, ending_momentum_x);
                    }
                };
                // HELPERS
                TouchEventHandler.prototype.GetTrackingTouch = function (list) {
                    if (this.tracking === null)
                        return null;
                    for (var i = 0; i < list.length; i++) {
                        var touch = list.item(i);
                        if (touch.identifier == this.tracking)
                            return touch;
                    }
                    return null;
                };
                return TouchEventHandler;
            }());
            exports_4("TouchEventHandler", TouchEventHandler);
        }
    }
});
/*
    A special class that wraps CSS3 animations and also determines their ideal duration
    based on momentum and distance to travel.
*/
System.register("src/functionality/animation", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var kEasingFunction, kEasingStartSlope, kDefaultDuration, kMinDuration, kMaxDuration, SlideAnimation;
    return {
        setters:[],
        execute: function() {
            kEasingFunction = "cubic-bezier(.35,.45,.5,1)";
            kEasingStartSlope = 1.33;
            kDefaultDuration = 300;
            kMinDuration = 60;
            kMaxDuration = 500;
            SlideAnimation = (function () {
                // The real meat of the animation code
                // Hard-coded to the 'left' property because that's all we use here
                // but certainly this code could be generalized if needed.
                function SlideAnimation(element, current_px, dest_px, momentum_px) {
                    var _this = this;
                    this.element = element;
                    this.current_px = current_px;
                    this.dest_px = dest_px;
                    this.momentum_px = momentum_px;
                    // Pseudo-promise
                    this.on_complete = [];
                    // Set up the CSS transition
                    var duration = Math.round(this.CalculateDuration());
                    var tProperty = "left " + duration + "ms " + kEasingFunction;
                    element.style.transition = tProperty;
                    element.style.webkitTransition = tProperty;
                    // Wait for that to propogate
                    setTimeout(function () {
                        // Move to the destination location
                        element.style.left = dest_px + "px";
                        // Wait for that to finish and clean it up
                        setTimeout(function () {
                            for (var _i = 0, _a = _this.on_complete; _i < _a.length; _i++) {
                                var f = _a[_i];
                                f();
                            }
                            element.style.transition = "";
                            element.style.webkitTransition = "";
                        }, duration + 10);
                    }, 10);
                }
                SlideAnimation.prototype.then = function (on_complete) {
                    this.on_complete.push(on_complete);
                    return this;
                };
                // HELPERS
                // First step is figuring out the duration such that the starting
                // momentum of the transition matches the user's scroll momentum.
                // We could do this with 100% accuracy by determining the slope
                // of the bezier easing curve but ... meh. It's about 1.5-ish.
                SlideAnimation.prototype.CalculateDuration = function () {
                    var travel_px = this.dest_px - this.current_px;
                    // If the momentum is going the same direction as the movement, use it!
                    if ((this.momentum_px < 0) == (travel_px < 0)) {
                        var linear_duration = 1000 * Math.abs(travel_px) / Math.abs(this.momentum_px);
                        var estimate = linear_duration * kEasingStartSlope;
                        return Math.max(Math.min(estimate, kMaxDuration), kMinDuration);
                    }
                    else {
                        return kDefaultDuration;
                    }
                };
                return SlideAnimation;
            }());
            exports_5("SlideAnimation", SlideAnimation);
        }
    }
});
System.register("src/components/pageslider.component", ["src/components/render.component", '@angular/core', "src/components/dotindicator.component", "src/functionality/touchevents", "src/functionality/animation"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_3, render_component_1, dotindicator_component_1, touchevents_1, animation_1;
    var KBPageSliderComponent;
    return {
        setters:[
            function (render_component_2_1) {
                exports_6({
                    "KBPagesRendererDirective": render_component_2_1["KBPagesRendererDirective"],
                    "KBPage": render_component_2_1["KBPage"]
                });
                render_component_1 = render_component_2_1;
            },
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (dotindicator_component_1_1) {
                dotindicator_component_1 = dotindicator_component_1_1;
            },
            function (touchevents_1_1) {
                touchevents_1 = touchevents_1_1;
            },
            function (animation_1_1) {
                animation_1 = animation_1_1;
            }],
        execute: function() {
            // PAGE CONTAINER DIRECTIVE =================================================================
            // Handles fancy things like page animation and controls KBPagesRendererDirective
            KBPageSliderComponent = (function () {
                function KBPageSliderComponent(element) {
                    this.element = element;
                    this.pageChange = new core_3.EventEmitter();
                    this.pageCountChange = new core_3.EventEmitter();
                    this.showIndicator = true;
                    this.overlayIndicator = true;
                    // PRIVATE VARIABLES
                    this._pageOffset = 1;
                    // INTERACTION HANDLER ==================================================================
                    this.blockInteraction = false;
                    this.eventHandler = new touchevents_1.TouchEventHandler(this, this.element.nativeElement);
                }
                Object.defineProperty(KBPageSliderComponent.prototype, "page", {
                    get: function () { return (this.renderer) ? this.renderer.page : 0; },
                    // INTERFACE
                    set: function (pn) {
                        if (this.renderer)
                            this.renderer.page = pn;
                        this.pageChange.emit(pn);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "pageCount", {
                    get: function () { return (this.renderer) ? this.renderer.pageCount : 0; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "pageOffset", {
                    get: function () { return this._pageOffset; },
                    set: function (v) {
                        this._pageOffset = v;
                        if (!this.blockInteraction) {
                            this.innerContainer.style.left = this.pxOffset;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "pxOffset", {
                    get: function () { return -this.pageOffset * this.pageWidth + "px"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "pageWidth", {
                    // SIZING
                    get: function () { return this.element.nativeElement.offsetWidth; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "pageHeight", {
                    get: function () { return this.element.nativeElement.offsetHeight; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "containerWidth", {
                    get: function () { return this.pageWidth * 3 + "px"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(KBPageSliderComponent.prototype, "containerHeight", {
                    get: function () {
                        var chin = (this.showIndicator && !this.overlayIndicator) ? 40 : 0;
                        return (this.pageHeight - chin) + "px";
                    },
                    enumerable: true,
                    configurable: true
                });
                KBPageSliderComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.innerContainer = this.element.nativeElement.querySelector(".inner");
                    this.innerContainer.style.left = -this.pageWidth + "px";
                    this.renderer.Resize(this.pageWidth, this.pageHeight);
                    window.addEventListener("resize", function () {
                        _this.renderer.Resize(_this.pageWidth, _this.pageHeight);
                    });
                };
                KBPageSliderComponent.prototype.ScrollTo = function (x) {
                    if (this.blockInteraction)
                        return;
                    this.pageOffset = this.ClampX(x);
                };
                KBPageSliderComponent.prototype.AnimateToNextPage = function (momentum) {
                    var _this = this;
                    if (this.blockInteraction)
                        return;
                    if (this.page == this.renderer.pageCount - 1)
                        return;
                    this.AnimateToX(2, momentum).then(function () {
                        _this.page++;
                        _this.pageOffset = 1;
                    });
                };
                KBPageSliderComponent.prototype.AnimateToPreviousPage = function (momentum) {
                    var _this = this;
                    if (this.blockInteraction)
                        return;
                    if (this.page == 0)
                        return;
                    this.AnimateToX(0, momentum).then(function () {
                        _this.page--;
                        _this.pageOffset = 1;
                    });
                };
                KBPageSliderComponent.prototype.AnimateToX = function (x, momentum) {
                    var _this = this;
                    if (this.blockInteraction)
                        return;
                    this.blockInteraction = true;
                    var w = this.pageWidth;
                    return new animation_1.SlideAnimation(this.innerContainer, // Element to animate
                    -this.pageOffset * w, // Current position (px)
                    -x * w, // Destination position (px)
                    momentum * w // User scroll momentum (px/s)
                    ).then(function () {
                        _this.blockInteraction = false;
                    });
                };
                // HELPERS
                // Get X to a reasonable range, taking into account page boundaries
                KBPageSliderComponent.prototype.ClampX = function (x) {
                    if (x < 0)
                        x = 0;
                    if (x > 2)
                        x = 2;
                    if (this.page == 0 && x < 1)
                        x = 1;
                    if (this.page == this.renderer.pageCount - 1 && x > 1)
                        x = 1;
                    return x;
                };
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Number), 
                    __metadata('design:paramtypes', [Number])
                ], KBPageSliderComponent.prototype, "page", null);
                __decorate([
                    core_3.Output(), 
                    __metadata('design:type', Object)
                ], KBPageSliderComponent.prototype, "pageChange", void 0);
                __decorate([
                    core_3.Output(), 
                    __metadata('design:type', Object)
                ], KBPageSliderComponent.prototype, "pageCountChange", void 0);
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Boolean)
                ], KBPageSliderComponent.prototype, "showIndicator", void 0);
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Boolean)
                ], KBPageSliderComponent.prototype, "overlayIndicator", void 0);
                __decorate([
                    core_3.ContentChild(render_component_1.KBPagesRendererDirective), 
                    __metadata('design:type', render_component_1.KBPagesRendererDirective)
                ], KBPageSliderComponent.prototype, "renderer", void 0);
                KBPageSliderComponent = __decorate([
                    core_3.Component({
                        selector: 'kb-page-slider',
                        directives: [dotindicator_component_1.KBDotIndicatorComponent],
                        template: "\n\t\t<div class=\"inner\" \n\t\t\t\t[style.width]=\"containerWidth\"\n\t\t\t\t[style.height]=\"containerHeight\">\n\t\t\t<ng-content></ng-content>\n\t\t</div>\n\t\t<kb-dot-indicator *ngIf=\"showIndicator\"\n\t\t\t\t[page]=\"page\"\n\t\t\t\t[pageCount]=\"pageCount\">\n\t\t</kb-dot-indicator>\n\t",
                        styles: [
                            ":host {\n\t\t\toverflow: hidden;\n\t\t\tdisplay: block;\n\t\t}",
                            ".inner {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twill-change: left;\n\t\t}",
                            "kb-dot-indicator {\n\t\t\tposition: absolute;\n\t\t\tbottom: 16px;\n\t\t\twidth: 100%;\n\t\t}"
                        ]
                    }), 
                    __metadata('design:paramtypes', [core_3.ElementRef])
                ], KBPageSliderComponent);
                return KBPageSliderComponent;
            }());
            exports_6("KBPageSliderComponent", KBPageSliderComponent);
        }
    }
});
/*

    ANGULAR 2 PAGE SLIDER COMPONENT
    with DOM recycling and caching
    designed for mobile devices

    Copyright (c) 2016 Keaton Brandt

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software, and to permit
    persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.

*/
System.register(["src/components/pageslider.component", "src/components/render.component"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    return {
        setters:[
            function (pageslider_component_1_1) {
                exports_7({
                    "KBPageSliderComponent": pageslider_component_1_1["KBPageSliderComponent"]
                });
            },
            function (render_component_3_1) {
                exports_7({
                    "KBPagesRendererDirective": render_component_3_1["KBPagesRendererDirective"]
                });
            }],
        execute: function() {
        }
    }
});
