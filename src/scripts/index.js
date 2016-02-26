'use strict';

const $ = window.jQuery = window.$ = require('jquery');
require('bootstrap');

const Vue = require('vue');
const Encoding = require('encoding-japanese');
const Clipboard = require('clipboard');
const clipboard = new Clipboard('.copy');

let vm = new Vue({
  el: '.main',
  data: {
    before: '',
    after: '',
    toHankakuCase: true,
    toHankanaCase: true,
    toHankakuSpace: true
  },
  watch: {
    before: function(){
      this.converter();
    },
    toHankakuCase: function(){
      this.converter();
    },
    toHankanaCase: function(){
      this.converter();
    },
    toHankakuSpace: function(){
      this.converter();
    }
  },
  methods: {
    converter: function(){
      let newVal = this.before;
      if (this.toHankakuCase) newVal = Encoding.toHankakuCase(newVal);
      if (this.toHankanaCase) newVal = Encoding.toHankanaCase(newVal);
      if (this.toHankakuSpace) newVal = Encoding.toHankakuSpace(newVal);
      this.after = newVal;
    },
    showTooltip: function(elem, msg){
      $(elem).tooltip({
        title: msg,
        placement: 'right'
      });
      $(elem).tooltip('show');
    },
    destroyTooltip: function(e){
      $(e.fromElement).tooltip('destroy');
    }
  }
});

clipboard.on('success', (e) => {
  vm.showTooltip(e.trigger, 'Coppied!');
});


module.exports = vm;
