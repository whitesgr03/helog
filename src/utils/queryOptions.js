import {
	QueryClient,
	queryOptions,
	infiniteQueryOptions,
	QueryCache,
} from '@tanstack/react-query';
import { getPosts, getPostDetail } from './handlePost';
import { getUserInfo } from './handleUser';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) => query?.meta?.errorAlert(),
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
		lastPage.data.postsCount > lastPageParam + 10 ? lastPageParam + 10 : null,
	staleTime: 1000 * 60 * 30,
	gcTime: Infinity,
});

export const queryPostDetailOption = id =>
	queryOptions({
		queryKey: ['post', id],
		queryFn: getPostDetail,
		staleTime: 1000 * 60 * 10,
		retry: (failureCount, error) =>
			error.cause.status !== 404 && failureCount < 3,
		select: response => response.data,
	});

export const queryUserInfoOption = queryOptions({
	queryKey: ['userInfo'],
	queryFn: getUserInfo,
	retry: (failureCount, error) =>
		error.cause.status !== 404 && failureCount < 3,
	staleTime: Infinity,
	gcTime: Infinity,
	refetchOnReconnect: false,
	select: response => response.data,
});
