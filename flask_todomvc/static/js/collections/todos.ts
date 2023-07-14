/*global Backbone */
namespace app {
    export class Todo extends Backbone.Model {
        defaults() {
            return {
                title: '',
                completed: false
            };
        }
    }

    export class Todos extends Backbone.Collection<Todo> {
        constructor(models?: Todo[], options?: any) {
            super(models, options);
        }

        model = Todo;

        completed() {
            return this.filter((todo) => {
                return todo.get('completed');
            });
        }

        remaining() {
            return this.without(...this.completed());
        }

        nextOrder() {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        }

        comparator(todo: Todo) {
            return todo.get('order');
        }
    }

    export const todos = new Todos();
}