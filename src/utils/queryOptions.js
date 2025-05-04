import {
	QueryClient,
	queryOptions,
	infiniteQueryOptions,
} from '@tanstack/react-query';
import { getPosts, getPostDetail } from './handlePost';
import { getUserInfo } from './handleUser';

export const queryClient = new QueryClient();

export const infiniteQueryPostsOption = infiniteQueryOptions({
	queryKey: ['posts'],
	queryFn: getPosts,
	initialPageParam: 0,
	getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 10,
	staleTime: 1000 * 60 * 30,
	gcTime: Infinity,
});

export const queryPostDetailOption = id =>
	queryOptions({
		queryKey: ['post', id],
		queryFn: getPostDetail,
		staleTime: 1000 * 60 * 10,
	});

export const queryUserInfoOption = queryOptions({
	queryKey: ['userInfo'],
	queryFn: getUserInfo,
	retry: (_failureCount, error) => error.message !== '404',
	staleTime: Infinity,
	gcTime: Infinity,
	select: response => response.data,
});
