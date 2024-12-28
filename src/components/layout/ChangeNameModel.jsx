// Packages
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Utils
import { updateUser } from '../../../utils/handleUser';
import { verifyScheme } from '../../../utils/verifyScheme';

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

		const result = await updateUser(formFields);

		const handleSetUser = () => {
			onUser(result.data);
			onAlert({ message: result.message });
			onActiveModal({ component: null });
		};

		result.success
			? handleSetUser()
			: result.fields
				? setInputErrors({ ...result.fields })
				: navigate('/error', {
						state: { error: result.message, previousPath },
					});

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const schema = {
			username: string()
				.trim()
				.max(30, ({ max }) => `Username must be less than ${max} long.`)
				.matches(/^[a-zA-Z0-9]\w*$/, 'Username must be alphanumeric.')
				.notOneOf(
					[username],
					'New username should be different from the old username.',
				)
				.required('Username is required.'),
		};

		const validationResult = await verifyScheme({ schema, data: formFields });

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = async () => {
			setInputErrors({});
			await handleUpdate();
		};

		validationResult.success ? await handleValid() : handleInValid();
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		!isEmpty(inputErrors) && setDebounce(true);
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
