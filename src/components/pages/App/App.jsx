// Packages
import { useState, useEffect } from 'react';
import {
	Outlet,
	useSearchParams,
	useNavigate,
	ScrollRestoration,
} from 'react-router-dom';

// Styles
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
import { getUser } from '../../../utils/handleUser';
import { getPosts } from '../../../utils/handlePost';

export const App = () => {
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [countPosts, setCountPosts] = useState(0);
	const [darkTheme, setDarkTheme] = useState(null);
	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(true);
	const [alert, setAlert] = useState([]);
	const [modal, setModal] = useState(null);
	const [error, setError] = useState(false);
	const [reGetUser, setReGetUser] = useState(false);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

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

		const handleGetUser = async () => {
			const result = await getUser({ signal });

			const handleResult = () => {
				reGetUser && setReGetUser(false);

				const handleSuccess = () => {
					error && setError(false);
					setUser(result.data);
				};

				result.success
					? handleSuccess()
					: result.status !== 404 && setError(result.message);

				setLoading(false);
			};

			result && handleResult();
		};
		(reGetUser || !user) && handleGetUser();
		return () => controller.abort();
	}, [reGetUser, user, error]);

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
		<>
			{error ? (
				<Error onReGetUser={setReGetUser} />
			) : (
				<div
					className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
					data-testid="app"
				>
					<ScrollRestoration getKey={location => location.key} />
					{loading || fetching ? (
						<Loading text={'Loading...'} />
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
									user={user}
									darkTheme={darkTheme}
									onUser={setUser}
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
													onUser={setUser}
													onAlert={handleAlert}
													onError={setError}
												/>
											),
											clickToClose: false,
										})
									) : (
										<Outlet
											context={{
												user,
												posts,
												countPosts,
												onUser: setUser,
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
			)}
		</>
	);
};
