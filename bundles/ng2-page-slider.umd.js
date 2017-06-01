(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define('ng2-page-slider', ['exports', '@angular/core', '@angular/platform-browser'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.pageSlider = global.ng.pageSlider || {}),global.ng.core,global.ng.platformBrowser));
}(this, (function (exports,_angular_core,_angular_platformBrowser) { 'use strict';

var StackLocation = {};
StackLocation.Previous = 0;
StackLocation.Current = 1;
StackLocation.Next = 2;
StackLocation[StackLocation.Previous] = "Previous";
StackLocation[StackLocation.Current] = "Current";
StackLocation[StackLocation.Next] = "Next";

var KBPage = (function () {
    /**
     * @param {?} $implicit
     * @param {?} index
     * @param {?} parent
     */
    function KBPage($implicit, index, parent) {
        this.$implicit = $implicit;
        this.index = index;
        this.parent = parent;
    }
    
    Object.defineProperty(KBPage.prototype, "isActive", {
        /**
         * @return {?}
         */
        get: function () { return this.parent.page == this.index; },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(KBPage.prototype, "isFirst", {
        /**
         * @return {?}
         */
        get: function () { return this.index == 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPage.prototype, "isLast", {
        /**
         * @return {?}
         */
        get: function () { return this.index == this.parent.pageCount - 1; },
        enumerable: true,
        configurable: true
    });
    return KBPage;
}());
var KBPagesRendererDirective = (function () {
    /**
     * @param {?} viewContainer
     * @param {?} template
     */
    function KBPagesRendererDirective(viewContainer, template) {
        this.viewContainer = viewContainer;
        this.template = template;
        this.isInitialized = false;
        this.pageCountChange = new _angular_core.EventEmitter();
        this._page = 0;
        this.pageWidth = 0;
        this.pageHeight = 0;
        this.views = [null, null, null];
    }
    Object.defineProperty(KBPagesRendererDirective.prototype, "kbPagesOf", {
        /**
         * @param {?} coll
         * @return {?}
         */
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
    /**
     * @return {?}
     */
    KBPagesRendererDirective.prototype.ngOnInit = function () {
        this.isInitialized = true;
        this.CreateDOM();
    };
    Object.defineProperty(KBPagesRendererDirective.prototype, "pageCount", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ count = (this.collection) ? this.collection.length : 0;
            if (this._lastPageCount != count)
                this.pageCountChange.emit(count);
            return count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPagesRendererDirective.prototype, "page", {
        /**
         * @return {?}
         */
        get: function () { return this._page; },
        /**
         * @param {?} page
         * @return {?}
         */
        set: function (page) { this.SetPage(page); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} page
     * @return {?}
     */
    KBPagesRendererDirective.prototype.SetPage = function (page) {
        if (page < 0 || page >= this.pageCount)
            return false;
        var /** @type {?} */ oldPage = this._page;
        this._page = page;
        this.ChangePage(page, oldPage);
        return true;
    };
    /**
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    KBPagesRendererDirective.prototype.Resize = function (width, height) {
        this.pageWidth = width;
        this.pageHeight = height;
        if (this.isInitialized) {
            this.ClearDOM();
            this.CreateDOM();
        }
    };
    /**
     * @return {?}
     */
    KBPagesRendererDirective.prototype.CreateDOM = function () {
        if (this.pageCount == 0 || this.collection == undefined)
            return;
        if (this.page > 0)
            this.BuildPage(this.page - 1, StackLocation.Previous);
        this.BuildPage(this.page, StackLocation.Current);
        if (this.page < this.pageCount - 1)
            this.BuildPage(this.page + 1, StackLocation.Next);
    };
    /**
     * @return {?}
     */
    KBPagesRendererDirective.prototype.ClearDOM = function () {
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var view = _a[_i];
            if (view)
                view.destroy();
        }
        this.views = [null, null, null];
    };
    /**
     * @param {?} pageNumber
     * @param {?} loc
     * @return {?}
     */
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
    /**
     * @param {?} pageElement
     * @return {?}
     */
    KBPagesRendererDirective.prototype.StyleAsPage = function (pageElement) {
        pageElement.style.display = "block";
        pageElement.style.position = "absolute";
        pageElement.style.width = this.pageWidth + "px";
        pageElement.style.height = this.pageHeight + "px";
    };
    /**
     * @param {?} pageElement
     * @param {?} loc
     * @return {?}
     */
    KBPagesRendererDirective.prototype.StyleAtStackLocation = function (pageElement, loc) {
        var /** @type {?} */ xLocationInContainer = loc * this.pageWidth;
        pageElement.style.left = xLocationInContainer + "px";
    };
    /**
     * @param {?} curr
     * @param {?} to
     * @return {?}
     */
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
    /**
     * @param {?} newPage
     * @param {?} oldPage
     * @return {?}
     */
    KBPagesRendererDirective.prototype.ChangePage = function (newPage, oldPage) {
        // If the page is incrementing or decrementing, we can simply shift existing views
        if (newPage == oldPage + 1) {
            this.GoToNextPage();
        }
        else if (newPage == oldPage - 1) {
            this.GoToPreviousPage();
            // Otherwise, just rebuild the DOM around this new page
        }
        else {
            this.ClearDOM();
            this.CreateDOM();
        }
    };
    /**
     * @return {?}
     */
    KBPagesRendererDirective.prototype.GoToNextPage = function () {
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
    };
    /**
     * @return {?}
     */
    KBPagesRendererDirective.prototype.GoToPreviousPage = function () {
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
    };
    return KBPagesRendererDirective;
}());
KBPagesRendererDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[kbPages]' },] },
];
/**
 * @nocollapse
 */
KBPagesRendererDirective.ctorParameters = function () { return [
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_core.TemplateRef, },
]; };
KBPagesRendererDirective.propDecorators = {
    'kbPagesOf': [{ type: _angular_core.Input },],
};

var KBNavButtonComponent = (function () {
    /**
     * @param {?} forward
     * @param {?} backward
     */
    function KBNavButtonComponent(forward, backward) {
        this.pageChange = new _angular_core.EventEmitter();
        this.size = 44;
        this.showBackground = false;
        this.backgroundColor = "white";
        if (forward != undefined) {
            if (backward != undefined) {
                throw new Error("Nav Button cannot be both forward and backwards");
            }
            else {
                this.isForward = true;
            }
        }
        else if (backward != undefined) {
            this.isForward = false;
        }
        else {
            throw new Error("Must specify either 'forward' or 'backward' on nav button");
        }
    }
    Object.defineProperty(KBNavButtonComponent.prototype, "disabled", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.isForward) {
                return this.page >= this.pageCount - 1;
            }
            else {
                return this.page <= 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBNavButtonComponent.prototype, "derivedIconColor", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.iconColor !== undefined)
                return this.iconColor;
            return (this.showBackground) ? "black" : "white";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBNavButtonComponent.prototype, "derivedBackgroundColor", {
        /**
         * @return {?}
         */
        get: function () {
            return (this.showBackground) ? this.backgroundColor : "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBNavButtonComponent.prototype, "derivedSize", {
        /**
         * @return {?}
         */
        get: function () { return this.size + "px"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBNavButtonComponent.prototype, "halfSize", {
        /**
         * @return {?}
         */
        get: function () { return this.size / 2 + "px"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBNavButtonComponent.prototype, "symbol", {
        /**
         * @return {?}
         */
        get: function () {
            return (this.isForward) ? "&rsaquo;" : "&lsaquo;";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    KBNavButtonComponent.prototype.OnClick = function () {
        if (this.disabled)
            return;
        this.pageChange.emit((this.isForward) ? ++this.page : --this.page);
    };
    return KBNavButtonComponent;
}());
KBNavButtonComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'kb-nav-button',
                template: "\n\t\t<a\t(click)=\"OnClick()\"\n\t\t\t[innerHTML]=\"symbol\"\n\t\t\t[class.circle]=\"showBackground\"\n\t\t\t[class.disabled]=\"disabled\"\n\t\t\t[style.width]=\"derivedSize\" [style.height]=\"derivedSize\"\n\t\t\t[style.borderRadius]=\"halfSize\"\n\t\t\t[style.fontSize]=\"derivedSize\"\n\t\t\t[style.color]=\"derivedIconColor\"\n\t\t\t[style.backgroundColor]=\"derivedBackgroundColor\"\n\t\t></a>\n\t",
                styles: [
                    ":host {\n\t\t\tcursor: pointer;\n\t\t\t-webkit-touch-callout: none; /* iOS Safari */\n\t\t\t-webkit-user-select: none;   /* Chrome/Safari/Opera */\n\t\t\t-khtml-user-select: none;    /* Konqueror */\n\t\t\t-moz-user-select: none;      /* Firefox */\n\t\t\t-ms-user-select: none;       /* Internet Explorer/Edge */\n\t\t\tuser-select: none;\n\t\t}",
                    "a {\n\t\t\tdisplay: block;\n\t\t\ttext-align: center;\n    \t\tline-height: 36px;\n\t\t}",
                    ":host[forward] a {\n\t\t\tpadding-left: 3px;\n\t\t}",
                    ":host[backward] a {\n\t\t\tpadding-right: 3px;\n\t\t}",
                    "a.circle {\n\t\t\tbox-shadow: 0 1px 2px rgba(0,0,0,0.25);\n\t\t}",
                    "a.disabled {\n\t\t\topacity: 0.33;\n\t\t}"
                ]
            },] },
];
/**
 * @nocollapse
 */
KBNavButtonComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['forward',] },] },
    { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['backward',] },] },
]; };
KBNavButtonComponent.propDecorators = {
    'page': [{ type: _angular_core.Input },],
    'pageChange': [{ type: _angular_core.Output },],
    'pageCount': [{ type: _angular_core.Input },],
    'size': [{ type: _angular_core.Input },],
    'showBackground': [{ type: _angular_core.Input },],
    'iconColor': [{ type: _angular_core.Input },],
    'backgroundColor': [{ type: _angular_core.Input },],
};

/*
    A special class that wraps CSS3 animations and also determines their ideal duration
    based on momentum and distance to travel.
*/
var kEasingFunction = "cubic-bezier(.35,.45,.5,1)";
var kEasingStartSlope = 1.33;
var kDefaultDuration = 250;
var kMinDuration = 60;
var kMaxDuration = 660;
var SlideAnimation = (function () {
    /**
     * @param {?} element
     * @param {?} current_px
     * @param {?} dest_px
     * @param {?} momentum_px
     * @param {?=} default_duration
     */
    function SlideAnimation(element, current_px, dest_px, momentum_px, default_duration) {
        var _this = this;
        this.current_px = current_px;
        this.dest_px = dest_px;
        this.momentum_px = momentum_px;
        this.default_duration = default_duration;
        this.on_complete = [];
        if (default_duration === undefined) {
            this.default_duration = kDefaultDuration;
        }
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
    /**
     * @param {?} on_complete
     * @return {?}
     */
    SlideAnimation.prototype.then = function (on_complete) {
        this.on_complete.push(on_complete);
        return this;
    };
    /**
     * @return {?}
     */
    SlideAnimation.prototype.CalculateDuration = function () {
        var /** @type {?} */ travel_px = this.dest_px - this.current_px;
        // If the momentum is going the same direction as the movement, use it!
        if (this.momentum_px != 0 && (this.momentum_px < 0) == (travel_px < 0)) {
            var /** @type {?} */ linear_duration = 1000 * Math.abs(travel_px) / Math.abs(this.momentum_px);
            var /** @type {?} */ estimate = linear_duration * kEasingStartSlope;
            return Math.max(Math.min(estimate, kMaxDuration), kMinDuration);
            // Otherwise, throw it out and use our default duration
        }
        else {
            return this.default_duration;
        }
    };
    return SlideAnimation;
}());

/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */
var SideClickHandler = (function () {
    /**
     * @param {?} delegate
     * @param {?} element
     */
    function SideClickHandler(delegate, element) {
        this.delegate = delegate;
        this.element = element;
        this.enabled = true;
        this.threshold = 20;
        element.addEventListener("click", this.ClickHandler.bind(this));
    }
    /**
     * @param {?} e
     * @return {?}
     */
    SideClickHandler.prototype.ClickHandler = function (e) {
        if (!this.enabled)
            return;
        var /** @type {?} */ elementX = e.clientX - this.element.getBoundingClientRect().left;
        if (elementX < this.threshold) {
            this.delegate.AnimateToPreviousPage(0);
        }
        else if (elementX > this.element.offsetWidth - this.threshold) {
            this.delegate.AnimateToNextPage(0);
        }
    };
    return SideClickHandler;
}());

// INTERACTIVITY - TOUCH EVENTS =============================================================
// Handles HTML touch events and formats it nicely for
// Snap back if user has moved less than 10% of the page
var kDistanceThreshold = 0.1;
// If the user has moved less than 50% of the page, snap back
// unless that are moving at more than 30% the page width every second
var kMomentumThreshold = 0.3;
var kDistanceMomentumThreshold = 0.5;
// Ignore scrolls until they have moved at least 3% along X. If, during that time, they
// move more than 20px on Y, they will be rejected and interpreted instead as a vertical
// scroll gesture
var kAcceptAtX = 0.03;
var kRejectAtY = 20;
var TouchEventHandler = (function () {
    /**
     * @param {?} delegate
     * @param {?} element
     */
    function TouchEventHandler(delegate, element) {
        this.delegate = delegate;
        this.start_x = 0;
        this.current_x = 0;
        this.start_ypx = 0;
        this.current_scroll = 1;
        this.tracking = null;
        this.accepted = false;
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
    /**
     * @param {?} diff
     * @return {?}
     */
    TouchEventHandler.prototype.CaptureXDiff = function (diff) {
        this.diffs_x[this.diffs_index] = diff;
        var /** @type {?} */ ctime = new Date().getTime();
        this.times_x[this.diffs_index] = ctime - this.last_sample_time;
        this.last_sample_time = ctime;
        if (++this.diffs_index == this.diffs_x.length)
            this.diffs_index = 0;
    };
    Object.defineProperty(TouchEventHandler.prototype, "momentum_x", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ acc = 0;
            for (var /** @type {?} */ i = 0; i < this.diffs_x.length; i++) {
                acc += (this.diffs_x[i] / this.times_x[i]) * 1000 / 3;
            }
            return acc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    TouchEventHandler.prototype.TouchStart = function (event) {
        if (this.tracking)
            return;
        if (event.touches.length > 1)
            return;
        this.tracking = event.touches.item(0).identifier;
        this.start_x = event.touches.item(0).clientX / this.delegate.pageWidth;
        this.current_x = this.start_x;
        this.start_ypx = event.touches.item(0).clientY;
        this.last_sample_time = new Date().getTime();
        this.accepted = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TouchEventHandler.prototype.TouchMove = function (event) {
        var /** @type {?} */ touch = this.GetTrackingTouch(event.changedTouches);
        if (touch == null)
            return;
        var /** @type {?} */ new_x = touch.clientX / this.delegate.pageWidth;
        var /** @type {?} */ diff_x = new_x - this.current_x;
        if (!this.accepted) {
            if (Math.abs(new_x - this.start_x) >= kAcceptAtX) {
                if (Math.abs(touch.clientY - this.start_ypx) > kRejectAtY) {
                    this.tracking = null;
                    return;
                }
                else {
                    this.accepted = true;
                    this.delegate.StartScroll();
                }
            }
            else
                return;
        }
        event.preventDefault();
        this.CaptureXDiff(diff_x);
        this.current_scroll = this.current_scroll - diff_x;
        this.delegate.ScrollTo(this.current_scroll);
        this.current_x = new_x;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TouchEventHandler.prototype.TouchEnd = function (event) {
        var /** @type {?} */ touch = this.GetTrackingTouch(event.changedTouches);
        if (touch == null)
            return;
        this.tracking = null;
        if (this.start_x == this.current_x)
            return;
        if (!this.accepted)
            return;
        event.preventDefault();
        this.delegate.EndScroll();
        this.current_scroll = 1;
        var /** @type {?} */ ending_momentum_x = this.momentum_x;
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
    /**
     * @param {?} list
     * @return {?}
     */
    TouchEventHandler.prototype.GetTrackingTouch = function (list) {
        if (this.tracking === null)
            return null;
        for (var /** @type {?} */ i = 0; i < list.length; i++) {
            var /** @type {?} */ touch = list.item(i);
            if (touch.identifier == this.tracking)
                return touch;
        }
        return null;
    };
    return TouchEventHandler;
}());

/**
 * When the user clicks very close to the edge of a page, move in that direction.
 */
var ArrowKeysHandler = (function () {
    /**
     * @param {?} delegate
     */
    function ArrowKeysHandler(delegate) {
        this.delegate = delegate;
        this.enabled = true;
        document.addEventListener("keydown", this.KeyHandler.bind(this));
    }
    /**
     * @param {?} e
     * @return {?}
     */
    ArrowKeysHandler.prototype.KeyHandler = function (e) {
        if (!this.enabled)
            return;
        if (e.keyCode == 37) {
            this.delegate.AnimateToPreviousPage(0);
        }
        else if (e.keyCode == 39) {
            this.delegate.AnimateToNextPage(0);
        }
    };
    return ArrowKeysHandler;
}());

var KBPageSliderComponent = (function () {
    /**
     * @param {?} element
     */
    function KBPageSliderComponent(element) {
        this.element = element;
        this.pageChange = new _angular_core.EventEmitter();
        this.pageSizeChange = new _angular_core.EventEmitter();
        this.pageCountChange = new _angular_core.EventEmitter();
        this.showIndicator = true;
        this.overlayIndicator = true;
        this.dotColor = "white";
        this.locked = false;
        this.enableOverscroll = true;
        this.scrollStateChange = new _angular_core.EventEmitter();
        this._pageOffset = 1;
        this.blockInteraction = false;
        var htmlElement = this.element.nativeElement;
        this.touchEventHandler = new TouchEventHandler(this, htmlElement);
        this.sideClickHandler = new SideClickHandler(this, htmlElement);
        this.arrowKeysHandler = new ArrowKeysHandler(this);
    }
    Object.defineProperty(KBPageSliderComponent.prototype, "page", {
        /**
         * @return {?}
         */
        get: function () { return (this.renderer) ? this.renderer.page : 0; },
        /**
         * @param {?} pn
         * @return {?}
         */
        set: function (pn) {
            if (pn < 0 || pn >= this.pageCount)
                return;
            if (pn == this.renderer.page)
                return;
            if (this.renderer) {
                if (pn == this.renderer.page + 1) {
                    if (this.blockInteraction) {
                        this.pageChange.emit(this.page);
                        return;
                    }
                    this.AnimateToNextPage();
                }
                else if (pn == this.renderer.page - 1) {
                    if (this.blockInteraction) {
                        this.pageChange.emit(this.page);
                        return;
                    }
                    this.AnimateToPreviousPage();
                }
                else {
                    if (this.blockInteraction) {
                        this.pageChange.emit(this.page);
                        return;
                    }
                    this.renderer.page = pn;
                    this.pageChange.emit(pn);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "pageCount", {
        /**
         * @return {?}
         */
        get: function () { return (this.renderer) ? this.renderer.pageCount : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "enableSideClicks", {
        /**
         * @param {?} enabled
         * @return {?}
         */
        set: function (enabled) {
            (this.sideClickHandler) ? this.sideClickHandler.enabled = enabled : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "enableArrowKeys", {
        /**
         * @param {?} enabled
         * @return {?}
         */
        set: function (enabled) {
            (this.arrowKeysHandler) ? this.arrowKeysHandler.enabled = enabled : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "pageOffset", {
        /**
         * @return {?}
         */
        get: function () { return this._pageOffset; },
        /**
         * @param {?} v
         * @return {?}
         */
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
        /**
         * @return {?}
         */
        get: function () { return -this.pageOffset * this.pageWidth + "px"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "buttonTop", {
        /**
         * @return {?}
         */
        get: function () {
            return this.pageHeight / 2 - this.buttons.first.size / 2 + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "pageWidth", {
        /**
         * @return {?}
         */
        get: function () { return this.element.nativeElement.offsetWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "pageHeight", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ fullHeight = this.element.nativeElement.offsetHeight;
            var /** @type {?} */ chin = (this.showIndicator && !this.overlayIndicator) ? 20 : 0;
            return fullHeight - chin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "containerWidth", {
        /**
         * @return {?}
         */
        get: function () { return this.pageWidth * 3 + "px"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "containerHeight", {
        /**
         * @return {?}
         */
        get: function () { return this.pageHeight + "px"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBPageSliderComponent.prototype, "dotBottom", {
        /**
         * @return {?}
         */
        get: function () { return (this.overlayIndicator) ? "16px" : "0px"; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    KBPageSliderComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.renderer) {
            console.log("\n\t\t\t\tThe *kbPages directive is used to render pages efficiently, such that only\n\t\t\t\tpages that are visible are in the DOM. Without this directive, the page\n\t\t\t\tslider will not display anything.\n\t\t\t");
            throw new Error('No *kbPages directive found inside kb-page-slider');
        }
        this.renderer.pageCountChange.subscribe(function (count) {
            _this.pageCountChange.emit(count);
        });
        this.Resize();
        this.renderer.Resize(this.pageWidth, this.pageHeight);
        window.addEventListener("resize", function () {
            _this.Resize();
            _this.renderer.Resize(_this.pageWidth, _this.pageHeight);
            _this.pageSizeChange.emit([_this.pageWidth, _this.pageHeight]);
        });
    };
    /**
     * @return {?}
     */
    KBPageSliderComponent.prototype.Resize = function () {
        this.innerContainer = this.element.nativeElement.querySelector(".inner");
        this.innerContainer.style.left = -this.pageWidth + "px";
    };
    /**
     * @param {?} x
     * @return {?}
     */
    KBPageSliderComponent.prototype.ScrollTo = function (x) {
        if (this.locked || this.blockInteraction)
            return;
        this.pageOffset = this.ClampX(x);
    };
    /**
     * @param {?=} momentum
     * @return {?}
     */
    KBPageSliderComponent.prototype.AnimateToNextPage = function (momentum) {
        var _this = this;
        if (this.locked || this.blockInteraction)
            return null;
        if (this.page == this.renderer.pageCount - 1) {
            return this.AnimateToX(1, 0).then(function () { _this.pageOffset = 1; });
        }
        if (momentum === undefined)
            momentum = 0;
        return this.AnimateToX(2, momentum).then(function () {
            _this.renderer.page++;
            _this.pageChange.emit(_this.renderer.page);
            _this.pageOffset = 1;
        });
    };
    /**
     * @param {?=} momentum
     * @return {?}
     */
    KBPageSliderComponent.prototype.AnimateToPreviousPage = function (momentum) {
        var _this = this;
        if (this.locked || this.blockInteraction)
            return null;
        if (this.page == 0) {
            return this.AnimateToX(1, 0).then(function () { _this.pageOffset = 1; });
        }
        if (momentum === undefined)
            momentum = 0;
        return this.AnimateToX(0, momentum).then(function () {
            _this.renderer.page--;
            _this.pageChange.emit(_this.renderer.page);
            _this.pageOffset = 1;
        });
    };
    /**
     * @param {?} x
     * @param {?} momentum
     * @return {?}
     */
    KBPageSliderComponent.prototype.AnimateToX = function (x, momentum) {
        var _this = this;
        if (this.locked || this.blockInteraction)
            return null;
        this.blockInteraction = true;
        var /** @type {?} */ w = this.pageWidth;
        return new SlideAnimation(this.innerContainer, // Element to animate
        -this.pageOffset * w, // Current position (px)
        -x * w, // Destination position (px)
        momentum * w, // User scroll momentum (px/s)
        this.transitionDuration // Default duration, when momentum = 0
        ).then(function () {
            _this.blockInteraction = false;
        });
    };
    /**
     * @return {?}
     */
    KBPageSliderComponent.prototype.StartScroll = function () { this.scrollStateChange.emit(true); };
    /**
     * @return {?}
     */
    KBPageSliderComponent.prototype.EndScroll = function () { this.scrollStateChange.emit(false); };
    /**
     * @param {?} x
     * @return {?}
     */
    KBPageSliderComponent.prototype.ClampX = function (x) {
        if (x < 0)
            x = 0;
        if (x > 2)
            x = 2;
        // Allow some overscrolling on the first and last page
        if (this.page == 0 && x < 1) {
            if (this.enableOverscroll)
                x = 1 - this.OverscrollRamp(1 - x);
            else
                x = 1;
        }
        if (this.page == this.renderer.pageCount - 1 && x > 1) {
            if (this.enableOverscroll)
                x = 1 + this.OverscrollRamp(x - 1);
            else
                x = 1;
        }
        return x;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    KBPageSliderComponent.prototype.OverscrollRamp = function (input) {
        return Math.pow(input, 0.5) / 5;
    };
    return KBPageSliderComponent;
}());
KBPageSliderComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'kb-page-slider',
                template: "\n\t\t<!-- Display the actual pages -->\n\t\t<div class=\"inner\" \n\t\t\t\t[style.width]=\"containerWidth\"\n\t\t\t\t[style.height]=\"containerHeight\">\n\t\t\t<ng-content></ng-content>\n\t\t</div>\n\n\t\t<div class=\"buttons\" *ngIf=\"buttons.length > 0\" [style.top]=\"buttonTop\">\n\t\t\t<!-- Display navigation buttons -->\n\t\t\t<ng-content select=\"kb-nav-button[forward]\"></ng-content>\n\t\t\t<ng-content select=\"kb-nav-button[backward]\"></ng-content>\n\t\t</div>\n\n\t\t<!-- Display the page indicator -->\n\t\t<kb-dot-indicator *ngIf=\"showIndicator\"\n\t\t\t\t[page]=\"page\"\n\t\t\t\t[pageCount]=\"pageCount\"\n\t\t\t\t[dotColor]=\"dotColor\"\n\t\t\t\t[style.bottom]=\"dotBottom\">\n\t\t</kb-dot-indicator>\n\t",
                styles: [
                    ":host {\n\t\t\toverflow: hidden;\n\t\t\tdisplay: block;\n\t\t\tposition: relative;\n\t\t}",
                    ".inner {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\twill-change: left;\n\t\t}",
                    "kb-dot-indicator {\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t}",
                    ".buttons {\n\t\t\tposition: absolute;\n\t\t\tz-index: 100;\n\t\t\twidth: 100%;\n\t\t}",
                    ".buttons >>> kb-nav-button {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t}",
                    ".buttons >>> kb-nav-button[backward] {left: 15px;}",
                    ".buttons >>> kb-nav-button[forward] {right: 15px;}",
                ]
            },] },
];
/**
 * @nocollapse
 */
KBPageSliderComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
KBPageSliderComponent.propDecorators = {
    'page': [{ type: _angular_core.Input },],
    'pageChange': [{ type: _angular_core.Output },],
    'pageSizeChange': [{ type: _angular_core.Output },],
    'pageCountChange': [{ type: _angular_core.Output },],
    'showIndicator': [{ type: _angular_core.Input },],
    'overlayIndicator': [{ type: _angular_core.Input },],
    'dotColor': [{ type: _angular_core.Input },],
    'locked': [{ type: _angular_core.Input },],
    'transitionDuration': [{ type: _angular_core.Input },],
    'enableOverscroll': [{ type: _angular_core.Input },],
    'enableSideClicks': [{ type: _angular_core.Input },],
    'enableArrowKeys': [{ type: _angular_core.Input },],
    'scrollStateChange': [{ type: _angular_core.Output },],
    'buttons': [{ type: _angular_core.ContentChildren, args: [KBNavButtonComponent,] },],
    'renderer': [{ type: _angular_core.ContentChild, args: [KBPagesRendererDirective,] },],
};

var KBDotIndicatorComponent = (function () {
    function KBDotIndicatorComponent() {
        this._page = 0;
        this._pageCount = 0;
        this.dotColor = "white";
        this.items = [];
    }
    Object.defineProperty(KBDotIndicatorComponent.prototype, "page", {
        /**
         * @param {?} p
         * @return {?}
         */
        set: function (p) {
            this._page = p;
            this.updateSelected();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KBDotIndicatorComponent.prototype, "pageCount", {
        /**
         * @param {?} p
         * @return {?}
         */
        set: function (p) {
            this._pageCount = p || 0;
            this.updateItems();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    KBDotIndicatorComponent.prototype.updateItems = function () {
        this.items = new Array(this._pageCount);
        for (var /** @type {?} */ i = 0; i < this._pageCount; i++) {
            this.items[i] = { active: i == this._page };
        }
    };
    /**
     * @return {?}
     */
    KBDotIndicatorComponent.prototype.updateSelected = function () {
        if (this.items.length != this._pageCount)
            return this.updateItems();
        if (this.items.length == 0)
            return;
        for (var /** @type {?} */ i = 0; i < this._pageCount; i++)
            this.items[i].active = false;
        this.items[this._page].active = true;
    };
    return KBDotIndicatorComponent;
}());
KBDotIndicatorComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'kb-dot-indicator',
                template: "\n\t\t<div *ngFor=\"let item of items\" class=\"dot\"\n\t\t\t [style.background]=\"dotColor\"\n\t\t\t [class.active]=\"item.active\"></div>\n\t",
                styles: [
                    ":host {\n\t\t\tdisplay: -webkit-box;\n\t\t\tdisplay: -ms-flexbox;\n\t\t\tdisplay: flex;\n\t\t\t-webkit-box-orient: horizontal;\n\t\t\t-webkit-box-direction: normal;\n\t\t\t\t-ms-flex-direction: row;\n\t\t\t\t\tflex-direction: row;\n\t\t\t-webkit-box-pack: center;\n\t\t\t\t-ms-flex-pack: center;\n\t\t\t\t\tjustify-content: center;\n\t\t}",
                    ".dot {\n\t\t\twidth: 6px;\n\t\t\theight: 6px;\n\t\t\tborder-radius: 3px;\n\t\t\tmargin: 0 2px;\n\t\t\topacity: 0.33;\n\n\t\t\ttransition: opacity 90ms linear;\n\t\t\t-webkit-transition: opacity 90ms linear;\n\t\t}",
                    ".dot.active {\n\t\t\topacity: 1.0;\n\t\t}",
                ]
            },] },
];
/**
 * @nocollapse
 */
KBDotIndicatorComponent.ctorParameters = function () { return []; };
KBDotIndicatorComponent.propDecorators = {
    'page': [{ type: _angular_core.Input },],
    'pageCount': [{ type: _angular_core.Input },],
    'dotColor': [{ type: _angular_core.Input },],
};

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
var PageSliderModule = (function () {
    function PageSliderModule() {
    }
    return PageSliderModule;
}());
PageSliderModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_platformBrowser.BrowserModule
                ],
                declarations: [
                    KBPageSliderComponent,
                    KBPagesRendererDirective,
                    KBDotIndicatorComponent,
                    KBNavButtonComponent
                ],
                exports: [
                    KBPageSliderComponent,
                    KBPagesRendererDirective,
                    KBDotIndicatorComponent,
                    KBNavButtonComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
PageSliderModule.ctorParameters = function () { return []; };

/**
 * Generated bundle index. Do not edit.
 */

exports.PageSliderModule = PageSliderModule;
exports.KBPagesRendererDirective = KBPagesRendererDirective;
exports.KBPage = KBPage;
exports.KBPageSliderComponent = KBPageSliderComponent;
exports.KBDotIndicatorComponent = KBDotIndicatorComponent;
exports.KBNavButtonComponent = KBNavButtonComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
