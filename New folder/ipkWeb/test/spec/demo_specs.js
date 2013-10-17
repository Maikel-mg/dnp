describe("La app de obtención de precios tiene", function () {
  var product = 'cocotero';
  var dom = '<div>' +
      '<input type="text" value="' + product + '"/>' +
      '<span class="priceBox">0€</span>' +
      '</div>';
  var newPrice = 30;
  var baseUrl = 'http://foo.bar/price/';

  var input, priceBox, widget, client, controller;

  function widgetFactory(dom) {
    input = $('input[type=text]', dom);
    priceBox = $('.priceBox', dom);
    return new Widget(input, priceBox);
  }

  function controllerFactory(baseUrl) {
    client = new Client(baseUrl);
    return new Controller(client);
  }

  beforeEach(function () {
    widget = widgetFactory(dom);
    controller = controllerFactory(baseUrl);
    controller.attachWidget(widget);
  });

  describe("widgets que interactúan con el DOM", function () {
    it("que notifican cambios de un input[type=text]", function () {
      spyOnMicroEvent(widget, Widget.Events.product_changed);
      input.change();
      expect(widget).toHaveTriggered(Widget.Events.product_changed);
    });
    it("pasan su contenido junto con el evento", function () {
      var spy = spyOnMicroEvent(widget, Widget.Events.product_changed);
      input.change();
      var product = spy.receivedArgs[0];
      expect(product).toBe(product);
    });
    it("y actualizan el precio del producto introducido", function () {
      widget.updatePrice(newPrice);
      var price = priceBox.html();
      expect(price).toContain(newPrice);
    });
  });

  describe("un cliente AJAX que hace peticiones al servidor", function () {
    beforeEach(function () {
      spyOn($, 'getJSON').andCallFake(function (url, callback) {
        callback({price:newPrice});
      });
    });

    it("que colabora con jQuery para hacer las peticiones", function () {
      var url = baseUrl + product;
      client.requestPrice(product);
      expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
    });
    it("notifica la recepción de un nuevo precio", function () {
      spyOnMicroEvent(client, Client.Events.new_price);
      client.requestPrice(product);
      expect(client).toHaveTriggered(Client.Events.new_price);
    });
    it("y lo pasa junto con el evento", function () {
      var spy = spyOnMicroEvent(client, Client.Events.new_price);
      client.requestPrice(product);
      var price = spy.receivedArgs[0];
      expect(price).toBe(newPrice);
    });
  });

  describe("un controlador que dirige la interacción", function () {
    it("suscribe al cliente al evento de cambio de producto", function () {
      spyOn(client, 'requestPrice');
      widget.onProductChanged();
      expect(client.requestPrice).toHaveBeenCalledWith(product);
    });
    it("y suscribe al widget al evento de recepción de precio", function () {
      spyOn(widget, 'updatePrice');
      client.onNewPrice(newPrice);
      expect(widget.updatePrice).toHaveBeenCalledWith(newPrice);
    });
  });
});


