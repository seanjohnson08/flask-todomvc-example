/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
import * as Backbone from 'backbone';
import * as _ from 'underscore';

declare const ENTER_KEY: number;
declare const ESC_KEY: number;

namespace app {
  export class TodoView extends Backbone.View<Backbone.Model> {
    tagName = 'li';
    template = _.template($('#item-template').html());

    events = {
      'click .toggle': 'toggleCompleted',
      'dblclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'keydown .edit': 'revertOnEscape',
      'blur .edit': 'close'
    };

    constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
      super(options);
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'visible', this.toggleVisible);
    }

    render() {
      if (this.model.changed.id !== undefined) {
        return;
      }

      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('completed', this.model.get('completed'));
      this.toggleVisible();
      this.$input = this.$('.edit');
      return this;
    }

    toggleVisible() {
      this.$el.toggleClass('hidden', this.isHidden());
    }

    isHidden() {
      const isCompleted = this.model.get('completed');
      return (
        (!isCompleted && app.TodoFilter === 'completed') ||
        (isCompleted && app.TodoFilter === 'active')
      );
    }

    toggleCompleted() {
      this.model.toggle();
    }

    edit() {
      this.$el.addClass('editing');
      this.$input.focus();
    }

    close() {
      const value = this.$input.val();
      const trimmedValue = value.trim();

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

    updateOnEnter(e: JQuery.Event) {
      if (e.which === ENTER_KEY) {
        this.close();
      }
    }

    revertOnEscape(e: JQuery.Event) {
      if (e.which === ESC_KEY) {
        this.$el.removeClass('editing');
      }
    }

    clear() {
      this.model.destroy();
    }
  }
}
