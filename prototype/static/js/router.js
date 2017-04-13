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
            this.collection = new GlossCollection();
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
                window.workspace.layout.removeView('#second-pane');
                window.workspace.layout.setView('#second-pane', pane);
            }, reset:true });
            var GlossListPane = Backbone.Layout.extend({
                template: '#gloss-list-pane',
                serialize: function() {
                    return { gloss: _.chain(this.collection.models) };
                },
                initialize: function() {
                    this.listenTo(this.collection, 'reset', this.render);
                }
            });
            var GlossPane = Backbone.Layout.extend({
                template: '#gloss-pane',
                serialize: function() {
                    return { gloss: this.model };
                },
                initialize: function() {
                    this.listenTo(this.model, 'change', this.render);
                }
            });
            var EditGlossPane = Backbone.Layout.extend({
                template: '#edit-gloss-pane',
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
                }
            });
            var DeleteGlossPane = Backbone.Layout.extend({
                template: '#delete-gloss-pane',
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
                }
            });
        },
    });

    app.router = Workspace;
    // window.workspace = new Workspace();
    // Backbone.history.start();
})(jQuery,Backbone, _, app);
