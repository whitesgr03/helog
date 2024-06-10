import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { format } from "date-fns";

import useFetch from "../hooks/useFetch";

import PostDetail from "../components/PostDetail";

vi.mock("../hooks/useFetch");

vi.mock("../components/Comments.jsx", () => ({
	default: () => <></>,
}));

vi.mock("../components/Loading.jsx", () => ({
	default: () => <p>Loading component</p>,
}));

vi.mock("../components/Error.jsx", () => ({
	default: () => <p>Error component</p>,
}));

/* eslint-disable react/prop-types */
const Providers = ({ children }) => {
	return (
		<MemoryRouter initialEntries={["/posts/1"]}>
			<Routes>
				<Route path="/posts/:postId" element={children} />
			</Routes>
		</MemoryRouter>
	);
};

describe("PostDetail component", () => {
	it("should render Loading component if loading state of useFetch is true", () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: false,
			loading: true,
		});

		render(<PostDetail />, { wrapper: Providers });

		const element = screen.getByText("Loading component");

		expect(element).toBeInTheDocument();
	});
	it("should render Error component if error state of useFetch is true", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: true,
			loading: false,
		});

		render(<PostDetail />, { wrapper: Providers });

		const element = screen.getByText("Error component");

		expect(element).toBeInTheDocument();
	});
	it("should render dynamic data if loading and error states of useFetch are not true and data without lastModified is true.", async () => {
		const mockPost = {
			_id: "1",
			title: "This is title A",
			content: "This is content A",
			createdAt: new Date("2024/5/1"),
			author: {
				name: "example",
			},
		};
		useFetch.mockReturnValueOnce({
			data: mockPost,
			error: false,
			loading: false,
		});

		render(<PostDetail />, { wrapper: Providers });

		const title = screen.getByRole("heading", {
			name: mockPost.title,
			level: 2,
		});
		const content = screen.getByText(mockPost.content);
		const createdAt = screen.getByText(
			new RegExp(`${format(mockPost.createdAt, "MMMM d, y")}`, "i")
		);

		expect(title).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
	it("should render dynamic data if loading and error states of useFetch are not true and data of the lastModified is true.", async () => {
		const mockPost = {
			_id: "1",
			title: "This is title A",
			content: "This is content A",
			createdAt: new Date("2024/5/1"),
			lastModified: new Date("2024/5/2"),
			author: {
				name: "example",
			},
		};
		useFetch.mockReturnValueOnce({
			data: mockPost,
			error: false,
			loading: false,
		});

		render(<PostDetail />, { wrapper: Providers });

		const title = screen.getByRole("heading", {
			name: mockPost.title,
			level: 2,
		});
		const content = screen.getByText(mockPost.content);
		const createdAt = screen.getByText(
			new RegExp(`${format(mockPost.createdAt, "MMMM d, y")}`, "i")
		);
		const lastModified = screen.getByText(
			new RegExp(`${format(mockPost.lastModified, "MMMM d, y")}`, "i")
		);

		expect(title).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
		expect(lastModified).toBeInTheDocument();
	});
});
