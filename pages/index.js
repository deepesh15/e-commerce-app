import ProductCard from '@/components/ProductCard';
import { initMongoose } from '@/lib/mongoose';
import { useState } from 'react';
import { findAllProducts } from './api/products';
import Layout from '@/components/Layout';

export default function Home({ products }) {
	const [searchQuery, setSearchQuery] = useState('');

	const categories = [...new Set(products.map((p) => p.category))];

	if (searchQuery) {
		products = products.filter((p) => p.name.toLowerCase().includes(searchQuery));
	} else {
		products = products;
	}

	return (
		<Layout>
			<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type='text' placeholder='Search for products' className='w-full py-2 px-4 rounded-xl bg-ecom-bg-lime ' />
			<div>
				{categories.map((categoryName) => (
					<div key={categoryName}>
						{products.find((p) => p.category === categoryName) && (
							<div>
								<h2 className='text-2xl py-5 capitalize'>{categoryName}</h2>
								<div className='flex overflow-x-scroll snap-x scrollbar-hide -mx-5'>
									{products
										.filter((product) => product.category == categoryName)
										.map((prodInfo) => (
											<div key={prodInfo._id} className='px-5 snap-start'>
												<ProductCard {...prodInfo} />
											</div>
										))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</Layout>
	);
}

export async function getServerSideProps() {
	await initMongoose();
	const products = await findAllProducts();
	return {
		props: {
			products: JSON.parse(JSON.stringify(products)),
		},
	};
}
