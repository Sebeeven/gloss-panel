(function($, Backbone, _, app) {

    app.GlossModel = Backbone.Model.extend({
        url: function() {
            if(_.isUndefined(this.id)) {
                return app.baseURL + 'gloss' + app.addURL;
            }else{
                return app.baseURL + 'gloss/' + encodeURIComponent(this.id) + app.addURL;
            }
        },
    });

    app.GlossCollection = Backbone.Collection.extend({
        model: app.GlossModel,
        url: function() {
            return app.baseURL + 'gloss' + app.addURL;
        },
    });


    // collection.fetch({
    //     success: function(collection, response, options) {
    //         $('body').html(new View({ collection: collection }).render().el);
    //     },
    //     error: function(collection, response, options) {
    //         alert('error!');
    //     }
    // });
})(jQuery, Backbone, _, app);
