# WidgetTest

[Тестовое задание.](https://github.com/ggdiam/WidgetTest/blob/master/spec/README.md)

Собранный и минифицированный виджет в папке build.

## Устанавливать на сайт так:
```
<script type="text/javascript" data-cols="3" data-rows="2" src="http://yoursiteadress.com/widget.js"></script>
```

```data-cols="3"``` - задаем кол-во колонок<br/>
```data-rows="2"``` - кол-во строк

## Пример виджета встроенного в адаптивную верстку:
http://ggdiam-test-site.azurewebsites.net/

Для примера выложил собранный виджет в azure.
Можно сразу проверить на своем сайте, вставив код:
```
<script type="text/javascript" data-cols="3" data-rows="2" src="http://ggdiam-widget-test.azurewebsites.net/widget.js"></script>
```

## Как собрать проект:

Устанавливаем node.js (используется npm)

Устанавливаем gulp: ```npm install -g gulp```

Устанавливаем зависимости проекта: ```npm install``` (из корня проекта)

Собрать: ```gulp```

Запустить в dev режиме: ```NODE_ENV=DEV gulp```
