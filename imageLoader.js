;(function() {

    var imgLoader = new Loader(),
        bgImgLoader = new Loader(),
        screenSizes = {};

    function extend(extension, obj) {
        var key;
        for ( key in extension ){
            obj[key] = extension[key];
        }
    }

    function hasClass(elem, cls) {
        return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function addClass(elem, add) {
        var classes = elem.className;
        elem.className = classes + ' ' + add;
    }

    function removeClass(elem, remove) {
        var newClass = '',
            classes = elem.className.split(' '),
            rem = remove.split(' '),
            i, len = classes.length;
        for (i = 0; i < len; i++) {
            if (rem.indexOf(classes[i]) === -1) {
                newClass += classes[i] + ' ';
            }
        }
        elem.className = newClass.replace(/^\s+|\s+$/gm,'');
    }

    function ItemList() {
        this.itemList = [];
    }

    ItemList.prototype.add = function(obj) {
        return this.itemList.push(obj);
    };

    ItemList.prototype.get = function(index) {
        if ( index > -1 && index < this.itemList.length ) {
            return this.itemList[index];
        }
    };

    ItemList.prototype.count = function() {
        return this.itemList.length;
    };

    function Loader() {
        this.items = new ItemList();
    }

    Loader.prototype.addItem = function(item) {
        this.items.add(item);
    };

    Loader.prototype.getWinSpecs = function() {
        var specObj = {};
        specObj.width = window.innerWidth;
        specObj.height = window.innerHeight;
        return specObj;
    }

    Loader.prototype.notify = function() {
        var width = this.getWinSpecs().width,
            i, len = this.items.count();
        for ( i = 0; i < len; i++ ) {
            this.items.get(i).updateAttrs(width);
        }
    };

    function Item(typeOfImage) {
        this.typeOfImage = typeOfImage;
    }

    Item.prototype.updateAttrs = function(width) {
        if ( width >= screenSizes.desktopMinWidth && width <= screenSizes.desktopMaxWidth && !hasClass(this, 'desktop') ) {
            addClass(this, 'desktop');
            removeClass(this, 'tablet mobile');
            this.typeOfImage === 'img' && this.setAttribute('src', this.desktopSrc);
        } else if ( width >= screenSizes.tabletMinWidth && width <= screenSizes.tabletMaxWidth && !hasClass(this, 'tablet') ) {
            addClass(this, 'tablet');
            removeClass(this, 'desktop mobile');
            this.typeOfImage === 'img' && this.setAttribute('src', this.tabletSrc);
        } else if ( width >= screenSizes.mobileMinWidth && width <= screenSizes.mobileMaxWidth && !hasClass(this, 'mobile') ) {
            addClass(this, 'mobile');
            removeClass(this, 'desktop tablet');
            this.typeOfImage === 'img' && this.setAttribute('src', this.mobileSrc);
        } else {
            // leave it alone
        }
    };

    function addImages() {
        var images = document.images,
            i, len = images.length,
            settings = {};
        for (i = 0; i < len; i++) {
            if ( images[i].hasAttribute('data-image-loader') ) {
                extend( new Item('img'), images[i] );
                settings.desktopSrc = images[i].getAttribute('data-desktop-src');
                settings.tabletSrc = images[i].getAttribute('data-tablet-src');
                settings.mobileSrc = images[i].getAttribute('data-mobile-src');
                extend(settings, images[i]);
                imgLoader.addItem( images[i] );
            } else {
                // image does not have required data attribute
            }
        }
    }

    function addBgImages() {
        var bgImages = document.querySelectorAll('section, div'),
            i, len = bgImages.length,
            settings = {};
        for (i = 0; i < len; i++) {
            if ( bgImages[i].hasAttribute('data-image-loader') ) {
                extend( new Item('bgImg'), bgImages[i] );
                extend(settings, bgImages[i]);
                bgImgLoader.addItem( bgImages[i] );
            } else {
                // item does not have required data attribute
            }
        }
    }

    function init(obj) {
        window.addEventListener('load', function() {
            extend(obj, screenSizes);
            addImages();
            addBgImages();
            imgLoader.notify();
            bgImgLoader.notify();
        }, false);
        window.addEventListener('resize', function() {
            imgLoader.notify();
            bgImgLoader.notify();
        }, false);
    }

    init({
        desktopMinWidth: 841,
        desktopMaxWidth: 10000,
        tabletMinWidth: 768,
        tabletMaxWidth: 840,
        mobileMinWidth: 0,
        mobileMaxWidth: 767
    });

}());