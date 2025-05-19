import {
	QueryClient,
	queryOptions,
	infiniteQueryOptions,
	QueryCache,
} from '@tanstack/react-query';
import { getPosts, getPostDetail } from './handlePost';
import { getUserInfo } from './handleUser';
import { getComments } from './handleComment';
import { getReplies } from './handleReply';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) =>
			typeof query.meta?.errorAlert === 'function' && query.meta.errorAlert(),
	}),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const infiniteQueryPostsOption = infiniteQueryOptions({
	queryKey: ['posts'],
	queryFn: getPosts,
	initialPageParam: 0,
	getNextPageParam: (lastPage, _allPages, lastPageParam) =>
		lastPage.data.postsCount > lastPageParam + 100 ? lastPageParam + 100 : null,
	staleTime: 1000 * 60 * 30,
	gcTime: Infinity,
});

export const queryPostDetailOption = (id: string) =>
	queryOptions({
		queryKey: ['post', id],
		queryFn: getPostDetail,
		staleTime: 1000 * 60 * 30,
		retry: (failureCount, error: { cause: { status: number } }) =>
			error?.cause?.status !== 404 && failureCount < 3,
		select: response => response.data,
	});

export const infiniteQueryCommentsOption = (postId: string) =>
	infiniteQueryOptions({
		queryKey: ['comments', postId],
		queryFn: getComments,
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) =>
			lastPage.data.commentsCount > lastPageParam + 100
				? lastPageParam + 100
				: null,
		staleTime: 1000 * 60 * 30,
	});

export const infiniteQueryRepliesOption = (
	commentId: string,
	repliesCount: number,
) =>
	infiniteQueryOptions({
		queryKey: ['replies', commentId],
		queryFn: getReplies,
		initialPageParam: 0,
		getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
			repliesCount > lastPageParam + 100 ? lastPageParam + 100 : null,
		staleTime: 1000 * 60 * 30,
	});

export const queryUserInfoOption = queryOptions({
	queryKey: ['userInfo'],
	queryFn: getUserInfo,
	retry: (failureCount, error: { cause: { status: number } }) =>
		error?.cause?.status !== 404 && failureCount < 3,
	staleTime: Infinity,
	gcTime: Infinity,
	refetchOnReconnect: false,
	select: response => response.data,
});
