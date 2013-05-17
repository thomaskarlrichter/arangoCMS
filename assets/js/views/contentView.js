var app = app || {};

$(function () {
	'use strict';

	app.ContentView = Backbone.View.extend({

    template: new EJS({url: 'templates/contentView.ejs'}),
    
    el: "#content",

		events: {
      "click .delete": "deleteDocument",
      "click #addNew": "addDocument",
      "click .edit": "editDocument",
      "click .attrtitle": "sortBy",
      "click #checkAll": "checkAll",
      "click #deleteMarked": "deleteMarked",
      "click #startSearch": "filterBy",
      "keyup #searchField": "filterBy"
		},

		initialize: function () {
      var self = this;
      this.randomNumber = Math.random();
      this.collection.fetch({
        success: function() {
          self.render();
        }
      });
      this.collection.bind("change", self.render.bind(self));
      this.collection.bind("remove", self.render.bind(self));
      this.collection.bind("sort", self.render.bind(self));
      this.tmplTable = new EJS({url: 'templates/contentTableView.ejs'});
      
		},

    deleteMarked: function(e) {
      e.preventDefault();
      var self = this,
        modal = new app.DeleteConfView({callback: function() {
          $(".checkBulk").filter(function() {
            return $(this).prop("checked");
          }).closest("tr").map(function() {
            return $(this).attr("id");
          }).each(function(e, key) {
            self.collection.get(key).destroy();
          });
        }});
      modal.render();
    },

    checkAll: function() {
      var setTo = $("#checkAll").prop("checked");
      $(".checkBulk").prop("checked", setTo);
    },

    sortBy: function(event) {
      var attribute = $(event.currentTarget).text();
      this.collection.comparator = attribute;
      this.collection.sort();
    },
    
    filterBy: function() {
      
      var value = $("#searchField").val(),
        pattern = new RegExp(value,"gi"),
        toRender = this.collection.filter(function(data) {
          var found = false;
          _.each(data.attributes, function (val, key){
            if (key == "_id" || key == "_rev") {
              return;
            }
            if (pattern.test(val)) {
              found = true;
            }
            return;
          });
          return found;
        });
      this.reRenderTable(toRender);
    },
    
    deleteDocument: function(event) {
      var _id = $(event.currentTarget).closest("tr").attr("id"),
        self = this,
        modal = new app.DeleteConfView({callback: function() {
          self.collection.get(_id).destroy();
        }});
      modal.render();
    },

    addDocument: function() {
      var cols = this.collection.getColumns(),
        modal = new app.NewView({collection: this.collection, columns: cols});
      modal.render();
    },
    
    editDocument: function(event) {
      var _id = $(event.currentTarget).closest("tr").attr("id"),
        doc = this.collection.get(_id),
        cols = this.collection.getColumns(),
        modal = new app.EditView({model: doc, columns: cols});
      modal.render();
    },

    reRenderTable: function(filteredModels) {
      $("#contentTable").html(this.tmplTable.render({models: filteredModels, columns: this.collection.getColumns()}));
    },

		render: function () {
      var toRender = this.collection.models;
      $(this.el).off();
      $(this.el).html(this.template.render({models: toRender, columns: this.collection.getColumns()}));
      this.delegateEvents();
			return this;
		}
	});
}());

