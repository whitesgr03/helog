import { vi, describe, it, expect, beforeAll } from 'vitest';
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Link } from 'react-router-dom';

import {
	QueryClient,
	QueryClientProvider,
	queryOptions,
} from '@tanstack/react-query';

import { App } from './App';

import { Header } from '../../layout/Header/Header';
import { Error as ErrorComponent } from '../../utils/Error/Error';
import { Modal } from './Modal';
import { Alert } from './Alert';
import { Footer } from '../../layout/Footer/Footer';
import { Offline } from '../../utils/Error/Offline';
import { Loading } from '../../utils/Loading';

import { queryUserInfoOption } from '../../../utils/queryOptions';

import { getUserInfo } from '../../../utils/handleUser';

vi.mock('../../layout/Header/Header');
vi.mock('../../../components/layout/Footer/Footer');
vi.mock('../../utils/Error/Error');
vi.mock('../../utils/Error/Offline');
vi.mock('../../../utils/handleUser');
vi.mock('../../../utils/queryOptions');
vi.mock('./Modal');
vi.mock('./Alert');
vi.mock('../../layout/Footer/Footer');
vi.mock('../../utils/Loading');

describe('App component', () => {
	beforeAll(() => {
		const noop = () => {};
		Object.defineProperty(window, 'scrollTo', {
			value: noop,
			writable: true,
		});
	});
	it('should render the dark theme if browser prefers color scheme is dark.', async () => {
		const mockFetchResult = {};

		vi.mocked(getUserInfo).mockResolvedValue(mockFetchResult);
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		const mockMatchMedia = vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: true,
		} as MediaQueryList);
		const queryClient = new QueryClient();

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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const app = await screen.findByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(mockMatchMedia).toBeCalledTimes(1);
		expect(mockMatchMedia).toBeCalledWith('(prefers-color-scheme: dark)');
	});
	it('should render the dark theme if the dark theme of localstorage is set.', async () => {
		const mockFetchResult = {};

		vi.mocked(getUserInfo).mockResolvedValue(mockFetchResult);
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);

		const localstorage = {
			setItem: vi.spyOn(Storage.prototype, 'setItem'),
			getItem: vi
				.spyOn(Storage.prototype, 'getItem')
				.mockReturnValueOnce('true'),
		};
		const queryClient = new QueryClient();
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const app = await screen.findByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(localstorage.getItem).toBeCalledWith('darkTheme');
		expect(localstorage.setItem).toBeCalledWith('darkTheme', 'true');
	});
	it('should render the dark theme if the dark theme of url search params is set.', async () => {
		const mockFetchResult = {};

		vi.mocked(getUserInfo).mockResolvedValue(mockFetchResult);
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');
		const queryClient = new QueryClient();
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const app = await screen.findByTestId('app');

		expect(app).toHaveClass(/dark/);
	});
	it('should render the Error component if fetching the user data fails and the retrieved response status is not 404', async () => {
		vi.mocked(ErrorComponent).mockImplementation(() => (
			<div>Error component</div>
		));
		vi.mocked(getUserInfo).mockRejectedValue(
			new Error('', { cause: { status: 400 } }),
		);

		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const queryClient = new QueryClient();
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const errorComponent = await screen.findByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should render the main components if fetching the user data successful', async () => {
		vi.mocked(Header).mockImplementation(() => <div>Header component</div>);
		vi.mocked(Modal).mockImplementation(() => <div>Modal component</div>);
		vi.mocked(Alert).mockImplementation(() => <div>Alert component</div>);
		vi.mocked(Footer).mockImplementation(() => <div>Footer component</div>);
		vi.mocked(getUserInfo).mockResolvedValue({ username: 'example' });
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <div>Children component</div>,
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText('Header component')).toBeInTheDocument();
			expect(screen.getByText('Modal component')).toBeInTheDocument();
			expect(screen.getByText('Alert component')).toBeInTheDocument();
			expect(screen.getByText('Footer component')).toBeInTheDocument();
			expect(screen.getByText('Children component')).toBeInTheDocument();
		});
	});
	it('should toggle the color theme if the switch is clicked in the Header component', async () => {
		const user = userEvent.setup();
		const mockDarkTheme = 'false';

		vi.mocked(Header).mockImplementation(({ onColorTheme }) => (
			<div>
				<div>Header component</div>
				<button onClick={onColorTheme}>Switch color theme</button>
			</div>
		));
		vi.mocked(getUserInfo).mockResolvedValue({ username: 'example' });
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);

		const mockLocalStorageSetItem = vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockDarkTheme);

		const queryClient = new QueryClient();
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		// await waitForElementToBeRemoved(() =>
		// 	screen.getByText('Loading component'),
		// );

		const button = screen.getByRole('button', {
			name: 'Switch color theme',
		});

		await user.click(button);

		const app = screen.getByTestId('app');

		expect(app).toHaveClass(/dark/);
		expect(mockLocalStorageSetItem).toBeCalledWith(
			'darkTheme',
			JSON.stringify(!mockDarkTheme),
		);
	});
	it('should detect offline state then online state', async () => {
		vi.mocked(Header).mockImplementation(() => <div>Header component</div>);
		vi.mocked(Modal).mockImplementation(() => <div>Modal component</div>);
		vi.mocked(Alert).mockImplementation(() => <div>Alert component</div>);
		vi.mocked(Footer).mockImplementation(() => <div>Footer component</div>);
		vi.mocked(Offline).mockImplementation(() => <div>Offline component</div>);

		vi.mocked(getUserInfo).mockResolvedValue({ username: 'example' });
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <div>Component</div>,
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const offlineEvent = new Event('offline');
		const onlineEvent = new Event('online');

		expect(screen.getByText('Component')).toBeInTheDocument();

		await waitFor(() => {
			window.dispatchEvent(offlineEvent);
		});

		expect(screen.getByText('Offline component')).toBeInTheDocument();

		await waitFor(() => {
			window.dispatchEvent(onlineEvent);
		});
		expect(screen.getByText('Component')).toBeInTheDocument();
	});
	it('should render the Loading component if navigate to lazy routes', async () => {
		const user = userEvent.setup();
		vi.mocked(Header).mockImplementation(() => <div>Header component</div>);
		vi.mocked(Modal).mockImplementation(() => <div>Modal component</div>);
		vi.mocked(Alert).mockImplementation(() => <div>Alert component</div>);
		vi.mocked(Footer).mockImplementation(() => <div>Footer component</div>);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);

		vi.mocked(getUserInfo).mockResolvedValue({ username: 'example' });
		vi.mocked(queryUserInfoOption).mockReturnValue(
			queryOptions({
				queryKey: ['userInfo'],
				queryFn: getUserInfo,
				retry: false,
			}),
		);

		vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
			matches: false,
		} as MediaQueryList);
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('false');

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <App />,
					children: [
						{
							index: true,
							element: <Link to={'lazy'}>link</Link>,
						},
						{
							path: 'lazy',
							lazy: async () => {
								await new Promise(resolve => setTimeout(resolve, 100));
								return { Component: () => <div>Lazy component</div> };
							},
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const link = screen.getByRole('link', { name: 'link' });
		await user.click(link);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(screen.getByText('Lazy component')).toBeInTheDocument();
	});
});
