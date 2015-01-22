var namespaceWidget = function () {
    var self = this;

    self.minWidth = 150;//мин ширина колонки
    self.maxWidth = 250;//макс ширина колонки
    self.margin = 2 * 10;//отступы между колонками

    //vars
    self.cols = null;
    self.rows = null;
    self.cont = null;
    self.contParent = null;

    self.init = function (options) {
        console.log(options);

        //контейнер
        self.cont = document.getElementById('namespace-widget-cont');
        //console.log(self.cont);
        //парент контейнера
        self.contParent = self.cont.parentNode;

        if (options) {
            if (options.cols) {
                self.cols = options.cols;
            }
            if (options.rows) {
                self.rows = options.rows;
            }
        }

        var widgetEl = document.getElementById('namespace-widget-id');
        widgetEl.innerHTML = '<div>This is SPARTA!!!!</div>';
        //console.log(widgetEl);

        //self.cont.style.width = self.maxWidth * self.cols + self.margin * (self.cols - 1) + 'px';

        self.watch();
        self.setContWidth();
    };

    self.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    //мониторим ресайз окна
    self.watch = function () {
        self.addEvent(window, "resize", function () {
            //self.setContWidth();
            self.setContWidthDebounce();//для производительности
        });
    };
    
    self.setContWidthDebounce = self.debounce(function () {
        self.setContWidth();
    }, 50);

    //какую макс ширину занимают n колонок
    self.getNumColsMaxWidth = function (n) {
        return self.maxWidth * n + self.margin * (n - 1);
    };

    //какую мин ширину занимают n колонок
    self.getNumColsMinWidth = function (n) {
        return self.minWidth * n + self.margin * (n - 1);
    };

    //считает макс ширину колонки исходя из заданной максимальной ширины
    self.getMaxColWidthFromParentWidth = function (parentWidth, n) {
        var res = parentWidth - self.margin * (n - 1);
        res = Math.floor(res / n);
        if (res > self.maxWidth){
            res = self.maxWidth;
        }
        return res;
    };

    //установка ширины контейнера
    self.setContWidth = function () {
        var parentWidth = self.contParent.offsetWidth;
        console.log('parentWidth:', parentWidth);

        var actual = {};//ширина колонки, кол-во колонок
        for (var n = self.cols; n >= 1; n--) {
            var min = self.getNumColsMinWidth(n);
            var max = self.getNumColsMaxWidth(n);

            if (parentWidth >= max || parentWidth >= min) {
                actual.width = self.getMaxColWidthFromParentWidth(parentWidth, n);
                actual.cols = n;
                console.log('set n:', n, ' min cols w:', min, ' max cols w:', max);
                break;
            }

        }

        console.log(actual);
        var contWidth = actual.width * actual.cols + self.margin * (n - 1) + 1;//плюс 1 px
        var maxContWidth = self.getNumColsMaxWidth(self.cols);
        if (contWidth > maxContWidth) {
            contWidth = maxContWidth;
        }
        self.cont.style.width = contWidth + 'px';
        console.log('contWidth:', contWidth, ' maxContWidth:', maxContWidth);

        //задание размера элементам
        var imgs = document.getElementsByClassName('namespace-item-img');
        for(var i=0; i< imgs.length; i++){
            var img = imgs[i];
            img.style.width = actual.width + 'px';
            img.style.height = actual.width + 'px';
        }


        var items = document.getElementsByClassName('namespace-item');

        //сначала проставляем ширину блоков, чтобы текст растянул блоки на высоту
        for(var i=0; i< items.length; i++){
            var item = items[i];
            item.style.width = actual.width + 'px';
            item.style.minHeight = '1px';
        }

        var maxItemHeigth = 0;
        //вычисляем максимальную высоту блоков
        for(var i=0; i< items.length; i++) {
            var item = items[i];
            var itemHeight = item.offsetHeight;
            //console.log('item height:', itemHeight, 'maxItemHeigth:', maxItemHeigth);
            if (itemHeight > maxItemHeigth){
                maxItemHeigth = itemHeight;
            }
        }
        console.log('maxItemHeigth:', maxItemHeigth);

        //проставляем высоту блоков
        for(var i=0; i< items.length; i++){
            var item = items[i];
            item.style.minHeight = maxItemHeigth + 'px';
        }
    };

    //навешиваем листнер по-православному
    self.addEvent = function (elem, type, eventHandle) {
        if (elem == null || typeof(elem) == 'undefined') return;
        if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, eventHandle);
        } else {
            elem["on" + type] = eventHandle;
        }
    };
};
window.namespaceWidget = new namespaceWidget();
