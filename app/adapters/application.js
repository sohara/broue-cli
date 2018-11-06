import ActiveModelAdapter from 'active-model-adapter';
import { computed } from '@ember/object';

export default ActiveModelAdapter.extend({
  namespace: 'api/v1',
  coalesceFindRequests: true,
  headers: computed('login.session', function () {
    var session = this.login.get('session');
    if (session !== null) {
      return {
        'auth-token': session.token,
        'auth-email': session.email
      };
    } else { return {}; }
  }),
  shouldReloadAll () {
    return false;
  }
});
