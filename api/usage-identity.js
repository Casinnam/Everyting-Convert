const crypto = require('crypto');

module.exports = function usageIdentity(request, response) {
  const forwarded = request.headers['x-forwarded-for'];
  const realIp = request.headers['x-real-ip'];
  const rawIp = Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || realIp || request.socket.remoteAddress || 'unknown').split(',')[0].trim();

  const salt = process.env.USAGE_IDENTITY_SALT || 'everything-convert-v00';
  const hash = crypto
    .createHash('sha256')
    .update(`${salt}:${rawIp}`)
    .digest('hex')
    .slice(0, 32);

  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.status(200).json({
    identity: `ip-${hash}`,
  });
};
