/*global Backbone */
import { Todo } from './Todo';

namespace app {
  'use strict';

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  export class Todos extends Backbone.Collection<Todo> {
    // Reference to this collection's model.
    model = Todo;

    // Filter down the list of all todo items that are finished.
    completed(): Todo[] {
      return this.filter((todo: Todo) => {
        return todo.get('completed');
      });
    }

    // Filter down the list to only todo items that are still not finished.
    remaining(): Todo[] {
      return this.without.apply(this, this.completed());
    }

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder(): number {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    }

    // Todos are sorted by their original insertion order.
    comparator(todo: Todo): number {
      return todo.get('order');
    }
  }

  // Create our global collection of **Todos**.
  export const todos = new Todos();
}