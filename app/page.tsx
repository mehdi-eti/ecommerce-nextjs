/** @format */

import Link from "next/link";
import Image from "next/image";
import type { Stripe } from "stripe";

import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/carousel";

export default async function Home() {
	let error: string | null = null;
	let products: Stripe.Product[] = [];

	try {
		const response = await stripe.products.list({ expand: ["data.default_price"], limit: 5, active: true });
		products = response.data;
	} catch (err) {
		console.error("Failed to fetch products:", err);
		error = "Failed to load products. Please try again later.";
	}

	// Fallback if no products or error
	if (error || products.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[50vh]'>
				<h2 className='text-2xl font-bold mb-4'>{error || "No products available"}</h2>
				<Button asChild variant='default'>
					<Link href='/products'>Browse Products</Link>
				</Button>
			</div>
		);
	}

	// Safely get first product image or fallback
	const firstProductImage = products[0]?.images?.[0] || "/placeholder-product.jpg";

	return (
		<div>
			<section className='rounded bg-neutral-100 py-8 sm:py-12'>
				<div className='mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2'>
					<div className='max-w-md space-y-4'>
						<h2 className='text-3xl font-bold tracking-tight md:text-4xl'>Welcome to My Ecommerce</h2>
						<p className='text-neutral-600'>Discover the latest products at the best prices.</p>
						<Button
							asChild
							variant='default'
							className='inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white'>
							<Link href='/products' className='inline-flex items-center justify-center rounded-full px-6 py-3'>
								Browse All Products
							</Link>
						</Button>
					</div>
					<Image alt={products[0]?.name || "Product image"} src={firstProductImage} className='rounded' width={450} height={450} priority />
				</div>
			</section>

			<section className='py-8'>
				<Carousel products={products} />
			</section>
		</div>
	);
}
