// Packages
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// styles
import styles from './Login.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { FederationButton } from './FederationButton';

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

import { queryUserInfoOption } from '../../../utils/queryOptions';

interface IFederationProviders {
	iconUrl: string;
	provider: 'google' | 'facebook';
}

const federationProviders: IFederationProviders[] = [
	{
		iconUrl: googleIcon,
		provider: 'google',
	},
	{
		iconUrl: facebookIcon,
		provider: 'facebook',
	},
];

export const Login = () => {
	const { data: user } = useQuery({ ...queryUserInfoOption(), enabled: false });
	const [loading, setLoading] = useState(false);

	return (
		<>
			{user ? (
				<Navigate to="/" replace={true} />
			) : (
				<div className={styles.account}>
					<div className={styles.wrap}>
						<h3 className={styles.title}>User Sign in</h3>
						<div className={styles.container}>
							{loading && <Loading text={'Loading...'} shadow={true} />}
							{federationProviders.map(item => (
								<FederationButton
									{...item}
									key={item.provider}
									handleLoading={setLoading}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
