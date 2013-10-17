(function ($) {
    var o = $({});
    $.subscribe = function () {
        o.on.apply(o, arguments);
    };
    $.unsubscribe = function () {
        o.off.apply(o, arguments);
    };
    $.publish = function () {
        o.trigger.apply(o, arguments);
    };
} (jQuery));

(function ($) {
    var pubSub = function(){
        this.eventos = [];
    };
    pubSub.prototype.suscribir = function(evento , sender,  funcion  ){

        var i = this.eventos.length;
        var existe = false;
        for( i = this.eventos.length - 1; i >= 0; i--)
        {
            if( this.eventos[i].evento == evento && this.eventos[i].sender === sender)
                existe = true;
        }

        if(!existe)
        {
            console.log("Evento insertado - " + evento + " *** Sender -" +  sender);

            this.eventos.push({
                evento  : evento,
                sender   : sender,
                funcion : funcion
            });
        }

    };
    pubSub.prototype.publicar = function(evento, sender, datos){
        var i = this.eventos.length - 1;
        for( i = this.eventos.length - 1; i >= 0; i--)
        {
            if(this.eventos[i].evento == evento  && this.eventos[i].sender === sender)
            {
                console.log( this.eventos[i].evento + " *** Sender -" +  sender);
                this.eventos[i].funcion.apply(null, [this.eventos[i].sender, datos]);
            }
        }
    };

    var ps = new pubSub();

    $.escuchar= function (evento, sender, funcion) {
        ps.suscribir(evento, sender, funcion);
    };
    $.publicar = function (evento, sender, datos) {
        ps.publicar(evento, sender , datos);
    };


} (jQuery));

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

function inputToJson(container){
	var obj = {};	

	$.each($( container + ' input[type != button],' + container + ' select,' + container + ' textarea'), function(){
			if(this.type == 'checkbox')
				obj[this.name] = $(this).attr('checked') == 'checked' ? "SI" : "NO";
			else
            {
                if($(this).val() !== '')
                {
                    obj[this.name] = $(this).val();
                }
            }
	});

	return obj;
	//return JSON.stringify(obj);
};

function esconderNavSP(){
    $('#s4-leftpanel').hide();
    $('#MSO_ContentTable').css('margin-left', '25px');
}