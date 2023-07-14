/*global Backbone */
namespace app {
    export let TodoFilter: string = '';

    export class TodoRouter extends Backbone.Router {
        routes = {
            '*filter': 'setFilter'
        };

        setFilter(param: string): void {
            // Set the current filter to be used
            app.TodoFilter = param || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of Todo view items
            app.todos.trigger('filter');
        }
    }

    export let TodoRouterInstance = new TodoRouter();
    Backbone.history.start();
}