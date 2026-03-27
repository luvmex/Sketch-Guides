// 
// Sketch Guides
// Add Guides to edges and midpoints at once.
// https://github.com/luvmex/Sketch-Guides
// Build by Celyn Xie.
// 


var SG = {
	extend: function(options, target) {
	    var target = target || this;
	    for (var key in options) {
	        target[key] = options[key];
	    }
	    return target;
	}
};

SG.extend({
    init: function(context, command) {
        this.context = context;
        this.doc = context.document;
        this.data = {};
        this.docData = this.doc.documentData();
        this.page = this.doc.currentPage();
        this.artboard = this.page.currentArtboard();
        this.current = this.artboard || this.page;

        this.extend(context);
        this.pluginRoot = this.scriptPath
            .stringByDeletingLastPathComponent()
            .stringByDeletingLastPathComponent()
            .stringByDeletingLastPathComponent();
        this.pluginSketch = this.pluginRoot + "/Contents/Sketch/Library";
        this.pluginResources = this.pluginRoot + "/Contents/Resources";
        coscript.setShouldKeepAround(true);


        if (command && command == "controlbar") {
            this.ControlBar();
            return false;
        }

        if (command) {
            switch (command) {
                case "top-guide":
                    this.topGuide();
                    break;
                case "right-guide":
                    this.rightGuide();
                    break;
                case "bottom-guide":
                    this.bottomGuide();
                    break;
                case "left-guide":
                    this.leftGuide();
                    break;
                case "v-center-guide":
                    this.vCenterGuide();
                    break;
                case "h-center-guide":
                    this.hCenterGuide();
                    break;
                case "top-bottom-guides":
                    this.topBottomGuides();
                    break;
                case "right-left-guides":
                    this.rightLeftGuides();
                    break;
                case "triple-guides":
                    this.tripleGuides();
                    break;
                case "remove-all-guides":
                    this.removeAllGuides();
                    break;
            }
        }
    }
});


SG.extend({
    getRect: function(layer) {
        var rect = function() {
            if (layer.isKindOfClass(NSClassFromString("MSPage")) || layer.isKindOfClass(NSClassFromString("MSArtboardGroup"))) {
                return layer.frame().rect();  
            }
            let parent = layer.parentObject();
            let relativeRect = layer.frame().rect();
            return parent.convertRect_toCoordinateSpace_(relativeRect, nil);
        }();
        return {
            x: Math.round(rect.origin.x),
            y: Math.round(rect.origin.y),
            width: Math.round(rect.size.width),
            height: Math.round(rect.size.height),
            maxX: Math.round(rect.origin.x + rect.size.width),
            maxY: Math.round(rect.origin.y + rect.size.height),
        };
    },
    getBase: function(layer) {
        var base = layer.rulerBase();
        return {
            x: Math.round(base.x.integerValue()),
            y: Math.round(base.y.integerValue()),
        }
    }
});


SG.extend({
    getDistance: function(targetRect, containerRect) {
        var containerRect = containerRect || this.getRect(this.current);
        return {
            top: (targetRect.y - containerRect.y),
            right: ((targetRect.x - containerRect.x) + targetRect.width),
            bottom: ((targetRect.y - containerRect.y) + targetRect.height),
            left: (targetRect.x - containerRect.x),
            vCenter: ((targetRect.x - containerRect.x) + (targetRect.width / 2)),
            hCenter: ((targetRect.y - containerRect.y) + (targetRect.height / 2)),
        };
    }
});


SG.extend({
    updateContext: function() {
        this.context.document = NSDocumentController.sharedDocumentController().currentDocument();
        // this.context.selection = this.context.document.selectedLayers().layers();
        this.context.selection = this.context.document.selectedLayers();
        return this.context;
    },
});


SG.extend({
    selectError: function() {
        var self = this,
            selection = this.selection;

        if (selection.count() <= 0) {
            this.message("You need to select at least one layer, group or artboard")
            return false;
        }
        if (selection.count() == 2) {
            this.message("You can't select mutiple element.")
            return false;
        }

        return true;
    },
    message: function(message) {
        this.doc.showMessage(message);
    }
});


