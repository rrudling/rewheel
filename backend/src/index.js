require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import User from './models/User';
var cors = require('cors');

const url = process.env.MONGODB_URI;
const port = process.env.PORT;
const app_url = process.env.APP_URI;
const app_port = process.env.APP_PORT;
const jwt_secret = process.env.JWT_SECRET;
const jwks_url = process.env.JWKS_URL;
const auth0_client_id = process.env.AUTH0_CLIENT_ID;
const auth0_domain = process.env.AUTH0_DOMAIN;

console.log(process.env.MONGODB_URI);

const startServer = async () => {
	const client = jwksClient({
		jwksUri: jwks_url,
	});

	function getKey(header, cb) {
		client.getSigningKey(header.kid, function (err, key) {
			var signingKey = key.publicKey || key.rsaPublicKey;
			cb(null, signingKey);
		});
	}

	const options = {
		audience: auth0_client_id,
		issuer: auth0_domain,
		algorithms: ['RS256'],
	};

	const app = express();

	app.use(cors());

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => {
			// Authorization check on every request.
			const token = req.headers.authorization;
			const user = new Promise((resolve, reject) => {
				jwt.verify(token, getKey, options, (err, decoded) => {
					if (err) {
						return reject(err);
					}
					resolve(decoded.email);
				});
			});

			return {
				user,
			};
		},
	});

	await server.start();

	server.applyMiddleware({ app });

	await mongoose
		.connect(url, {
			useNewUrlParser: true,
		})
		.then(() => {
			console.log('Connected to MongoDB.');
		})
		.catch((error) => {
			console.log('Error connecting to MongoDB:', error.message);
		});

	app.listen(port, () =>
		console.log(
			`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
		)
	);
};

startServer();
