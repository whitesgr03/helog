import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PostListTemplate } from './PostListTemplate';

describe('PostListTemplate component', () => {
	it('should render the specified number of template items, if the count prop is provided', () => {
		const mockProp = { count: 6 };

		render(<PostListTemplate {...mockProp} />);

		const items = screen.getAllByRole('listitem');

		expect(items).toHaveLength(mockProp.count);
	});
});
