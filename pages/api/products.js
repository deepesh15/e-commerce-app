import { closeMongoose, initMongoose } from '@/lib/mongoose';
import Product from '@/models/Products';

export async function findAllProducts() {
	return Product.find().exec();
}

export default async function handle(req, res) {
	await initMongoose();
	const { ids, all } = req.query;
	if (ids) {
		const idsArray = ids.split(',');
		res.json(
			await Product.find({
				_id: { $in: idsArray },
			}).exec(),
		);
	}
	if (all) {
		res.json(await findAllProducts());
	}
	closeMongoose();
}
