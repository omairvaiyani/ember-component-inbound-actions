import ActionProxy from './action-proxy';
import { on } from "@ember/object/evented";
import Mixin from '@ember/object/mixin';
import { run } from "@ember/runloop";

let scheduleInAfterRender = /^1\.13|^[2-9]/.test(Ember.VERSION);

export default Mixin.create({
  _inbound_actions_setup: on('init', function() {
    this._inbound_actions_maybeScheduleInAfterRender(() => {
      var proxy = ActionProxy.create({ target: this });
      this.set('actionReceiver', proxy);
    });
  }),
  _inbound_actions_maybeScheduleInAfterRender: function(fn) {
    if (scheduleInAfterRender) {
      run.schedule('afterRender', this, fn);
    } else {
      fn();
    }
  },
  onDestroy: on('willDestroyElement', function() {
    this.set('actionReceiver', null);
  })
});
