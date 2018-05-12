const redis       = require('redis'),
      jsonify     = require('redis-jsonify'),
      clientRedis = jsonify(redis.createClient())

module.exports = clientRedis;