const assert = require('assert');

const ContextReasonerNode = require('../src/ContextReasonerNode');

describe('ContextReasoner Node', function() {
	describe('Edge cases', function(){
		it('msg without expression in payload', function(done) {
			const node = new ContextReasonerNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: {}};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(result){
			  done(1);
			}, (err) => {
				if (err === 'wrong input'){
					done();
				} else {
					done(err);
				}
			});
		})

		it('msg with wrongful expression in payload', function(done) {
			const node = new ContextReasonerNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: {expression: 1}};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(result){
			  done(1);
			}, (err) => {
				if (err === 'wrong input'){
					done();
				} else {
					done(err);
				}
			});
		});
	})


  describe('Filter msg based on context', function() {
    it('should output satisfied msg', function(done) {
			const node = new ContextReasonerNode({
				source: "ctx",
				sourceType:"global"
			});

			const testMsg = {payload: {expression: "a > 1"}};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(result){
			  assert.equal(result, testMsg);
			  done();
			}, done);
		});
		
		it('should not output unsatisfied msg', function(done) {
			this.timeout(5000);
			
			const node = new ContextReasonerNode({
				source: "ctx",
				sourceType:"global"
			});

			const successTimeout = setTimeout(() => {
				done();
			}, 4000)

			const testMsg = {payload: {expression: "a < 1"}};
			node.onInput(testMsg, { global: { get: () => ({ a: 5}) }}, function(result){
				clearTimeout(successTimeout);
			  done(1);
			}, done);
    });
	})
});