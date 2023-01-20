
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// 303 redirect to session.url