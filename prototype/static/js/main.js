(function($) {
    var appConfig = {
        // database: 'mongodb://sebeeven:blogblog@ds060649.mlab.com:60649/blog-app',
        baseURL: 'https://api.mlab.com/api/1/databases/blog-app/collections/',
        addURL: '?apiKey=GenQuPLiVRTAa6FPh6Tx82DBikE_h7id'
    }

    // models
    var GlossModel = Backbone.Model.extend({
        url: function() {
            if(_.isUndefined(this.id)) {
                return appConfig.baseURL + 'gloss' + appConfig.addURL;
            }else{
                return appConfig.baseURL + 'gloss/' + encodeURIComponent(this.id) + appConfig.addURL;
            }
        },
    });

    // collections
    var GlossCollection = Backbone.Collection.extend({
        model: GlossModel,
        url: function() {
            return appConfig.baseURL + 'gloss' + appConfig.addURL;
        },
    });

    // views
    var BaseLayout = Backbone.View.extend({
        el: 'body',
        template: _.template($('#layout').html()),
        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

    var GlossListPane = Backbone.View.extend({
        template: _.template($('#gloss-list-pane').html()),
        serialize: function() {
            return { gloss: _.chain(this.collection.models) };
        },
        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
        },
        render: function() {
            $(this.el).html(this.template);
            return this;
        }
    });

    var GlossPane = Backbone.View.extend({
        template: _.template($('#gloss-pane').html()),
        serialize: function() {
            return { gloss: this.model };
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            $(this.el).html(this.template);
            return this;
        }
    });

    var EditGlossPane = Backbone.View.extend({
        template: _.template($('#edit-gloss-pane').html()),
        serialize: function() {
            return {
                gloss: _.isEmpty(this.model) ? new GlossModel() : this.model
            };
        },
        events: {
            "click .submit": "save"
        },
        save: function() {
            var data = {
                referenceNumber: this.$el.find('.referenceNumber').val(),
                date: this.$el.find('.date').val(),
                status: this.$el.find('.status').val(),
            };
            var success = function(model, response, options) {
                window.workspace.navigate('#gloss/' + model.id, {
                    trigger: true
                });
            };
            if(_.isEmpty(this.model)) {
                this.collection.create(data, { success: success });
            }else{
                this.model.save(data, { success: success });
            }
        },
        render: function() {
            $(this.el).html(this.template);
            return this;
        }
    });

    var DeleteGlossPane = Backbone.View.extend({
        template: _.template($('#delete-gloss-pane').html()),
        serialize: function() {
            return { gloss: this.model };
        },
        events: {
            "click .submit": "delete"
        },
        delete: function() {
            this.model.destroy({
                success: function(model, response) {
                    window.workspace.navigate('#gloss', {
                        trigger: true
                    });
                }
            });
        },
        render: function() {
            $(this.el).html(this.template);
            return this;
        }
    });

    // router
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
            this.collection = new GlossCollection();
            this.layout = new BaseLayout({collection: this.collection})
            // this.layout = new Backbone.View({
            //     el: 'body',
            //     template: '#layout',
            //     views: {
            //         '#first-pane': new GlossListPane({
            //             collection: this.collection
            //         }),
            //     },
            // });
            this.layout.render();

        },
        glossPage: function(id) {
            this.switchPane('GlossPane', id);
        },
        addGlossPage: function() {
            this.switchPane('EditGlossPane', null);
        },
        editGlossPage: function(id) {
            this.switchPane('EditGlossPane', id);
        },
        deleteGlossPage: function(id) {
            this.switchPane('DeleteGlossPane', id);
        },
        switchPane: function(pane_name, id) {
            var panes = {
                GlossPane: GlossPane,
                EditGlossPane: EditGlossPane,
                DeleteGlossPane: DeleteGlossPane
            };
            this.collection.fetch({ success: function(collection) {
                var model = _.isUndefined(id) ? collection.at(0) : collection.get(id);
                pane = new panes[pane_name] ({
                    model: model,
                    collection: collection
                });
                pane.render();
                window.workspace.layout.remove('#second-pane');
                window.workspace.layout.render('#second-pane', pane);
            }, reset:true });
        }
    });

    window.workspace = new Workspace();
    Backbone.history.start();
})(jQuery);
