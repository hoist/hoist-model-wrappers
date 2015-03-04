'use strict';
var _ = require('lodash');
var BBPromise = require('bluebird');

function SubscriptionController(subscription) {
  _.forOwn(subscription.toObject(), _.bind(function (n, key) {
    this[key] = n;
  }, this));

  this.set = function (key, value, callback) {
    subscription.meta = subscription.meta ? subscription.meta : {};
    if (typeof subscription.meta[key] === 'object' && typeof value === 'object') {
      subscription.meta[key] = _.merge(subscription.meta[key], value);
    } else {
      subscription.meta[key] = value;
    }
    subscription.markModified('meta');
    return subscription.saveAsync().bind(this).then(function (savedSubscription) {
      this.meta = savedSubscription[0].meta;
      return this;
    }).nodeify(callback);
  };

  this.get = function (key) {
    if (!subscription.meta) {
      return null;
    }
    return subscription.meta[key];
  };

  this.delete = function (key, callback) {
    if (!subscription.meta) {
      return BBPromise.resolve(this).nodeify(callback);
    }
    if (_.isArray(key)) {
      var toDelete = subscription.meta;
      for (var i = 0; i < key.length - 1; i++) {
        if (toDelete[key[i]]) {
          toDelete = toDelete[key[i]];
        } else {
          toDelete = null;
          break;
        }
      }
      if (toDelete !== null) {
        delete toDelete[key[key.length - 1]];
      }
    } else {
      delete subscription.meta[key];
    }
    subscription.markModified('meta');
    return subscription.saveAsync().bind(this).then(function () {
      this.meta = subscription.meta;
      return this;
    }).nodeify(callback);
  };
}

module.exports = SubscriptionController;
