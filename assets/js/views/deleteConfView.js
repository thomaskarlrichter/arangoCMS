var app = app || {};

$(function () {
	'use strict';

	app.DeleteConfView = Backbone.View.extend({

    template: new EJS({url: 'templates/deleteConfView.ejs'}),
    
    el: "body",

		events: {
      "click #delete": "submit",
      "keypress": "editOnEnter",
      "click #cancel": "cancel",
      "hidden": "hidden"
		},

		initialize: function () {
      this.confirmCB = this.options.callback;
      this.wasSubmitted = false;
		},
    
    submit: function(e) {
      if (this.wasSubmitted) {
        return;
      }
      this.wasSubmitted = true;
      e.stopPropagation();
      $('#confirmation_modal').modal('hide');
      this.confirmCB();
    },
    
    cancel: function(e) {
      e.stopPropagation();
      $('#confirmation_modal').modal("hide");
    },
    
    editOnEnter: function(e) {
      if (e.keyCode === 13) {
        this.submit(e);
      }
    },
    
    hidden: function () {
      $('#confirmation_modal').remove();
    },
    
		render: function () {
      console.log("a");
      $(this.el).append(this.template.text);
      console.log("b");
      this.delegateEvents();
      console.log("c");
      $('#confirmation_modal').modal("show");
      console.log("d");
		}
	});
}());
