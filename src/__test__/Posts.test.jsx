import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import useFetch from "../hooks/useFetch";

import Posts from "../components/Posts";

vi.mock("../hooks/useFetch");

vi.mock("../components/Loading.jsx", () => {
	return { default: () => <p>loading</p> };
});

vi.mock("../components/Error.jsx", () => {
	return { default: () => <p>error</p> };
});

describe("Posts component", () => {
	it("should render Loading component if loading state of useFetch is true", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: false,
			loading: true,
		});

		render(<Posts />, { wrapper: BrowserRouter });

		const element = screen.queryByText(/loading/i);

		expect(element).not.toEqual(null);
	});
	it("should render Error component if error state of useFetch is true", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: true,
			loading: false,
		});

		render(<Posts />, { wrapper: BrowserRouter });

		const element = screen.queryByText(/error/i);

		expect(element).not.toEqual(null);
	});
	it("should render static content if loading and error states of useFetch are not true and data is not true.", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: false,
			loading: false,
		});

		render(<Posts />, { wrapper: BrowserRouter });

		const element = screen.queryByText(/There are not posts./i);

		expect(element).not.toEqual(null);
	});
	it("should render dynamic data if loading and error states of useFetch are not true and data length is greater then 0.", async () => {
		const mockPosts = [
			{
				_id: "1",
				title: "This is title A",
				content: "This is content A",
				createdAt: new Date("2024/5/1"),
			},
			{
				_id: "2",
				title: "This is title B",
				content: "This is content B",
				createdAt: new Date("2024/5/1"),
			},
			{
				_id: "3",
				title: "This is title C",
				content: "This is content C",
				createdAt: new Date("2024/5/1"),
			},
		];
		useFetch.mockReturnValueOnce({
			data: mockPosts,
			error: false,
			loading: false,
		});

		render(<Posts />, { wrapper: BrowserRouter });

		const element = screen.queryByRole("list");

		expect(element).not.toEqual(null);
	});
});
