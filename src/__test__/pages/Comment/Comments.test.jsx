import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Comments } from '../../../components/pages/Comment/Comments';
import { CommentDetail } from '../../../components/pages/Comment/CommentDetail';
import { CommentCreate } from '../../../components/pages/Comment/CommentCreate';

import { getComments } from '../../../utils/handleComment';
import { Loading } from '../../../components/utils/Loading';

vi.mock('../../../components/pages/Comment/CommentDetail');
vi.mock('../../../components/pages/Comment/CommentCreate');
vi.mock('../../../utils/handleComment');
vi.mock('../../../components/utils/Loading');

describe('Comments component', () => {
	it('should render an error alert if getting more comments fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{ _id: '0' },
					{ _id: '1' },
					{ _id: '2' },
					{ _id: '3' },
					{ _id: '4' },
					{ _id: '5' },
					{ _id: '6' },
					{ _id: '7' },
					{ _id: '8' },
					{ _id: '9' },
					{ _id: '10' },
				],
				totalComments: 11,
				countComments: 20,
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};
		const mockResolve = {
			success: false,
		};

		CommentCreate.mockImplementation(() => <div>CommentCreate component</div>);
		CommentDetail.mockImplementation(() => <div>CommentDetail component</div>);

		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const showMoreButton = screen.getByRole('button', {
			name: 'Show more comments',
		});

		user.click(showMoreButton);

		const loadIcon = await screen.findByTestId('loading-icon');

		expect(getComments).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(loadIcon).not.toBeInTheDocument();
	});
	it(`should navigate to '/error' path if fetch the comments fails`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				countComments: 0,
			},
		};

		const mockContext = {
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: false,
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
						{
							path: 'error',
							element: <div>Error component</div>,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const errorComponent = await screen.findByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it(`should update the post comments if fetch the comments are successfully`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				countComments: 0,
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
	});
	it(`should render the list of comments and a CommentCreate component if the comments are provided`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{ _id: '0' },
					{ _id: '1' },
					{ _id: '2' },
					{ _id: '3' },
					{ _id: '4' },
					{ _id: '5' },
					{ _id: '6' },
					{ _id: '7' },
					{ _id: '8' },
					{ _id: '9' },
					{ _id: '10' },
				],
				totalComments: 11,
				countComments: 20,
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		CommentCreate.mockImplementation(() => <div>CommentCreate component</div>);
		CommentDetail.mockImplementation(() => <div>CommentDetail component</div>);

		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const headingElement = screen.getByRole('heading', { level: 3 });

		const commentCreateComponent = screen.getByText('CommentCreate component');
		const commentDetailComponent = screen.getAllByText(
			'CommentDetail component',
		);
		const moreButton = screen.getByRole('button', {
			name: 'Show more comments',
		});

		expect(headingElement).toHaveTextContent(mockProps.post.totalComments);
		expect(commentCreateComponent).toBeInTheDocument();
		expect(commentDetailComponent.length).toBe(mockProps.post.comments.length);
		expect(moreButton).toBeInTheDocument();
	});
	it('should render the next ten comments if the show more comments button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{ _id: '0' },
					{ _id: '1' },
					{ _id: '2' },
					{ _id: '3' },
					{ _id: '4' },
					{ _id: '5' },
					{ _id: '6' },
					{ _id: '7' },
					{ _id: '8' },
					{ _id: '9' },
					{ _id: '10' },
				],
				totalComments: 11,
				countComments: 20,
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		CommentCreate.mockImplementation(() => <div>CommentCreate component</div>);
		CommentDetail.mockImplementation(() => <div>CommentDetail component</div>);

		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const showMoreButton = screen.getByRole('button', {
			name: 'Show more comments',
		});

		user.click(showMoreButton);

		const loadIcon = await screen.findByTestId('loading-icon');

		expect(getComments).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(showMoreButton).not.toBeInTheDocument();
		expect(loadIcon).not.toBeInTheDocument();
		expect(showMoreButton).not.toBeInTheDocument();
	});
	it(`should render no comments if the provided comments are empty`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				comments: [],
				totalComments: 0,
			},
		};

		mockProps.post.countComments = mockProps.post.comments.length;

		const mockContext = {
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		CommentCreate.mockImplementation(() => <div>CommentCreate component</div>);

		getComments.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Comments {...mockProps} />,
						},
					],
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);
		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const headingElement = screen.getByRole('heading', { level: 3 });

		const commentCreateComponent = screen.getByText('CommentCreate component');
		const noCommentDetail = screen.getByText('There are not comments.');

		expect(headingElement).not.toHaveTextContent(mockProps.post.totalComments);
		expect(commentCreateComponent).toBeInTheDocument();
		expect(noCommentDetail).toBeInTheDocument();
	});
});
