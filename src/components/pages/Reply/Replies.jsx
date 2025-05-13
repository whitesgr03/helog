// Packages
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from '../Comment/Comments.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { ReplyDetail } from './ReplyDetail';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryRepliesOption } from '../../../utils/queryOptions';

export const Replies = ({ commentId, repliesCount }) => {
	const [shakeTargetId, setShakeTargetId] = useState('');
	const [renderRepliesCount, setRenderRepliesCount] = useState(10);

	const repliesRef = useRef([]);
	const waitForScrollRef = useRef(null);

	const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
		useInfiniteQuery({
			...infiniteQueryRepliesOption(commentId, repliesCount),
		});

	const replies = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data),
		[],
	);

	const handleScroll = id => {
		const target = repliesRef.current.find(reply => reply.id === id);

		const handleShake = () => {
			clearTimeout(waitForScrollRef.current);

			waitForScrollRef.current = setTimeout(() => {
				setShakeTargetId(id);
				window.removeEventListener('scroll', handleShake);
			}, 100);
		};

		window.addEventListener('scroll', handleShake);

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	const handleAnimationEnd = () => setShakeTargetId('');

	const handleRenderNextPage = () => {
		replies.length <= renderRepliesCount && fetchNextPage();
		setRenderRepliesCount(renderRepliesCount + 10);
	};

	return (
		<>
			{replies && (
				<div className={styles.replies}>
					<div className={styles.content}>
						<ul>
							{replies.slice(0, renderRepliesCount).map((reply, index) => (
								<div
									key={reply._id}
									id={reply._id}
									className={shakeTargetId === reply._id ? styles.shake : ''}
									ref={element => (repliesRef.current[index] = element)}
									onAnimationEnd={handleAnimationEnd}
									data-testid="reply"
								>
									<ReplyDetail
										index={index}
										commentId={commentId}
										reply={reply}
										onScroll={handleScroll}
									/>
								</div>
							))}
						</ul>
						{isFetchingNextPage ? (
							<Loading text={'Loading more replies ...'} />
						) : (
							(replies?.length > renderRepliesCount || hasNextPage) && (
								<button
									className={`${buttonStyles.content} ${buttonStyles.more}`}
									onClick={handleRenderNextPage}
								>
									Show more replies
								</button>
							)
						)}
					</div>
				</div>
			)}
		</>
	);
};

Replies.propTypes = {
	commentId: PropTypes.string,
	repliesCount: PropTypes.number,
};
