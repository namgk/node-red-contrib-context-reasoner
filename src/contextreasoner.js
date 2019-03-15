/**
 * Copyright 2014 Sense Tecnic Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var ContextReasonerArrayNode = require('./ContextReasonerArrayNode');

module.exports = function(RED) {
  "use strict";
  
  RED.nodes.registerType("context reasoner", function(n){
    RED.nodes.createNode(this,n);

    var node = this;
    node.config = n; // copy config to the backend so that down bellow we can have a reference
    var crNode = new ContextReasonerArrayNode(n);

    crNode.setStatusCallback(node.status.bind(node))
    
    node.on("input", (msg) => {
      crNode.onInput(msg, node.context(), node.send.bind(node), node.error.bind(node));
    });

    node.on('close', ()=>crNode.onClose());
  });
}
