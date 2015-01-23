var namespaceWidget = function () {
    var self = this;

    self.minWidth = 150;//мин ширина колонки
    self.maxWidth = 250;//макс ширина колонки
    self.margin = 2 * 10;//отступы между колонками
    self.ns = 'namespace';

    //vars
    self.cols = null;
    self.rows = null;
    self.script = null;
    self.options = null;
    self.cont = null;
    self.contParent = null;

    //data stub
    self.data = null;

    //==================================================================
    //============================Init==================================
    //==================================================================
    self.init = function () {
        //получаем параметры запуска
        self.processScriptAndOptions();

        //стили
        self.appendStyles();

        //вставляем наш виджет перед скриптом
        self.appendWidgetElement();

        //парент контейнера
        self.contParent = self.cont.parentNode;

        //опции инициализации
        if (self.options) {
            if (self.options.cols) {
                self.cols = self.options.cols;
                if (self.cols > 4){
                    self.cosl = 4;//max число колонок
                }
            }
            if (self.options.rows) {
                self.rows = self.options.rows;
            }
        }

        if (!self.cols || !self.rows){
            console.error('namespaceWidget: Ошибка инициализации');
            return;
        }

        //получаем данные
        self.getData();

        if (self.data.length > 0){
            //создаем внутренний контейнер
            var innerCont = self.appendElement(self.cont, 'div', self.ns + '-inner-widget-container');
            ///создаем заголовок
            //var widgetCaption = self.appendElement(innerCont, 'div', self.ns + '-widget-caption');
            //widgetCaption.innerHTML = 'Заголовок виджета';

            //нужно элементов
            var count = self.cols * self.rows;
            //смотрим сколько можем создать
            if (count > self.data.length){
                count = self.data.length;
            }
            //создаем
            for(var i=0; i<count; i++){
                self.createItem(innerCont, i);
            }

            //мониторим resize
            self.watch();

            self.cont.style.visibility = 'hidden';
            //задаем ширину контейнера
            self.setContWidth();

            setTimeout(function () {
                self.setContWidth();
                self.cont.style.visibility = '';
            }, 300);

            console.log('namespaceWidget создан,', self.cols, 'колонок и', self.rows, 'столбцов');
        }
    };

    //==================================================================
    //============================Main functions========================
    //==================================================================
    self.getData = function () {
        //ToDo: тут идет получение данных из API
        self.data = [
            //'В канаде сошел с рельсов и загорелся поезд с ядовитыми веществами </br></br>В канаде сошел с рельсов и загорелся поезд с ядовитыми веществами',
            'В канаде сошел с рельсов и загорелся поезд с ядовитыми веществами',
            'Глава горздрава Москвы подал в отставку из-за вида на жительство в Швейцарии',
            '«Известия»: депутаты предлагают призывать в армию раз в год',
            'Житель Самары в ходе уборки в комнате квартиранта обнаружил 8 кг «спайса»',
            'Россия: Украина сделала все, чтобы помешать расследованию катастрофы Boeing',
            '«РГ»: Совфед собирается запретить «спайсы»'
        ];
    }

    self.createItem = function (cont, index) {
        var colClass = 'col-xs-3';
        switch (self.cols){
            case 1: olClass = 'col-xs-12'; break;
            case 2: olClass = 'col-xs-6'; break;
            case 3: olClass = 'col-xs-4'; break;
            case 4: olClass = 'col-xs-3'; break;
        }
        var itemClass = self.ns + '-item';
        itemClass += ' ' + self.ns + '-' + colClass;

        var item = self.appendElement(cont, 'div', itemClass);  //namespace-item namespace-col-xs-3
        var img = self.appendElement(item, 'div', self.ns + '-item-img');   //элемент картинка
        var text = self.appendElement(item, 'div', self.ns + '-item-text'); //текстовый блок
        text.innerHTML = self.data[index];  //текст
    }

    //установка ширины контейнера
    self.setContWidth = function () {
        var parentWidth = self.contParent.offsetWidth - self.margin * 2;
        //console.log('parentWidth:', parentWidth);

        var actual = {};//ширина колонки, кол-во колонок
        for (var n = self.cols; n >= 1; n--) {
            var min = self.getNumColsMinWidth(n);
            var max = self.getNumColsMaxWidth(n);

            if (parentWidth >= max || parentWidth >= min) {
                actual.width = self.getMaxColWidthFromParentWidth(parentWidth, n);
                actual.cols = n;
                //console.log('set n:', n, ' min cols w:', min, ' max cols w:', max);
                break;
            }

        }

        //console.log(actual);
        var contWidth = actual.width * actual.cols + self.margin * (n - 1) + 1;//плюс 1 px
        var maxContWidth = self.getNumColsMaxWidth(self.cols);
        if (contWidth > maxContWidth) {
            contWidth = maxContWidth;
        }
        self.cont.style.width = contWidth + 'px';
        //console.log('contWidth:', contWidth, ' maxContWidth:', maxContWidth);

        var imgs = document.getElementsByClassName(self.ns + '-item-img');
        var items = document.getElementsByClassName(self.ns + '-item');

        var maxItemHeigth = 0;

        //сначала проставляем ширину блоков, чтобы текст растянул блоки на высоту
        for(var i=0; i< items.length; i++){
            var item = items[i];
            item.style.width = actual.width + 'px';
            //item.style.minHeight = '1px';
        }

        //задание размера элементам
        for(var i=0; i< imgs.length; i++){
            var img = imgs[i];
            img.style.height = actual.width + 'px';

            var item = items[i];
            //item.style.minHeight = '1px';


            var itemHeight = item.offsetHeight;

            //var itemHeight = self.getCountedHeigth(item);
            //console.log('item height:', itemHeight, 'maxItemHeigth:', maxItemHeigth);
            //console.log(item.clientHeight, item.offsetHeight, item.scrollHeight);
            //console.log(item.style.marginTop, item.style.marginBottom);

            if (itemHeight > maxItemHeigth){
                maxItemHeigth = itemHeight;
            }

            item.style.minHeight = maxItemHeigth + 'px';
        }
    };

    //==================================================================
    //============================Utility===============================
    //==================================================================
    self.processScriptAndOptions = function () {
        //берем наш скрипт
        self.script = document.currentScript || (function() {
                var scripts = document.getElementsByTagName("script");
                return scripts[scripts.length - 1];
            })();

        //аттрибуты инициалищации
        if(self.script.hasAttribute('data-cols') && self.script.hasAttribute('data-rows')) {
            self.options = {cols:self.script.getAttribute('data-cols'), rows:self.script.getAttribute('data-rows')};
            //console.log(self.options);
        }
    }

    self.appendStyles = function () {
        //css src
        var cssHref = self.script.getAttribute('src');
        cssHref = cssHref.replace('.js', '.css');
        //console.log(cssHref);

        //element
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = cssHref;
        //добавляем в head
        head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }

    self.appendWidgetElement = function () {
        self.cont = document.createElement('div');
        self.cont.className = self.ns + '-widget';
        self.script.parentNode.insertBefore(self.cont, self.script);
        //script.parentNode.insertBefore(widgetElement, script.nextSibling);    //вставляет после себя
    }

    //мониторим ресайз окна
    self.watch = function () {
        self.addEvent(window, "resize", function () {
            //self.setContWidth();
            self.setContWidthDebounce();//для производительности
        });
    };
    
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

    self.getCountedHeigth = function (elm) {
        var elmHeight, elmMargin;
        if (document.all) {// IE
            elmHeight = elm.currentStyle.height;
            elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10) + "px";
        } else {// Mozilla
            elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
            elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom')) + "px";
        }
        console.log('elmHeight:', elmHeight, 'elmMargin:', elmMargin);
        return parseInt((elmHeight + elmMargin).replace('.px', ''), 10);
    }

    //==================================================================
    //============================Common================================
    //==================================================================
    self.appendElement = function (cont, tag, className) {
        var newEl = document.createElement(tag);
        newEl.className = className;
        cont.appendChild(newEl);
        return newEl;
    }

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

    self.setContWidthDebounce = self.debounce(function () {
        self.setContWidth();
    }, 50);

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

    self.init();
};
window.namespaceWidget = new namespaceWidget();
