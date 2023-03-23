import { closeMongoose, initMongoose } from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Products';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	await initMongoose();

	const { email, name, address, city } = req.body;
	const productIds = req.body.products.split(',');
	const deliveryCharge = req.body.delivery;
	const uniqueIds = [...new Set(productIds)];

	const products = await Product.find({ _id: { $in: uniqueIds } }).exec();

	let line_items = [];
	for (let productId of uniqueIds) {
		const quantity = productIds.filter((id) => id === productId).length;
		const product = products.find((p) => p._id.toString() === productId);
		line_items.push({
			quantity,
			price_data: {
				currency: 'USD',
				product_data: { name: product.name },
				unit_amount: product.price * 100,
			},
		});
	}

	line_items.push({
		quantity: 1,
		price_data: {
			currency: 'USD',
			product_data: { name: 'delivery-charge' },
			unit_amount: deliveryCharge * 100,
		},
	});

	const order = await Order.create({
		name,
		email,
		address,
		city,
		products: line_items,
		paid: 0,
	});

	if (req.method === 'POST') {
		try {
			const session = await stripe.checkout.sessions.create({
				line_items,
				mode: 'payment',
				success_url: `${req.headers.origin}/?success=true`,
				cancel_url: `${req.headers.origin}/?canceled=true`,
				metadata: { orderId: order._id.toString() },
			});
			res.redirect(303, session.url);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
	closeMongoose();
}
