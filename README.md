# E-commerce Website Project

This is a full-stack e-commerce website project that was built from scratch using Node.js, MongoDB, and Express. The website is fully hosted on an Amazon EC2 instance with the help of Route 53. The website features a user-friendly interface, secure payment options, and an efficient database system to manage products and orders.

## Getting Started

### Prerequisites

To run this project, you'll need to have Node.js and MongoDB installed on your system. You'll also need to create an Amazon EC2 instance and set up a Route 53 domain to host the website.

### Installation

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Create a `.env` file and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=<your MongoDB URI>
    STRIPE_SECRET_KEY=<your Stripe secret key>
    STRIPE_PUBLIC_KEY=<your Stripe publishable key>
    ```
4. Run the app using `npm start`.

## Features

- User authentication and authorization using JWT
- Secure payment options using Stripe
- Efficient database system to manage products and orders
- User-friendly interface with search and filter options

## Built With

- Node.js
- MongoDB
- Express
- Stripe


## Acknowledgments

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Stripe](https://stripe.com/)
- [Amazon EC2](https://aws.amazon.com/ec2/)
- [Route 53](https://aws.amazon.com/route53/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
