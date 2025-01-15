// Packages
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';

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

// Variables
const defaultAlert = {
	message: '',
	error: false,
};

export const App = () => {
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [countPosts, setCountPosts] = useState(0);
	const [darkTheme, setDarkTheme] = useState(null);
	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(true);
	const [alert, setAlert] = useState(defaultAlert);
	const [modal, setModal] = useState(null);
	const [error, setError] = useState(false);
	const [reGetUser, setReGetUser] = useState(false);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

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
						: browserDarkScheme;

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
					: result.status === 500 && setError(result.message);

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

			const handleResult = () => {
				result.success ? setPosts(result.data) : setError(result.message);
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
			) : loading || fetching ? (
				<Loading text={'Loading...'} />
			) : (
				<div
					className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
					data-testid="app"
				>
					<ScrollRestoration getKey={location => location.key} />
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
						{alert.message !== '' && (
							<Alert alert={alert} onCloseAlert={handleCloseAlert} />
						)}
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
										fetching,
										onUser: setUser,
										onActiveModal: handleActiveModal,
										onAlert: handleAlert,
										onUpdatePost: handleUpdatePost,
									}}
								/>
							)}
						</main>
						<Footer />
					</div>
				</div>
			)}
		</>
	);
};
