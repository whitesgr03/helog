import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { SettingsLoading } from './SettingsLoading';

describe('SettingsLoading component', () => {
	it('should match snapshot', () => {
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <SettingsLoading />,
				},
			],
			{
				initialEntries: ['/'],
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		const { asFragment } = render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
