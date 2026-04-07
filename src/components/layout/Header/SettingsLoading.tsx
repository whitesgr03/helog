// Styles
import styles from './Settings.module.css';

// Components
import { Loading } from '../../utils/Loading.tsx';

export const SettingsLoading = () => (
	<div className={styles.wrap}>
		<Loading text={'Loading ...'} light={true} />
	</div>
);
