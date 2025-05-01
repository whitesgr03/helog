// Packages
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams, ScrollRestoration } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Styles
import 'normalize.css';
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Alert } from './Alert';
import { Modal } from './Modal';
import { CreateUsername } from './CreateUsername';
import { Loading } from '../../utils/Loading';
import { Error } from '../../utils/Error/Error';

// Utils
import { queryUserInfOption } from '../../../utils/queryOptions';
import { getPosts } from '../../../utils/handlePost';

export const App = () => {
	const [posts, setPosts] = useState([]);
	const [countPosts, setCountPosts] = useState(0);
	const [darkTheme, setDarkTheme] = useState(null);
	const [fetching, setFetching] = useState(true);
	const [alert, setAlert] = useState([]);
	const [modal, setModal] = useState(null);

	const [searchParams] = useSearchParams();

	const {
		isPending,
		isError,
		data: user,
		error,
		refetch,
	} = useQuery(queryUserInfOption);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error, delay }) => {
		const newAlert = {
			message,
			error,
			delay,
		};
		setAlert(alert.length < 2 ? alert.concat(newAlert) : [newAlert]);
	};

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

	const handleUpdatePost = ({ postId, newPost, newComments: comments }) => {
		setPosts(
			posts.map(post => {
				return post._id === postId
					? newPost
						? newPost
						: { ...post, comments }
					: post;
			}),
		);
	};

	const handleUpdatePosts = data => {
		setPosts(posts.concat(data.posts));
		setCountPosts(data.countPosts);
	};

	useEffect(() => {
		const getColorTheme = () => {
			const themeParams = searchParams.get('theme');
			const darkScheme = localStorage.getItem('darkTheme');
			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			const theme =
				themeParams !== null
					? themeParams
					: darkScheme !== null
						? darkScheme
						: String(browserDarkScheme);

			localStorage.setItem('darkTheme', theme);
			setDarkTheme(theme === 'true');
		};
		darkTheme === null && getColorTheme();
	}, [navigate, darkTheme, searchParams]);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getPosts({ skip: 0, signal });

			const handleSuccess = () => {
				setPosts(result.data.posts);
				setCountPosts(result.data.countPosts);
			};

			const handleResult = () => {
				result.success ? handleSuccess(result.data) : setError(result.message);
				setFetching(false);
			};

			result && handleResult();
		};

		handleGetPosts();
		return () => controller.abort();
	}, []);
	return (
		<div
			className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
			data-testid="app"
		>
			<ScrollRestoration getKey={location => location.key} />
			{isPending ? (
				<Loading text={'Loading...'} />
			) : isError && error.message !== '404' ? (
				<Error onReGetUser={refetch} />
			) : (
				<>
					{modal && (
						<Modal
							onActiveModal={handleActiveModal}
							clickToClose={modal.clickToClose}
						>
							{modal.component}
						</Modal>
					)}
					<div className={styles['header-bar']}>
						<Header
							user={user?.data}
							darkTheme={darkTheme}
							onAlert={handleAlert}
							onColorTheme={handleColorTheme}
							onActiveModal={handleActiveModal}
						/>
						<Alert alert={alert} onAlert={setAlert} />
					</div>
					<div className={styles.container}>
						<main>
							{user && !user.username ? (
								!modal &&
								handleActiveModal({
									component: (
										<CreateUsername
											onActiveModal={handleActiveModal}
											onAlert={handleAlert}
										/>
									),
									clickToClose: false,
								})
							) : (
								<Outlet
									context={{
										user: user?.data,
										posts,
										countPosts,
										onUpdatePosts: handleUpdatePosts,
										onActiveModal: handleActiveModal,
										onAlert: handleAlert,
										onUpdatePost: handleUpdatePost,
									}}
								/>
							)}
						</main>
						<Footer />
					</div>
				</>
			)}
		</div>
	);
};
