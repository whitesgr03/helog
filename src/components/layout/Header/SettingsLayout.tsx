// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Settings.module.css';

export const SettingsLayout = ({ children }: { children: ReactNode }) => (
	<div className={styles.settings}>
		<div className={styles['blur-background']} />
		{children}
	</div>
);
