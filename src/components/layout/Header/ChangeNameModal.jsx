// Packages
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../utils/queryOptions';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Utils
import { updateUserInfo } from '../../../utils/handleUser';
import { verifySchema } from '../../../utils/verifySchema';

// Components
import { Loading } from '../../utils/Loading';

export const ChangeNameModal = ({ username, onActiveModal }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ username });
	const [debounce, setDebounce] = useState(false);

	const timer = useRef(null);
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { isPending, mutate } = useMutation({
		mutationFn: updateUserInfo,
		onError: error =>
			navigate('/error', {
				state: { error: error.message, previousPath },
			}),
		onSuccess: data => {
			const handleSetUser = data => {
				queryClient.setQueryData(['userInfo'], data);
				onActiveModal({ component: null });
			};
			data.success ? handleSetUser(data) : setInputErrors({ ...data.fields });
		},
	});

	const handleSubmit = async e => {
		e.preventDefault();

		const schema = {
			username: string()
				.trim()
				.max(30, ({ max }) => `Username must be less than ${max} long.`)
				.matches(
					/^([a-zA-Z0-9](-|_|\s)?)*[a-zA-Z0-9]$/,
					'Username must be alphanumeric.',
				)
				.notOneOf(
					[username],
					'New username should be different from the old username.',
				)
				.required('Username is required.'),
		};

		const validationResult = await verifySchema({ schema, data: formFields });

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = () => {
			setInputErrors({});
			mutate(formFields);
		};

		validationResult.success ? handleValid() : handleInValid();
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
		const schema = {
			username: string()
				.trim()
				.max(30, ({ max }) => `Username must be less than ${max} long.`)
				.matches(
					/^([a-zA-Z0-9](-|_|\s)?)*[a-zA-Z0-9]$/,
					'Username must be alphanumeric.',
				)
				.notOneOf(
					[username],
					'New username should be different from the old username.',
				)
				.required('Username is required.'),
		};
		debounce &&
			(timer.current = setTimeout(async () => {
				const validationResult = await verifySchema({
					schema,
					data: formFields,
				});
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500));

		return () => clearTimeout(timer.current);
	}, [debounce, username, formFields]);

	return (
		<>
			{isPending && <Loading text={'Saving...'} light={true} shadow={true} />}
			<form
				className={formStyles.content}
				onSubmit={e => !isPending && handleSubmit(e)}
			>
				<div className={formStyles['label-wrap']}>
					<label
						htmlFor="changeUserName"
						className={`${inputErrors?.username ? formStyles.error : ''}`}
					>
						Change username
						<input
							id="changeUserName"
							type="text"
							name="username"
							value={formFields.username}
							onChange={handleChange}
							spellCheck="false"
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete="off"
						/>
					</label>
					<div>
						<span className={`${imageStyles.icon} ${formStyles.alert}`} />
						<span>{inputErrors.username ?? 'Message placeholder'}</span>
					</div>
				</div>

				<button
					type="submit"
					className={`${buttonStyles.content} ${buttonStyles.success}`}
				>
					Save
				</button>
			</form>
		</>
	);
};

ChangeNameModal.propTypes = {
	onActiveModal: PropTypes.func,
	username: PropTypes.string,
};