SG.extend({
    checkBaseline: function() {
        var self = this,
            artboard = this.artboard,
            verticalBase = artboard.verticalRulerData(),
            horizontalBase = artboard.horizontalRulerData();

        if (verticalBase.base() || horizontalBase.base() !== 0) {
            verticalBase.base = 0;
            horizontalBase.base = 0;
        }
    },
    setInArtboard: function(gain) {
        var self = this,
            selection = this.selection,
            layer = selection.firstObject();
        var targetRect = this.getRect(layer),
            containerRect = this.getRect(this.artboard),
            layerBaseCount = this.getDistance(targetRect, containerRect);
        return layerBaseCount;
    },
    setNoArtboard: function(buff) {
        var self = this,
            selection = this.selection,
            page = this.page,
            layer = selection.firstObject();
        var targetRect = this.getRect(layer),
            containerRect = this.getBase(page),
            goSetup = this.getDistance(targetRect, containerRect);
        return goSetup;
    }
});


SG.extend({
    topGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.verticalRulerData().addGuideWithGuide(this.setNoArtboard().top);
        } else {
            this.checkBaseline();
            this.artboard.verticalRulerData().addGuideWithGuide(this.setInArtboard().top);
        }
    },
    rightGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().right);
        } else {
            this.checkBaseline();
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().right);
        }
    },
    bottomGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.verticalRulerData().addGuideWithGuide(this.setNoArtboard().bottom);
        } else {
            this.checkBaseline();
            this.artboard.verticalRulerData().addGuideWithGuide(this.setInArtboard().bottom);
        }
    },
    leftGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().left);
        } else {
            this.checkBaseline();
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().left);
        }
    },
    vCenterGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().vCenter);
        } else {
            this.checkBaseline();
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().vCenter);
        }
    },
    hCenterGuide: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.verticalRulerData().addGuideWithGuide(this.setNoArtboard().hCenter);
        } else {
            this.checkBaseline();
            this.artboard.verticalRulerData().addGuideWithGuide(this.setInArtboard().hCenter);
        }
    },
    topBottomGuides: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.verticalRulerData().addGuideWithGuide(this.setNoArtboard().top);
            this.page.verticalRulerData().addGuideWithGuide(this.setNoArtboard().bottom);
        } else {
            this.checkBaseline();
            this.artboard.verticalRulerData().addGuideWithGuide(this.setInArtboard().top);
            this.artboard.verticalRulerData().addGuideWithGuide(this.setInArtboard().bottom);
        }
    },
    rightLeftGuides: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().right);
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().left);
        } else {
            this.checkBaseline();
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().right);
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().left);
        }
    },
    tripleGuides: function() {
        var self = this,
            inArtboard = false;
        if (!this.selectError()) return;
        if (inArtboard || !this.artboard) {
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().right);
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().vCenter);
            this.page.horizontalRulerData().addGuideWithGuide(this.setNoArtboard().left);
        } else {
            this.checkBaseline();
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().right);
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().vCenter);
            this.artboard.horizontalRulerData().addGuideWithGuide(this.setInArtboard().left);
        }
    },
    removeAllGuides: function() {
        var self = this,
            inArtboard = false;
        if (inArtboard || !this.artboard) {
            horizontalGuideCount = this.page.horizontalRulerData().numberOfGuides();
            verticalGuideCount = this.page.verticalRulerData().numberOfGuides();
            while (verticalGuideCount > 0) {
                this.page.verticalRulerData().removeGuideAt(0);
                verticalGuideCount = this.page.verticalRulerData().numberOfGuides();
            }
            while (horizontalGuideCount > 0) {
                this.page.horizontalRulerData().removeGuideAt(0);
                horizontalGuideCount = this.page.horizontalRulerData().numberOfGuides();
            }
        } else {
            horizontalGuideCount = this.artboard.horizontalRulerData().numberOfGuides();
            verticalGuideCount = this.artboard.verticalRulerData().numberOfGuides();
            while (verticalGuideCount > 0) {
                this.artboard.verticalRulerData().removeGuideAt(0);
                verticalGuideCount = this.artboard.verticalRulerData().numberOfGuides();
            }
            while (horizontalGuideCount > 0) {
                this.artboard.horizontalRulerData().removeGuideAt(0);
                horizontalGuideCount = this.artboard.horizontalRulerData().numberOfGuides();
            }
        }
    }
});


