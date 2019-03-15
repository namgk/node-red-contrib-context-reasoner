const assert = require('assert');

const ContextReasonerArrayNode = require('../src/ContextReasonerArrayNode');

describe('ContextReasoner Array Node', function() {
	describe('Edge cases', function(){
		it('msg without expression in payload', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(results){
				assert.equal(results.payload.length, 0);
				done();
			}, done);
		})

		it('msg with wrongful expression in payload', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{expression: 1}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(results){
				assert.equal(results.payload.length, 0);
				done();
			}, done);
		});
	})


  describe('Filter msg based on context', function() {
    it('should output satisfied msg', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{expression: "a > 1"}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(results){
			  assert.equal(results, testMsg);
			  done();
			}, done);
		});

		it('should output satisfied msgs', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{expression: "a > 1"}, {expression: "a <= 5"}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(results){
			  assert.equal(results.payload.length, 2);
			  done();
			}, done);
		});

		it('should filter satisfied msgs', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{expression: "a > 1"}, {expression: "a <= 5"}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 6}) }}, function(results){
			  assert.equal(results.payload.length, 1);
			  done();
			}, done);
		});

		it('should filter satisfied msgs complex', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {
				payload: [
					{expression: "(hour > 17 && temperature > 28) || deviceId == 1"}, 
					{expression: "deviceId >=1 && deviceId <=10"}, 
					{expression: "rain == true && hour > 10 &&hour < 18longitude > 43.232323 && longitude < 43.232340 &&latitude > -123.2323232 &&latitude < -123.2323200"}
				]};
			node.onInput(testMsg, { global: { get: () => ({ deviceId: 1, hour: 18, minute: 2}) }}, function(results){
			  assert.equal(results.payload.length, 2);
			  done();
			}, done);
		});
		
		it('should not output unsatisfied msg', function(done) {
			const node = new ContextReasonerArrayNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: [{expression: "a < 1", kiostkId: "1"}]};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(results){
				assert.equal(results.payload.length, 0);
				done();
			}, done);
    });
	})
});