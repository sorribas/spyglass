var validator = require('is-my-json-valid')

var validate = validator({
  type: 'object',
  properties: {
    name: {
      required: true,
      type: 'string'
    },
    start: {
      required: true,
      type: 'string'
    },
    build: {
      type: 'string'
    }
  }
});

validate.errorsText = function() {
  var errors = this.errors;

  return errors.map(function(err) {
    return err.field.split('.')[1] + ' ' + err.message;
  }).join(', ');
};

module.exports = validate;
