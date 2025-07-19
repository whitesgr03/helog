// styles
import styles from './FederationButton.module.css';

interface IFederationButton {
	iconUrl: string;
	provider: string;
	handleLoading: (isLoading: boolean) => void;
}

export const FederationButton = ({
	iconUrl,
	provider,
	handleLoading,
}: IFederationButton) => {
	const handleSocialLogin = async (provider: IFederationButton['provider']) => {
		handleLoading(true);

		window.location.assign(
			`${import.meta.env.VITE_RESOURCE_URL}/account/login/${provider}`,
		);
	};

	return (
		<button
			className={styles['federation-button']}
			onClick={() => handleSocialLogin(provider)}
		>
			<div className={styles.icon}>
				<img src={iconUrl} alt={`${provider} icon`} />
			</div>
			Sign in with {provider}
		</button>
	);
};
