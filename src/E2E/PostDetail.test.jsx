import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

const randomInteger = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const IMAGE_SIZES = [
	{ width: 300, height: 250 },
	{ width: 600, height: 400 },
];

const posts = [
	{
		_id: '0',
		author: {
			username: faker.person.middleName(),
		},
		title: faker.lorem.words({ min: 1, max: 2 }),
		mainImage: faker.image.urlPicsumPhotos({
			width: IMAGE_SIZES[0].width,
			height: IMAGE_SIZES[0].height,
		}),
		publish: true,
		updatedAt: new Date(),
		createdAt: new Date(),
	},
];

const createParagraph = ({ line, IMAGE_SIZES, error }) => {
	let content = '';

	for (let i = 0; i < line; i++) {
		const size = IMAGE_SIZES[randomInteger(0, IMAGE_SIZES.length - 1)];

		const src = error
			? 'error-url'
			: faker.image.urlPicsumPhotos({
					width: size.width,
					height: size.height,
				});

		content += `<p>${faker.lorem.paragraphs({
			min: 1,
			max: 1,
		})}</p>\n`;

		content += `<p><img style="width:${size.width}px;" src="${src}" alt="Content image" width=${size.width} height=${size.height}></p>`;
	}

	return content;
};

test.describe('PostDetail component', () => {
	test.beforeEach(async ({ page }) => {
		await page.route(`**/user`, async route => {
			const json = {
				success: false,
				message: 'User could not been found.',
			};
			await route.fulfill({
				status: 404,
				json,
			});
		});
		await page.route(`**/blog/posts*`, async route => {
			const json = {
				success: true,
				message: 'Get all posts successfully.',
				data: {
					posts,
					postsCount: 0,
				},
			};
			json.data.postsCount = json.data.posts.length;
			await route.fulfill({ json });
		});
	});

	test(`should navigate to '/error/404' path if fetch a specified post is not exist`, async ({
		page,
	}) => {
		const postId = '1';

		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: false,
				message: 'Post could not be found.',
			};
			await route.fulfill({ status: 404, json });
		});

		await page.goto(`./posts/${postId}`);

		const pageTitle = page.getByRole('heading', {
			level: 2,
			name: /Page Not Found/,
		});

		await expect(pageTitle).toBeVisible();
		await expect(page).toHaveURL(/error\/404/);
	});
	test(`should navigate to '/error' path if fetch a specified post fails`, async ({
		page,
	}) => {
		const postId = '1';
		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: false,
			};
			await route.fulfill({ status: 400, json });
		});

		await page.goto(`./posts/${postId}`);

		const pageText = page.getByText(
			'Please try again later, or if you have any questions, contact us.',
		);

		await expect(pageText).toBeVisible({ timeout: 10000 });
		await expect(page).toHaveURL(/error/);
	});
	test(`should navigate to previous page if the "Back to list" Link is clicked`, async ({
		page,
	}) => {
		const postId = '1';
		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: {
					...posts[0],
					content: createParagraph({ line: 1, IMAGE_SIZES }),
				},
			};
			await route.fulfill({ json });
		});
		await page.route(`**/blog/posts?skip=*`, async route => {
			const json = {
				success: true,
				message: 'Get all posts successfully.',
				data: {
					posts,
					postsCount: 0,
				},
			};
			json.data.postsCount = json.data.posts.length;
			await new Promise(resolve => setTimeout(resolve, 1000));
			await route.fulfill({ json });
		});

		await page.goto('./posts');

		const postListLoading = page.getByText(/Loading/);

		await expect(postListLoading).toBeVisible();

		await page.goto(`./posts/${postId}`);

		const postDetailLoading = page.getByText(/Loading/);

		await expect(postDetailLoading).toBeVisible();

		const lint = page.getByRole('link', {
			name: /Back to list/,
		});

		await lint.click();

		await expect(page).toHaveURL(/.*\/posts/);
	});
	test(`should replace the invalid main image with the error image, if the main image is not a valid image resource.`, async ({
		page,
	}) => {
		const postId = '1';
		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: {
					...posts[0],
					content: createParagraph({ line: 1, IMAGE_SIZES }),
					mainImage: 'error_url',
				},
			};
			await route.fulfill({ json });
		});
		await page.goto(`./posts/${postId}`);

		const img = page.getByAltText('Main image');

		await expect(img).toHaveAttribute('src', /fakeimg.pl/);
	});
	test(`should render the post data if fetch a specified post is successfully`, async ({
		page,
	}) => {
		const mockContent = 'the new content';
		const postId = '1';
		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: {
					...posts[0],
					content: `<p>${mockContent}</p>`,
				},
			};
			await route.fulfill({ json });
		});
		await page.goto(`./posts/${postId}`);

		const postTitle = page.getByRole('heading', {
			level: 2,
			name: posts[0].title,
		});
		const username = page.getByText(posts[0].author.username);
		const postUpdateDate = page.getByText(
			new RegExp(`Published in ${format(posts[0].createdAt, 'MMMM d, y')}`),
		);
		const postContent = page.getByText(mockContent);
		const postMainImage = page.getByAltText('Main image');

		await expect(postTitle).toBeVisible();
		await expect(username).toBeVisible();
		await expect(postUpdateDate).toBeVisible();
		await expect(postContent).toBeVisible();
		await expect(postMainImage).toHaveAttribute(
			'src',
			new RegExp(`/${IMAGE_SIZES[0].width}/${IMAGE_SIZES[0].height}`),
		);
	});
	test(`should replace the invalid content images with the error images, if any content images is not a valid image resource`, async ({
		page,
	}) => {
		const imageCount = 5;
		const postId = '1';
		await page.route(`**/blog/posts/${postId}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: {
					...posts[0],
					content: createParagraph({
						line: imageCount,
						IMAGE_SIZES,
						error: true,
					}),
				},
			};
			await route.fulfill({ json });
		});
		await page.goto(`./posts/${postId}`);

		const imgs = page.getByAltText('Content image');

		await expect(imgs).toHaveCount(imageCount);

		for (const img of await imgs.all()) {
			await expect(img).toHaveAttribute('src', /fakeimg.pl/);
		}
	});
});
