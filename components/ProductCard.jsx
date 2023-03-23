import { useContext } from 'react';
import { ProductContext } from './ProductsContext';

export default function ProductCard({ _id, name, price, description, category, picture }) {
	const { setSelectedProducts } = useContext(ProductContext);
	const addProduct = () => {
		setSelectedProducts((prev) => [...prev, _id]);
	};
	return (
		<div className='flex' key={_id}>
			<div className='py-4'>
				<div className='w-64'>
					<div className='bg-ecom-bg-lime p-5 rounded-xl'>
						<img src={picture} alt='' />
					</div>
					<div className='mt-2'>
						<h3 className='font-bold text-lg'>{name}</h3>
					</div>
					<p className='text-sm mt-2'>{description}</p>
					<div className='flex  items-center mt-2'>
						<div className='font-bold grow text-2xl'>${price}</div>
						<button onClick={addProduct} className='flex gap-1 items-center  mt-2 p-3 rounded-lg bg-ecom-bg hover:bg-ecom-highlight transition-all'>
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
								<path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
