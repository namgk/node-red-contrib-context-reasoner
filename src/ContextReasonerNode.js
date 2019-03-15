var logicEval = require("logic-eval");

function ContextReasonerNode(config) {
  if (!config.source){
    throw new Error('context source must be specified!');
  }
  
  this.source = config.source;
  this.sourceType = config.sourceType;
}

ContextReasonerNode.prototype.onInput = function(msg, runtimeContext, out, err) {
  if (!msg.payload || !msg.payload.expression || typeof msg.payload.expression !== 'string'){
    err('wrong input');
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

  var result = logicEval.evaluateWithContext(msg.payload.expression, context);
  console.log(result)
  if (result){
    out(msg);
  }
};

ContextReasonerNode.prototype.onClose = function() {
};

ContextReasonerNode.prototype.setStatusCallback = function(callback) {
  this.onStatus = callback
};

module.exports = ContextReasonerNode