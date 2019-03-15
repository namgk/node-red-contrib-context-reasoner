var logicEval = require("logic-eval");

function ContextReasonerArrayNode(config) {
  if (!config.source){
    throw new Error('context source must be specified!');
  }
  
  this.source = config.source;
  this.sourceType = config.sourceType;
}

ContextReasonerArrayNode.prototype.onInput = function(msg, runtimeContext, out, err) {
  if (!Array.isArray(msg.payload)){
    err('node only accepts an array as the input');
  }

  var context = {};
  switch(this.sourceType){
    case 'msg':
      context = msg[this.source];
      break;
    case 'flow':
      context = runtimeContext.flow.get(this.source);
      break;
    case 'global':
      context = runtimeContext.global.get(this.source);
      break;
    default:
      break;
  }

  if (!context){
    err('context not found');
    return;
  }

  var results = [];

  msg.payload.forEach(m => {
    if (typeof m.expression !== 'string'){
      return;
    }
    var satisfied = logicEval.evaluateWithContext(m.expression, context);
    if (satisfied){
      results.push(m);
    }
  });

  msg.payload = results;

  out(msg);
};

ContextReasonerArrayNode.prototype.setStatusCallback = function(callback) {
  this.onStatus = callback
};

module.exports = ContextReasonerArrayNode