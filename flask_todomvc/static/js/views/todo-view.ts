/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
import * as Backbone from 'backbone';
import * as _ from 'underscore';

namespace app {
    export class TodoView extends Backbone.View<Backbone.Model> {
        tagName: string = 'li';
        template: _.TemplateExecutor;
        $input: JQuery;

        events(): Backbone.EventsHash {
            return {
                'click .toggle': 'toggleCompleted',
                'dblclick label': 'edit',
                'click .destroy': 'clear',
                'keypress .edit': 'updateOnEnter',
                'keydown .edit': 'revertOnEscape',
                'blur .edit': 'close'
            };
        }

        initialize(): void {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
        }

        render(): TodoView {
            if (this.model.changed.id !== undefined) {
                return this;
            }

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();
            this.$input = this.$('.edit');
            return this;
        }

        toggleVisible(): void {
            this.$el.toggleClass('hidden', this.isHidden());
        }

        isHidden(): boolean {
            const isCompleted: boolean = this.model.get('completed');
            return (
                (!isCompleted && app.TodoFilter === 'completed') ||
                (isCompleted && app.TodoFilter === 'active')
            );
        }

        toggleCompleted(): void {
            this.model.toggle();
        }

        edit(): void {
            this.$el.addClass('editing');
            this.$input.focus();
        }

        close(): void {
            const value: string = this.$input.val();
            const trimmedValue: string = value.trim();

            if (!this.$el.hasClass('editing')) {
                return;
            }

            if (trimmedValue) {
                this.model.save({ title: trimmedValue });

                if (value !== trimmedValue) {
                    this.model.trigger('change');
                }
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        }

        updateOnEnter(e: JQuery.Event): void {
            if (e.which === ENTER_KEY) {
                this.close();
            }
        }

        revertOnEscape(e: JQuery.Event): void {
            if (e.which === ESC_KEY) {
                this.$el.removeClass('editing');
            }
        }

        clear(): void {
            this.model.destroy();
        }
    }
}