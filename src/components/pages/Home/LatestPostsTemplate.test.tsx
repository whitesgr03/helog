import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import { PostListTemplate } from '../Post/PostListTemplate';
import { LatestPostsTemplate } from './LatestPostsTemplate';

vi.mock('../Post/PostListTemplate');

describe('Footer component', () => {
	it('should match snapshot', () => {
		vi.mocked(PostListTemplate).mockImplementation(() => (
			<div>PostListTemplate component</div>
		));

		const { asFragment } = render(<LatestPostsTemplate />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
