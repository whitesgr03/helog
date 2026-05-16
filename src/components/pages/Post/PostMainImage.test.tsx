import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router';

import { PostMainImage } from './PostMainImage';

describe('PostMainImage component', () => {
	it(`should replace the main image with the fake image, if the main image is not a valid resource.`, async () => {
		const mockProps = {
			url: 'error',
			title: 'post',
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <PostMainImage {...mockProps} />,
			},
		]);
		render(<RouterProvider router={router} />);

		const image = screen.getByAltText(mockProps.title) as HTMLImageElement;

		fireEvent.load(image);

		expect(image).toHaveAttribute(
			'src',
			'https://fakeimg.pl/0x0/?text=404%20Image%20Error&font=noto',
		);
	});
});
