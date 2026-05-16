import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router';

import { NotFound } from './NotFound';

describe('NotFound component', () => {
	it('should match snapshot', () => {
		const router = createMemoryRouter([
			{
				path: '/',
				element: <NotFound />,
			},
		]);

		const { asFragment } = render(<RouterProvider router={router} />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
