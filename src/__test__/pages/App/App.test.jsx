import { vi, describe, it, expect, beforeAll } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	RouterProvider,
	createMemoryRouter,
	useOutletContext,
} from 'react-router-dom';

import { App } from '../../../components/pages/App/App';

import { Header } from '../../../components/layout/Header/Header';
import { Alert } from '../../../components/pages/App/Alert';
import { Modal } from '../../../components/pages/App/Modal';
import { CreateUsername } from '../../../components/pages/App/CreateUsername';
import { Loading } from '../../../components/utils/Loading';
import { Error } from '../../../components/utils/Error/Error';

import { getUser } from '../../../utils/handleUser';
import { getPosts } from '../../../utils/handlePost';
import { useEffect } from 'react';

vi.mock('../../../components/layout/Header/Header');
vi.mock('../../../components/layout/Footer/Footer');
vi.mock('../../../components/pages/App/Alert');
vi.mock('../../../components/pages/App/Modal');
vi.mock('../../../components/pages/App/CreateUsername');
vi.mock('../../../components/utils/Loading');
vi.mock('../../../components/utils/Error/Error');
vi.mock('../../../utils/handleUser');
vi.mock('../../../utils/handlePost');

describe('App component', () => {
	beforeAll(() => {
		const noop = () => {};
		Object.defineProperty(window, 'scrollTo', {
			value: noop,
			writable: true,
		});
	});
	it('should render the dark theme if browser prefers color scheme is dark.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		const mockMatchMedia = vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: true,
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(mockMatchMedia)
			.toBeCalledTimes(1)
			.toBeCalledWith('(prefers-color-scheme: dark)');
	});
	it('should render the dark theme if the dark theme of localstorage is set.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});

		const localstorage = {
			setItem: vi.spyOn(Storage.prototype, 'setItem'),
			getItem: vi
				.spyOn(Storage.prototype, 'getItem')
				.mockReturnValueOnce('true'),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(localstorage.getItem).toBeCalledWith('darkTheme');
		expect(localstorage.setItem).toBeCalledWith('darkTheme', 'true');
	});
	it('should render the dark theme if the dark theme of url search params is set.', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
				},
			],
			{
				initialEntries: ['/?theme=true'],
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

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
	});
	it('should render the Error component if fetching the post data fails', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: false,
				message: 'error',
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Error.mockImplementation(() => <div>Error component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should update the post state if fetching the post data is successfully', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'example',
				},
			},
			getPosts: {
				success: true,
				data: {
					posts: [{ _id: '0', title: 'new' }],
				},
			},
		};
		mockResolve.getPosts.data.countPosts =
			mockResolve.getPosts.data.posts.length;

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { posts, countPosts } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					{countPosts}
				</div>
			);
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		const items = screen.getAllByRole('listitem');
		const countPosts = screen.getByText(mockResolve.getPosts.data.countPosts);

		expect(items.length).toBe(mockResolve.getPosts.data.posts.length);
		expect(countPosts).toBeInTheDocument();
	});
	it('should render the Error component if fetching the user data fails and the retrieved response status is not 404', async () => {
		const mockResolve = {
			getUser: {
				success: false,
				status: 500,
				message: 'error',
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Error.mockImplementation(() => <div>Error component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should update the user state if fetching the user data is successfully', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { user } = useOutletContext();
			return <div>{user.username}</div>;
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		const username = screen.getByText('new_user');

		expect(username).toBeInTheDocument();
	});
	it('should render the CreateUsername component if the user is first logged in', async () => {
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Modal.mockImplementation(({ children }) => (
			<div>
				<p>Modal component</p>
				{children}
			</div>
		));
		CreateUsername.mockImplementation(() => (
			<div>CreateUsername component</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const MockComponent = () => {
			const { user } = useOutletContext();
			return <div>{user.username}</div>;
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		const modalComponent = screen.getByText('Modal component');
		const createUsernameComponent = screen.getByText(
			'CreateUsername component',
		);

		expect(modalComponent).toBeInTheDocument();
		expect(createUsernameComponent).toBeInTheDocument();
	});
	it('should toggle the color theme if the switch is clicked', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};
		const mockDarkTheme = 'true';

		Loading.mockImplementation(() => <div>Loading component</div>);
		Header.mockImplementation(({ onColorTheme }) => (
			<div>
				<button onClick={onColorTheme}>Header button</button>
			</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockDarkTheme);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const headerButton = screen.getByRole('button', { name: 'Header button' });

		await user.click(headerButton);

		expect(mockSetItem).toBeCalledWith(
			'darkTheme',
			JSON.stringify(!mockDarkTheme),
		);
	});
	it('should update the alert state if the alert message is added', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {
					username: 'new_user',
				},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		const mockAlert = { message: 'new alert', error: true, delay: 50 };

		Loading.mockImplementation(() => <div>Loading component</div>);
		Header.mockImplementation(({ onAlert }) => (
			<div>
				<button onClick={() => onAlert(mockAlert)}>Header button</button>
			</div>
		));
		Alert.mockImplementation(({ alert, onAlert }) => {
			useEffect(() => {
				alert.length === 1 &&
					setTimeout(() => {
						onAlert([]);
					}, alert[0].delay);
			}, [alert, onAlert]);
			return (
				<>
					{alert.length === 1 && (
						<div className={alert[0].error ? 'error' : ''}>
							{alert[0].message}
						</div>
					)}
				</>
			);
		});
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const headerButton = screen.getByRole('button', {
			name: 'Header button',
		});

		await user.click(headerButton);

		const alert = screen.getByText(mockAlert.message);

		expect(alert).toHaveClass(/error/).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.getByText(mockAlert.message));
	});
	it('should render the modal component if a modal is activated', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: {},
			},
			getPosts: {
				success: true,
				data: {},
			},
		};

		const mockModal = {
			component: 'A component',
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Header.mockImplementation(({ onActiveModal }) => (
			<div>
				<button onClick={() => onActiveModal(mockModal)}>Header button</button>
			</div>
		));
		Modal.mockImplementation(({ clickToClose, children }) => (
			<div className={clickToClose ? 'close' : ''}>{children}</div>
		));
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
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

		const headerButton = screen.getByRole('button', {
			name: 'Header button',
		});

		await user.click(headerButton);

		const modalComponent = screen.getByText(mockModal.component);

		expect(modalComponent).toHaveClass(/close/).toBeInTheDocument();
	});
	it('should update a specified post data if a new post data is set', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getPosts: {
				success: true,
				data: {
					posts: [{ _id: '0', title: 'first' }],
					countPosts: 1,
				},
			},
		};
		const mockNewPost = {
			_id: '0',
			title: 'edited',
		};

		const MockComponent = () => {
			const { posts, onUpdatePost } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					<button
						onClick={() => {
							const postId = '0';
							const newPost = mockNewPost;

							onUpdatePost({ postId, newPost });
						}}
					>
						Component button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		const item = screen.getByRole('listitem');

		expect(item).toHaveTextContent(mockResolve.getPosts.data.posts[0].title);

		const componentButton = screen.getByText('Component button');

		await user.click(componentButton);

		expect(item).toHaveTextContent(mockNewPost.title);
	});
	it("should update a specified post's comment if a new comment data is set", async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getPosts: {
				success: true,
				data: {
					posts: [
						{
							_id: '0',
							title: 'first',
							comments: [{ _id: '0', content: 'new comment' }],
						},
					],
					countPosts: 1,
				},
			},
		};
		const mockNewComments = {
			_id: '0',
			content: 'edited comment',
		};

		const MockComponent = () => {
			const { posts, onUpdatePost } = useOutletContext();
			return (
				<div>
					<ul>
						{posts[0].comments.map(comment => (
							<li key={comment._id}>{comment.content}</li>
						))}
					</ul>
					<button
						onClick={() => {
							const postId = '0';
							const commentId = '0';
							const newComments = posts[0].comments.map(comment =>
								comment._id === commentId ? mockNewComments : comment,
							);
							onUpdatePost({ postId, newComments });
						}}
					>
						Component button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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

		const item = screen.getByRole('listitem');

		expect(item).toHaveTextContent(
			mockResolve.getPosts.data.posts[0].comments[0].content,
		);

		const componentButton = screen.getByText('Component button');

		await user.click(componentButton);

		expect(item).toHaveTextContent(mockNewComments.content);
	});
	it('should update the posts data if the new posts data is set', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			getUser: {
				success: true,
				data: { username: 'example' },
			},
			getPosts: {
				success: true,
				data: {
					posts: [{ _id: '0', title: 'first' }],
					countPosts: 1,
				},
			},
		};
		const mockNewPost = {
			posts: {
				_id: '1',
				title: 'second',
			},
			countPosts: mockResolve.getPosts.data.posts.length + 1,
		};

		const MockComponent = () => {
			const { posts, onUpdatePosts, countPosts } = useOutletContext();
			return (
				<div>
					<ul>
						{posts.map(post => (
							<li key={post._id}>{post.title}</li>
						))}
					</ul>
					<div data-testid="count">{countPosts}</div>
					<button
						onClick={() => {
							onUpdatePosts(mockNewPost);
						}}
					>
						Component button
					</button>
				</div>
			);
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		getUser.mockResolvedValueOnce(mockResolve.getUser);
		getPosts.mockResolvedValueOnce(mockResolve.getPosts);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		});
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <MockComponent />,
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
		const count = screen.getByTestId('count');
		let items = screen.getAllByRole('listitem');

		expect(count).toHaveTextContent(1);
		expect(items.length).toBe(1);
		expect(items[0]).toHaveTextContent(
			mockResolve.getPosts.data.posts[0].title,
		);

		const componentButton = screen.getByText('Component button');

		await user.click(componentButton);

		items = screen.getAllByRole('listitem');

		expect(count).toHaveTextContent(2);
		expect(items.length).toBe(2);
		expect(items[1]).toHaveTextContent(mockNewPost.posts.title);
	});
});
