var Widget = function (input, priceBox) {
  var widget = this;

  $(input).on('change', function () {
    widget.onProductChanged();
  });

  this.updatePrice = function (newPrice) {
    $(priceBox).html(newPrice + '€');
  };

  this.onProductChanged = function () {
    widget.trigger(Widget.Events.product_changed, [$(input).val()]);
  };
};

Widget.Events = {
  product_changed:'product_changed'
};

Widget.factory = function (dom) {
  input = $('input[type=text]', dom);
  priceBox = $('.priceBox', dom);
  return new Widget(input, priceBox);
};

MicroEvent.mixin(Widget);