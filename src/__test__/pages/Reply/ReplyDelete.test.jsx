import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReplyDelete } from '../../../components/pages/Reply/ReplyDelete';
import { Loading } from '../../../components/utils/Loading';

import { deleteReply } from '../../../utils/handleReply';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handleReply');

describe('ReplyDelete component', () => {
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		render(<ReplyDelete {...mockProps} />);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it.only('should render error message alert if delete a reply fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			replyId: 'test',
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: false,
		};

		deleteReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(<ReplyDelete {...mockProps} />);

		const button = screen.getByRole('button', { name: 'Delete' });

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deleteReply).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should delete a reply if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								content: 'test reply',
							},
						],
					},
				],
			},
			commentId: '0',
			replyId: '0',
			onUpdatePost: vi.fn(),
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: {},
		};

		deleteReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		render(<ReplyDelete {...mockProps} />);

		const button = screen.getByRole('button', { name: 'Delete' });

		user.click(button);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deleteReply).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});
