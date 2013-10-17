var Client = function (baseUrl) {
  var client = this;

  this.requestPrice = function (product) {
    var url = baseUrl + product;
    $.getJSON(url, function (json) {
      client.onNewPrice(json.price);
    });
  };

  this.onNewPrice = function (price) {
    client.trigger(Client.Events.new_price, [price]);
  };
};

Client.Events = {
  new_price:'new_price'
};

MicroEvent.mixin(Client);