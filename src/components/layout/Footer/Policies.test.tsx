import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { Policies } from './Policies';

describe('Policies component', () => {
	it('should match snapshot', () => {
		const { asFragment } = render(<Policies />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
