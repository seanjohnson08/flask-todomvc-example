import $ from 'jquery';

namespace app {
  export const ENTER_KEY = 13;
  export const ESC_KEY = 27;

  $(function () {
    'use strict';

    // kick things off by creating the `App`
    new AppView();
  });

  class AppView {
    constructor() {
      // Your code here
    }
  }
}