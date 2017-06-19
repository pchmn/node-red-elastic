module.exports = function(RED) {
  "use strict";
  const elasticsearch = require('elasticsearch');

  function saveToElastic(config) {
      RED.nodes.createNode(this, config);
      this.host = config.host;
      var node = this;

      node.on('input', function(msg) {
        var client = new elasticsearch.Client({
          host: node.host,
          keepAlive: true,
          requestTimeout: Infinity
        });

        client.index(msg.payload, function (error, response) {
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
