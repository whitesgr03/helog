// Packages
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
// Styles
import headerDeleteModelStyles from '../../layout/Header/DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteComment } from '../../../utils/handleComment';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { CommentData } from './Comments';

export const CommentDelete = ({ commentId }: { commentId: string }) => {
	const { postId } = useParams();
	const { onAlert, onModal } = useAppDataAPI();

	const queryClient = useQueryClient();
	const { isPending, mutate } = useMutation({
		mutationFn: deleteComment,
		onError: () =>
			onAlert([
				{
					message:
						'Delete the comment has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: response => {
			queryClient.setQueryData(['comments', postId], (data: CommentData) => {
				const newPages = data.pages.map(page => ({
					...page,
					data: {
						...page.data,
						comments: page.data.comments.map(comment =>
							comment._id === commentId ? response.data : comment,
						),
					},
				}));
				return {
					pages: newPages,
					pageParams: data.pageParams,
				};
			});
			onAlert([
				{
					message: 'Comment has been deleted.',
					error: false,
					delay: 4000,
				},
			]);
		},
		onSettled: () => onModal({ component: null }),
	});

	const handleDeleteComment = () => {
		onModal({
			component: <CommentDelete commentId={commentId} />,
			clickBgToClose: false,
		});
		mutate(commentId);
	};

	return (
		<>
			{isPending && (
				<Loading text={'Deleting ...'} light={true} shadow={true} />
			)}
			<div className={headerDeleteModelStyles.model}>
				<span className={headerDeleteModelStyles.title}>
					Delete This Comment Forever
				</span>
				<span className={headerDeleteModelStyles.content}>
					Do you really want to delete?
				</span>
				<div className={headerDeleteModelStyles['button-wrap']}>
					<button
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						data-close-model
						onClick={() => onModal({ component: null })}
					>
						Cancel
					</button>
					<button
						className={`${buttonStyles.content} ${buttonStyles.error}`}
						onClick={handleDeleteComment}
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};
