const rateLimit=require('express-rate-limit');

exports.rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 10,
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  headers: true,
});