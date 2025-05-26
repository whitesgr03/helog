import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CommentDelete } from './CommentDelete';
import { Loading } from '../../utils/Loading';

import { deleteComment } from '../../../utils/handleComment';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handleComment');

describe('CommentDelete component', () => {
	it('should render an error alert if delete a comment fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '0',
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: false,
		};

		deleteComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(<CommentDelete {...mockProps} />);

		const button = screen.getByRole('button', { name: 'Delete' });

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deleteComment).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		render(<CommentDelete {...mockProps} />);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete a comment if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
					},
				],
			},
			onUpdatePost: vi.fn(),
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: {},
		};

		deleteComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(
			<CommentDelete
				{...mockProps}
				commentId={mockProps.post.comments[0]._id}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Delete' });

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deleteComment).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});
