import { useContext, useEffect, useState } from 'react';
import Footer from './Footer';
import { ProductContext } from './ProductsContext';

export default function Layout({ children }) {
	const { setSelectedProducts } = useContext(ProductContext);
	const [success, setSuccess] = useState(false);
	useEffect(() => {
		if (window.location.href.includes('success')) {
			setSelectedProducts([]);
			setSuccess(true);
		}
	}, []);

	

	return (
		<div>
			<div className='p-5 bg-ecom-teal-bg'>
				{success && <div className='mb-5 bg-ecom-highlight text-black text-center text-lg p-5 rounded-xl'>Thanks for the order!</div>}
				{children}
			</div>
			<Footer />
		</div>
	);
}