SG.extend({
    ControlBar: function() {
        var self = this,
            identifier = "com.celynxie.sketchguides",
            threadDictionary = NSThread.mainThread().threadDictionary(),
            ControlBar = threadDictionary[identifier];

        if (!ControlBar) {
            ControlBar = NSPanel.alloc().init();
            ControlBar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
            ControlBar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.99, 0.99, 0.99, 1));
            ControlBar.setTitleVisibility(NSWindowTitleHidden);
            ControlBar.setTitlebarAppearsTransparent(true);
            ControlBar.setFrame_display(NSMakeRect(0, 0, 720, 50), false);
            ControlBar.setMovableByWindowBackground(true);
            ControlBar.setHasShadow(true);
            ControlBar.setLevel(NSFloatingWindowLevel);

            var contentView = ControlBar.contentView(),
                getImage = function(size, name){
                    var isRetinaDisplay = (NSScreen.mainScreen().backingScaleFactor() > 1)? true: false;
                        suffix = (isRetinaDisplay)? "@2x": "",
                        imageURL = NSURL.fileURLWithPath(self.pluginResources + "/icons/" + name + suffix + ".png"),
                        image = NSImage.alloc().initWithContentsOfURL(imageURL);
                    return image
                },
                addButton = function(rect, name, callAction){
                    var button = NSButton.alloc().initWithFrame(rect),
                        image = getImage(rect.size, name);

                    button.setImage(image);
                    button.setBordered(false);
                    button.sizeToFit();
                    button.setButtonType(NSMomentaryChangeButton);
                    button.setCOSJSTargetFunction(callAction);
                    button.setAction("callAction:");
                    return button;
                },
                addImage = function(rect, name){
                    var view = NSImageView.alloc().initWithFrame(rect),
                        image = getImage(rect.size, name);
                    view.setImage(image);
                    return view;
                },

                closeButton = addButton( NSMakeRect(20, 10, 30, 30), "close-control",
                    function(sender){
                        coscript.setShouldKeepAround(false);
                        threadDictionary.removeObjectForKey(identifier);
                        ControlBar.close();
                }),
                topGuideB = addButton( NSMakeRect(100, 10, 30, 30), "top-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "top-guide");
                }),
                bottomGuideB = addButton( NSMakeRect(150, 10,30,30), "bottom-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "bottom-guide");
                }),
                leftGuideB = addButton( NSMakeRect(200, 10,30,30), "left-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "left-guide");
                }),
                rightGuideB = addButton( NSMakeRect(250, 10,30,30), "right-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "right-guide");
                }),
                vCenterGuideB = addButton( NSMakeRect(330, 10,30,30), "v-center-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "v-center-guide");
                }),
                hCenterGuideB = addButton( NSMakeRect(380, 10,30,30), "h-center-guide",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "h-center-guide");
                }),
                topBottomGuides = addButton( NSMakeRect(460,10,30,30),"top-bottom-guides",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "top-bottom-guides");
                }),
                rightLeftGuides = addButton ( NSMakeRect(510, 10, 30,30), "right-left-guides",
                    function(sneder){
                        self.updateContext();
                        self.init(self.context, "right-left-guides");
                }),
                tripleGuides = addButton ( NSMakeRect(590, 10, 30,30), "triple-guides",
                    function(sneder){
                        self.updateContext();
                        self.init(self.context, "triple-guides");
                }),
                removeAllGuidesB = addButton( NSMakeRect(670, 10,30,30), "remove-all-guides",
                    function(sender){
                        self.updateContext();
                        self.init(self.context, "remove-all-guides");
                }),
                separate1 = addImage( NSMakeRect(70, 10, 10, 30), "separate"),
                separate2 = addImage( NSMakeRect(300, 10, 10, 30), "separate"),
                separate3 = addImage( NSMakeRect(430, 10, 10, 30), "separate"),
                separate4 = addImage( NSMakeRect(560, 10, 10, 30), "separate");
                separate5 = addImage( NSMakeRect(640, 10, 10, 30), "separate");

            contentView.addSubview(closeButton);
            contentView.addSubview(separate1);
            contentView.addSubview(topGuideB);
            contentView.addSubview(bottomGuideB);
            contentView.addSubview(leftGuideB);
            contentView.addSubview(rightGuideB);
            contentView.addSubview(separate2);
            contentView.addSubview(vCenterGuideB);
            contentView.addSubview(hCenterGuideB);
            contentView.addSubview(separate3);
            contentView.addSubview(topBottomGuides);
            contentView.addSubview(rightLeftGuides);
            contentView.addSubview(separate4);
            contentView.addSubview(tripleGuides);
            contentView.addSubview(separate5);
            contentView.addSubview(removeAllGuidesB);
            threadDictionary[identifier] = ControlBar;
            ControlBar.center();
            ControlBar.makeKeyAndOrderFront(nil);
        }
    }
});