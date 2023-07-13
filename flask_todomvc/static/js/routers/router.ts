import * as Backbone from 'backbone';

declare global {
  interface Window {
    app: any;
  }
}

namespace app {
  export let TodoFilter: string;

  export class TodoRouter extends Backbone.Router {
    routes = {
      '*filter': 'setFilter'
    };

    setFilter(param: string) {
      app.TodoFilter = param || '';
      app.todos.trigger('filter');
    }
  }

  export const TodoRouterInstance = new TodoRouter();
  Backbone.history.start();
}