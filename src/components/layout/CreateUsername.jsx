// Packages
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import isEmpty from 'lodash.isempty';

// Styles
import style from '../../styles/layout/ChangeNameModel.module.css';
import form from '../../styles/utils/form.module.css';
import button from '../../styles/utils/button.module.css';
import image from '../../styles/utils/image.module.css';

import { updateUser } from '../../utils/handleUser';

export const CreateUsername = ({ onActiveModal, onUser }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ username: '' });
	const [debounce, setDebounce] = useState(false);
	const [loading, setLoading] = useState(false);
	const timer = useRef(null);
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const verifyScheme = async data => {
		let result = {
			success: true,
			fields: {},
		};

		try {
			const schema = object({
				username: string()
					.trim()
					.max(30, ({ max }) => `Username must be less than ${max} long.`)
					.matches(/^[a-zA-Z0-9]\w*$/, 'Username must be alphanumeric.')
					.required('Username is required.'),
			}).noUnknown();
			await schema.validate(data, {
				abortEarly: false,
				stripUnknown: true,
			});
		} catch (err) {
			for (const error of err.inner) {
				result.fields[error.path] = error.message;
			}
			result.success = false;
		}

		return result;
	};

	const handleUpdate = async () => {
		setLoading(true);

		const result = await updateUser(formFields);

		const handleSetUser = () => {
			onUser(result.data);
			onActiveModal({ component: null });
		};

		// const handleSetInputErrors = () => {
		// 	const obj = {};
		// 	for (const error of result.errors) {
		// 		obj[error.field] = error.message;
		// 	}
		// 	setInputErrors(obj);
		// };

		result.success
			? handleSetUser()
			: result.fields
				? setInputErrors({ ...result.fields })
				: navigate('/error', {
						state: { error: result.message, previousPath },
					});
		// : result?.errors
		// ? handleSetInputErrors()
		// : onAlert({ message: result.message, error: true });
		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const validationResult = await verifyScheme(formFields);

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = async () => {
			setInputErrors({});
			await handleUpdate();
		};

		validationResult.success ? await handleValid() : handleInValid();

		// !loading && (await handleValidFields(formFields))
		// 	? await handleUpdate()
		//   : setDebounce(false);
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
			(timer.current = setTimeout(async () => {
				const validationResult = await verifyScheme(formFields);
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500));

		return () => clearTimeout(timer.current);
	}, [debounce, formFields]);

	return (
		<div className={style.model}>
			<form className={form.content} onSubmit={handleSubmit}>
				<div className={form.labelWrap}>
					<label
						htmlFor="username"
						className={`${inputErrors.username ? form.error : ''}`}
					>
						Create username
						<input
							id="username"
							type="text"
							name="username"
							value={formFields.name}
							onChange={handleChange}
						/>
					</label>
					<div>
						<span className={`${image.icon} ${form.alert}`} />
						<span className={form.placeholder}>
							{inputErrors.username ?? 'Message placeholder'}
						</span>
					</div>
				</div>

				<button
					type="submit"
					className={`${button.success} ${loading ? button.loading : ''}`}
				>
					<span className={button.text}>
						Save
						<span className={`${image.icon} ${button.loadIcon}`} />
					</span>
				</button>
			</form>
		</div>
	);
};

CreateUsername.propTypes = {
	onActiveModal: PropTypes.func,
	onUser: PropTypes.func,
};
