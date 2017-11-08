const assert = require('assert');
const app = require('../../src/app');

describe('\'variants\' service', () => {
  it('registered the service', () => {
    const service = app.service('variants');

    assert.ok(service, 'Registered the service');
  });
});
