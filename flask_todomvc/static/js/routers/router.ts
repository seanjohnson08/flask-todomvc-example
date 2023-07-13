import * as Backbone from 'backbone';

declare global {
  interface Window {
    app: any;
  }
}

window.app = window.app || {};

(function () {
  'use strict';

  // Todo Router
  // ----------
  class TodoRouter extends Backbone.Router {
    routes = {
      '*filter': 'setFilter'
    };

    setFilter(param: string) {
      // Set the current filter to be used
      window.app.TodoFilter = param || '';

      // Trigger a collection filter event, causing hiding/unhiding
      // of Todo view items
      window.app.todos.trigger('filter');
    }
  }

  window.app.TodoRouter = new TodoRouter();
  Backbone.history.start();
})();