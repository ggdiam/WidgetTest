
var namespace_widget = function () {
    var self = this;
    self.init = function (options) {
        console.log(options);

        var widgetEl = document.getElementById('namespace-widget-id');
        widgetEl.innerHTML = '<div>this is SPARTA!!!!</div>';
        console.log(widgetEl);
    }
};
namespace_widget = new namespace_widget();