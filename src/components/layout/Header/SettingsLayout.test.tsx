import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { SettingsLayout } from './SettingsLayout';

describe('SettingsLayout component', () => {
	it('should render children prop, if children were provided.', () => {
		const mockChildren = 'Children';

		render(
			<SettingsLayout>
				<div>{mockChildren}</div>
			</SettingsLayout>,
		);

		const children = screen.getByText(mockChildren);

		expect(children).toBeInTheDocument();
	});
});
