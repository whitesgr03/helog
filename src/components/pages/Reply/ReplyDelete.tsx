// Packages
import { useMutation } from '@tanstack/react-query';

// Styles
import headerDeleteModelStyles from '../../layout/Header/DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteReply } from '../../../utils/handleReply';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { ReplyData } from './Replies';

interface ReplyDeleteProps {
	commentId: string;
	replyId: string;
}

export const ReplyDelete = ({ commentId, replyId }: ReplyDeleteProps) => {
	const { onAlert, onModal } = useAppDataAPI();
	const { isPending, mutate } = useMutation({
		mutationFn: deleteReply,
		onError: () =>
			onAlert([
				{
					message:
						'Delete the reply has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: response => {
			queryClient.setQueryData(['replies', commentId], (data: ReplyData) => {
				const newPages = data.pages.map(page => ({
					...page,
					data: page.data.map(reply =>
						reply._id === replyId ? response.data : reply,
					),
				}));
				return {
					pages: newPages,
					pageParams: data.pageParams,
				};
			});
			onAlert([
				{
					message: 'Reply has been deleted.',
					error: false,
					delay: 4000,
				},
			]);
		},
		onSettled: () => onModal({ component: null }),
	});

	const handleDeleteComment = () => {
		onModal({
			component: <ReplyDelete commentId={commentId} replyId={replyId} />,
			clickBgToClose: false,
		});
		mutate(replyId);
	};

	return (
		<>
			{isPending && (
				<Loading text={'Deleting ...'} light={true} shadow={true} />
			)}
			<div className={headerDeleteModelStyles.model}>
				<span className={headerDeleteModelStyles.title}>
					Delete This Reply Forever
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

