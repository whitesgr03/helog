// Packages
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { object, string } from 'yup';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Utils
import { updateUser } from '../../../utils/handleUser';

export const ChangeNameModel = ({
	username,
	onUser,
	onAlert,
	onActiveModal,
}) => {
  const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ username });
	const [debounce, setDebounce] = useState(false);
	const [loading, setLoading] = useState(false);
	const timer = useRef(null);
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const handleUpdate = async () => {
		setLoading(true);
		// const isTokenExpire = await onVerifyTokenExpire();
		// const newAccessToken = isTokenExpire && (await onExChangeToken());

		const result = await updateUser(
			// newAccessToken || accessToken,
			formFields,
		);

		const handleSetUser = async data => {
			onUser(data);
			onModel(null);
		};

		const handleSetInputErrors = () => {
			const obj = {};
			for (const error of result.errors) {
				obj[error.field] = error.message;
			}
			setInputErrors(obj);
		};

		result.success
			? handleSetUser(result.data)
			: result?.errors
				? handleSetInputErrors()
				: onAlert({ message: result.message, error: true });

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		!loading && (await handleValidFields(formFields))
			? await handleUpdate()
			: setDebounce(false);
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		inputErrors && setDebounce(true);
	};

	useEffect(() => {
		debounce &&
			(timer.current = setTimeout(() => handleValidFields(formFields), 500));

		return () => clearTimeout(timer.current);
	}, [debounce, formFields]);

	return (
		<form className={formStyles.content} onSubmit={handleSubmit}>
			<div className={formStyles['label-wrap']}>
					<span className={`${imageStyles.icon} ${formStyles.alert}`} />

			<button
				type="submit"
				className={`${buttonStyles.success} ${loading ? buttonStyles.loading : ''}`}
			>
				<span className={buttonStyles.text}>
					Save
					<span
						className={`${imageStyles.icon} ${buttonStyles['load-Icon']}`}
					/>
				</span>
			</button>
		</form>
	);
};

ChangeNameModel.propTypes = {
	onActiveModal: PropTypes.func,
	onAlert: PropTypes.func,
	username: PropTypes.string,
	onUser: PropTypes.func,
};
