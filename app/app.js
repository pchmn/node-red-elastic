module.exports = function(RED) {
  "use strict";
  const elasticsearch = require('elasticsearch');

  function saveToElastic(config) {
      RED.nodes.createNode(this, config);
      this.host = config.host;
      this.documentIndex = config.documentIndex;
      this.documentType = config.documentType;
      var node = this;

      node.on('input', function(msg) {
        var client = new elasticsearch.Client({
          host: node.host,
          keepAlive: true,
          requestTimeout: Infinity
        });

        const data = {};
        data.index = node.documentIndex || msg.documentIndex;
        data.type = node.documentType || msg.documentType;
        data.body = msg.payload;

        client.index(data, function (error, response) {
          if(error)
            node.error(error, msg);
          else {
            msg.payload = response;
            node.send(msg)
          }
        });
      });
  }

  RED.nodes.registerType("elastic", saveToElastic);
}
