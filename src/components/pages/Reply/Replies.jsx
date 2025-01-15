// Packages
import PropTypes from 'prop-types';

// Styles
import styles from '../Comment/Comments.module.css';

// Components
import { ReplyDetail } from './ReplyDetail';

export const Replies = ({ post, comment }) => {
	const replies = comment?.replies ?? [];

	return (
		<div className={styles.replies}>
			<div className={styles.content}>
				<ul>
					{replies.map((reply, index) => (
						<ReplyDetail
							key={reply._id}
							index={index}
							post={post}
							comment={comment}
							reply={reply}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};

Replies.propTypes = {
	post: PropTypes.object,
	comment: PropTypes.object,
	onLoading: PropTypes.func,
};
