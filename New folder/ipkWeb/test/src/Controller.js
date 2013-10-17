var Controller = function (client) {
  this.attachWidget = function (widget) {
    widget.bind(Widget.Events.product_changed, function (args) {
      client.requestPrice(args[0]);
    });
    client.bind(Client.Events.new_price, function (args) {
      widget.updatePrice(args[0]);
    });
  };
};

Controller.factory = function (baseUrl) {
  client = new Client(baseUrl);
  return new Controller(client);
};