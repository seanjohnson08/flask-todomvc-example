/*global $ */
/*jshint unused:false */
namespace app {
  export const ENTER_KEY = 13;
  export const ESC_KEY = 27;

  export class AppView {
    constructor() {
      // kick things off by creating the `App`
      new app.AppView();
    }
  }
}

$(function () {
  'use strict';

  // kick things off by creating the `App`
  new app.AppView();
});
