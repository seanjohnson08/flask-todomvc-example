/*global Backbone */
import Backbone from 'backbone';

namespace app {
    export class Todo extends Backbone.Model {
        defaults = {
            title: '',
            completed: false
        };

        toggle() {
            this.save({
                completed: !this.get('completed')
            });
        }
    }
}