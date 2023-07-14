/*global Backbone, jQuery, _, ENTER_KEY */
namespace app {
    'use strict';

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    export class AppView extends Backbone.View<Backbone.Model> {

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: string = '#todoapp';

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: _.TemplateExecutor = _.template($('#stats-template').html());

        // Delegated events for creating new items, and clearing completed ones.
        events: Backbone.EventsHash = {
            'keypress #new-todo': 'createOnEnter',
            'click #clear-completed': 'clearCompleted',
            'click #toggle-all': 'toggleAllComplete'
        };

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize(): void {
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$input = this.$('#new-todo');
            this.$footer = this.$('#footer');
            this.$main = this.$('#main');
            this.$list = $('#todo-list');

            this.listenTo(app.todos, 'add', this.addOne);
            this.listenTo(app.todos, 'reset', this.addAll);
            this.listenTo(app.todos, 'change:completed', this.filterOne);
            this.listenTo(app.todos, 'filter', this.filterAll);
            this.listenTo(app.todos, 'all', this.render);
        }

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render(): void {
            const completed: number = app.todos.completed().length;
            const remaining: number = app.todos.remaining().length;

            if (app.todos.length) {
                this.$main.show();
                this.$footer.show();

                this.$footer.html(this.statsTemplate({
                    completed: completed,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#/' + (app.TodoFilter || '') + '"]')
                    .addClass('selected');
            } else {
                this.$main.hide();
                this.$footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        }

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne(todo: Backbone.Model): void {
            const view: app.TodoView = new app.TodoView({ model: todo });
            this.$list.append(view.render().el);
        }

        // Add all items in the **Todos** collection at once.
        addAll(): void {
            this.$list.html('');
            app.todos.each(this.addOne, this);
        }

        filterOne(todo: Backbone.Model): void {
            todo.trigger('visible');
        }

        filterAll(): void {
            app.todos.each(this.filterOne, this);
        }

        // Generate the attributes for a new Todo item.
        newAttributes(): object {
            return {
                title: this.$input.val().trim(),
                order: app.todos.nextOrder(),
                completed: false
            };
        }

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter(e: JQuery.Event): void {
            if (e.which === ENTER_KEY && this.$input.val().trim()) {
                app.todos.create(this.newAttributes());
                this.$input.val('');
            }
        }

        // Clear all completed todo items, destroying their models.
        clearCompleted(): boolean {
            _.invoke(app.todos.completed(), 'destroy');
            return false;
        }

        toggleAllComplete(): void {
            const completed: boolean = this.allCheckbox.checked;

            app.todos.each(function (todo: Backbone.Model) {
                todo.save({
                    'completed': completed
                });
            });
        }
    }
}