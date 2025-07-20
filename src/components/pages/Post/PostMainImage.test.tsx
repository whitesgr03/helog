import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { PostMainImage } from './PostMainImage';

describe('PostMainImage component', () => {
	it(`should replace the invalid main image with the error image, if the main image is not a valid image resource.`, async () => {
		const mockProps = {
			url: 'error',
			index: 0,
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PostMainImage {...mockProps} />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const image = screen.getByAltText(
			`Main image of post 1`,
		) as HTMLImageElement;

		fireEvent.load(image);

		expect(image).toHaveAttribute(
			'src',
			'https://fakeimg.pl/0x0/?text=404%20Image%20Error&font=noto',
		);
	});
});
