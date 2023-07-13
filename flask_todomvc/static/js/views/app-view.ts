/*global Backbone, jQuery, _, ENTER_KEY */
import * as Backbone from 'backbone';
import * as _ from 'underscore';

namespace app {
    export class AppView extends Backbone.View<Backbone.Model> {
        private allCheckbox: HTMLInputElement;
        private $input: JQuery;
        private $footer: JQuery;
        private $main: JQuery;
        private $list: JQuery;

        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            this.el = '#todoapp';
            this.statsTemplate = _.template($('#stats-template').html());

            this.events = {
                'keypress #new-todo': 'createOnEnter',
                'click #clear-completed': 'clearCompleted',
                'click #toggle-all': 'toggleAllComplete'
            };

            this.initialize = () => {
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
            };

            this.render = () => {
                var completed = app.todos.completed().length;
                var remaining = app.todos.remaining().length;

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
            };

            this.addOne = (todo: Backbone.Model) => {
                var view = new app.TodoView({ model: todo });
                this.$list.append(view.render().el);
            };

            this.addAll = () => {
                this.$list.html('');
                app.todos.each(this.addOne, this);
            };

            this.filterOne = (todo: Backbone.Model) => {
                todo.trigger('visible');
            };

            this.filterAll = () => {
                app.todos.each(this.filterOne, this);
            };

            this.newAttributes = () => {
                return {
                    title: this.$input.val().trim(),
                    order: app.todos.nextOrder(),
                    completed: false
                };
            };

            this.createOnEnter = (e: JQuery.Event) => {
                if (e.which === ENTER_KEY && this.$input.val().trim()) {
                    app.todos.create(this.newAttributes());
                    this.$input.val('');
                }
            };

            this.clearCompleted = () => {
                _.invoke(app.todos.completed(), 'destroy');
                return false;
            };

            this.toggleAllComplete = () => {
                var completed = this.allCheckbox.checked;

                app.todos.each(function (todo) {
                    todo.save({
                        'completed': completed
                    });
                });
            };

            this.initialize();
        }
    }
}