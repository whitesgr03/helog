// Packages
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

// Styles
import formStyles from '../../../styles/form.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Utils
import { updateUserInfo } from '../../../utils/handleUser';
import { verifySchema } from '../../../utils/verifySchema';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../../pages/App/AppContext';

interface ChangeNameModalProps {
	displayName: string;
}

interface inputErrors {
	displayName?: string;
}

export const ChangeNameModal = ({ displayName }: ChangeNameModalProps) => {
	const { onModal } = useAppDataAPI();
	const [inputErrors, setInputErrors] = useState<inputErrors>({});
	const [formFields, setFormFields] = useState({ displayName });
	const [debounce, setDebounce] = useState(false);

	const timer = useRef<NodeJS.Timeout>();
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const queryClient = useQueryClient();

	const { isPending, mutate } = useMutation({
		mutationFn: updateUserInfo,
		onError: () =>
			navigate('/error', {
				state: { previousPath },
			}),
		onSuccess: data => {
			const handleSetUser = () => {
				queryClient.setQueryData(['userInfo'], data);
				onModal({ component: null });
			};
			data.success ? handleSetUser() : setInputErrors({ ...data.fields });
		},
	});

	const schema = useMemo(
		() => ({
			displayName: string()
				.trim()
				.max(30, ({ max }) => `Display name must be less than ${max} long.`)
				.matches(
					/^([a-zA-Z0-9](-|_|\s)?)*[a-zA-Z0-9]$/,
					'Display name must be alphanumeric.',
				)
				.notOneOf(
					[displayName],
					'New displayName should be different from the old displayName.',
				)
				.required('Display name is required.'),
		}),
		[displayName],
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
				const validationResult = await verifySchema({
					schema,
					data: formFields,
				});
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500));
		return () => clearTimeout(timer.current);
	}, [schema, debounce, formFields]);

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
						className={`${inputErrors?.displayName ? formStyles.error : ''}`}
					>
						Change displayName
						<input
							id="changeUserName"
							type="text"
							name="displayName"
							value={formFields.displayName}
							onChange={handleChange}
							spellCheck="false"
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete="off"
						/>
					</label>
					<div>
						<span className={`${imageStyles.icon} ${formStyles.alert}`} />
						<span>{inputErrors.displayName ?? 'Message placeholder'}</span>
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
