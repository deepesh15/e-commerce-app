import Layout from '@/components/Layout';
import { ProductContext } from '@/components/ProductsContext';
import { useContext, useEffect, useState } from 'react';

export default function Checkout() {
	const [products, setProducts] = useState([]);
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [email, setEmail] = useState('');
	const { selectedProducts, setSelectedProducts } = useContext(ProductContext);

	function addProduct(id) {
		setSelectedProducts((prev) => [...prev, id]);
	}

	function removeProduct(id) {
		const index = selectedProducts.indexOf(id);
		if (index !== -1) {
			setSelectedProducts((prev) => {
				return prev.filter((_, ind) => ind !== index);
			});
		}
	}

	async function fetchSelectedProducts(uniqueIds) {
		try {
			const res = await (await fetch('/api/products?ids=' + uniqueIds.join(','))).json();
			setProducts(res);
		} catch (error) {
			throw error;
		}
	}

	useEffect(() => {
		const uniqueIds = [...new Set(selectedProducts)];
		fetchSelectedProducts(uniqueIds);
	}, [selectedProducts]);

	let subTotal = 0;
	const deliveryPrice = 25;

	if (selectedProducts?.length) {
		for (let id of selectedProducts) {
			const price = products.find((p) => p._id === id)?.price || 0;
			subTotal += price;
		}
	}
	const total = subTotal + deliveryPrice;

	return (
		<Layout>
			{selectedProducts.length ? (
				products.map((product) => (
					<div className='flex mb-5 ' key={product._id}>
						<div className='w-36 p-4 bg-ecom-bg-lime rounded-xl shrink-0'>
							<img src={product.picture} alt='' />
						</div>
						<div className='pl-4 w-full flex justify-end'>
							<div className='grow mt-2 p-2'>
								<h3 className='font-bold text-lg'>{product.name}</h3>
							</div>
							<div className='p-2'>
								<div>
									<h3 className='font-bold text-md'>${product.price}</h3>
								</div>
								<div className='flex gap-2 p-2 -mx-2'>
									<button onClick={() => addProduct(product._id)} className='border-ecom-highlight border-2 rounded-lg hover:bg-ecom-highlight hover:text-white transition-all'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
										</svg>
									</button>
									<div>{selectedProducts.filter((id) => id === product._id).length}</div>
									<button onClick={() => removeProduct(product._id)} className='border-ecom-highlight border-2 rounded-lg hover:bg-ecom-highlight hover:text-white transition-all'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				<div>No products in your shopping cart</div>
			)}

			{selectedProducts.length && (
				<form action='/api/checkout_session' method='POST'>
					<div className='mt-4'>
						<div className='mt-4'>
							<div className='flex my-4'>
								<h3 className='grow'>Subtotal:</h3>
								<h3 className='font-bold'>${subTotal}</h3>
							</div>
						</div>
						<div className='mt-4'>
							<div className='flex my-4'>
								<h3 className='grow'>Delivery:</h3>
								<h3 className='font-bold'>${deliveryPrice}</h3>
							</div>
						</div>
						<div className='mt-4'>
							<div className='flex my-4 border-ecom-highlight border-dashed border-t-2 pt-2'>
								<h3 className='grow'>Total:</h3>
								<h3 className='font-bold'>${total}</h3>
							</div>
						</div>
					</div>
					<div className='mt-4'>
						<input name='name' value={name} onChange={(e) => setName(e.target.value)} className='bg-ecom-bg-lime w-full rounded-lg px-4 py-2 mb-2' type='text' placeholder='Full Name' />
						<input name='address' value={address} onChange={(e) => setAddress(e.target.value)} className='bg-ecom-bg-lime w-full rounded-lg px-4 py-2 mb-2' type='text' placeholder='Street address, number' />
						<input name='city' value={city} onChange={(e) => setCity(e.target.value)} className='bg-ecom-bg-lime w-full rounded-lg px-4 py-2 mb-2' type='text' placeholder='City and postal code' />
						<input name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-ecom-bg-lime w-full rounded-lg px-4 py-2 mb-2' type='text' placeholder='Email address' />
					</div>

					<input type='hidden' name='products' value={selectedProducts.join(',')} />
					<input type='hidden' name='delivery' value={deliveryPrice} />
					<button type='submit' className='bg-ecom-bg-lime w-full font-bold rounded-lg my-4 shadow-ecom-bg-lime shadow-lg px-5 py-2 hover:text-white hover:bg-ecom-highlight transition-all'>
						Pay ${total}
					</button>
				</form>
			)}
		</Layout>
	);
}
