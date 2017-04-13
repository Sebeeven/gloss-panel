(function($, Backbone, _, app) {
    var Workspace = Backbone.Router.extend({
        routes: {
            '': 'glossPage',
            'gloss': 'glossPage',
            'gloss/add': 'addGlossPage',
            'gloss/:id/edit': 'editGlossPage',
            'gloss/:id/delete': 'deleteGlossPage',
            'gloss/:id': 'glossPage',
        },
        initialize: function() {
            this.collection = new glossCollection();
            this.layout = new Backbone.Layout({
                el: 'body',
                template: '#layout',
                views: {
                    '#first-pane': new GlossListPane({
                        collection: this.collection
                    }),
                },
            });
            this.layout.render();
        },
        glossPage: function(id) {
            this.swithPane('GlossPane')
        }
    });
})(jQuery,Backbone, _, app);
