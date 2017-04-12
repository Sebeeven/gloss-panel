(function($, Backbone) {

    var glossModel = Backbone.Model.extend({
        url: function() {
            return appConfig.baseURL + 'gloss' + appConfig.addURL;
        },
    });

    var glossCollection = Backbone.Collection.extend({
        model: glossModel,
        url: function() {
            return appConfig.baseURL + 'gloss' + appConfig.addURL;
        },
    });

    

    collection.fetch({
        success: function(collection, response, options) {
            $('body').html(new View({ collection: collection }).render().el);
        },
        error: function(collection, response, options) {
            alert('error!');
        }
    });
})(jQuery, Backbone);
