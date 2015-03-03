'use strict';
var expect = require('chai').expect;
var SubscriptionController = require('../../lib/subscription_controller');
var Subscription = require('hoist-model').Subscription;
var sinon = require('sinon');
var BBPromise = require('bluebird');

describe('SubscriptionController', function () {
  describe('constructor', function () {
    var _subscription;
    var _subscriptionController;
    before(function () {
      _subscription = new Subscription({
        _id: 'subscriptionId',
        application: 'testAppId',
        connector: 'connectorKey',
        endpoints: ['/Contacts', '/Invoices'],
        environment: 'test',
      });
      _subscriptionController = new SubscriptionController(_subscription);
    });

    it('sets the suscription attributes', function () {
      expect(_subscriptionController._id).to.eql(_subscription._id);
      expect(_subscriptionController.connector).to.eql(_subscription.connector);
      expect(_subscriptionController.application).to.eql(_subscription.application);
      expect(_subscriptionController.endpoints).to.have.members(_subscription.endpoints);
      expect(_subscriptionController.environment).to.eql(_subscription.environment);
    });
    it('creates a get function on the subscription', function () {
      expect(typeof _subscriptionController.get).to.eql('function');
    });
    it('creates a set function on the subscription', function () {
      expect(typeof _subscriptionController.set).to.eql('function');
    });
    it('creates a delete function on the subscription', function () {
      expect(typeof _subscriptionController.delete).to.eql('function');
    });
  });
  describe('#GET', function () {
    describe('with no meta', function () {
      var _subscription;
      var _subscriptionController;
      var _result;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
        _result = _subscriptionController.get('fakeKey');
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns null', function () {
        expect(_result).to.eql(null);
      });
    });
    describe('with meta', function () {
      var _subscription;
      var _subscriptionController;
      var _result;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
          meta: {
            fakeKey: 'fakeValue'
          }
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
        _result = _subscriptionController.get('fakeKey');
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns value', function () {
        expect(_result).to.eql('fakeValue');
      });
    });
    describe('with invalid key', function () {
      var _subscription;
      var _subscriptionController;
      var _result;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
          meta: {
            fakeKey: 'fakeValue'
          }
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
        _result = _subscriptionController.get('invalidKey');
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns undefined', function () {
        expect(_result).to.eql(undefined);
      });
    });
  });
  describe('#SET', function () {
    describe('with no meta', function () {
      var _subscription;
      var _subscriptionController;
      var _result;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
        return _subscriptionController.set('fakeKey', 'fakeValue').then(function (result) {
          _result = result;
        });
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns the updated _subscriptionController', function () {
        expect(_result.meta).to.eql({
          fakeKey: 'fakeValue'
        });
      });
    });
    describe('with meta', function () {
      var _subscription;
      var _subscriptionController;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
          meta: {
            fakeKey: 'fakeValue'
          }
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      describe('and value not an object', function () {
        it('returns subscription', function () {
          return _subscriptionController.set('newKey', 'newValue').then(function (result) {
            expect(result.meta).to.eql({
              fakeKey: 'fakeValue',
              newKey: 'newValue'
            });
          });
        });
      });
      describe('and value an object', function () {
        it('returns updated subscription', function () {
          return _subscriptionController.set('fakeKey', {
            anotherKey: 'anotherNewValue'
          }).then(function (result) {
            expect(result.meta).to.eql({
              fakeKey: {
                anotherKey: 'anotherNewValue'
              },
              newKey: 'newValue'
            });
          });
        });
      });
      describe('and both meta and value an object', function () {
        it('merges the two objects correctly and returns subscription', function () {
          return _subscriptionController.set('fakeKey', {
            testKey: 'testValue'
          }).then(function (result) {
            expect(result.meta).to.eql({
              fakeKey: {
                anotherKey: 'anotherNewValue',
                testKey: 'testValue'
              },
              newKey: 'newValue'
            });
          });
        });
      });
    });
  });
  describe('#DELETE', function () {
    describe('with no meta', function () {
      var _subscription;
      var _subscriptionController;
      var _result;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
        return _subscriptionController.delete('key').then(function (result) {
          _result = result;
        });
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns the updated _subscriptionController', function () {
        /* jshint -W030 */
        expect(_result.meta).to.not.exist;
        /* jshint +W030 */
      });
    });
    describe('with meta', function () {
      var _subscription;
      var _subscriptionController;
      before(function () {
        _subscription = new Subscription({
          _id: 'subscriptionId',
          application: 'testAppId',
          connector: 'connectorKey',
          endpoints: ['/Contacts', '/Invoices'],
          environment: 'test',
          meta: {
            key: 'value'
          }
        });
        _subscriptionController = new SubscriptionController(_subscription);
        sinon.stub(_subscription, 'saveAsync').returns(BBPromise.resolve([_subscription]));
      });
      after(function () {
        return _subscription.saveAsync.restore();
      });
      it('returns subscription', function () {
        return _subscriptionController.delete('key').then(function (result) {
          expect(result.meta).to.eql({});
        });
      });
    });
  });
});
