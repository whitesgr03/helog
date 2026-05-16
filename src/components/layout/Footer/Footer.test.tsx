import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { Footer } from './Footer';

describe('Footer component', () => {
	it('should match snapshot', () => {
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Footer />,
				},
			],
			{
				initialEntries: ['/'],
			},
		);

		const { asFragment } = render(<RouterProvider router={router} />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
