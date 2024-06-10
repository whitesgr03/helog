import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import useFetch from "../hooks/useFetch";

import Comments from "../components/Comments";

vi.mock("../hooks/useFetch");

vi.mock("../components/CommentDetail.jsx", () => ({
	default: () => <></>,
}));

vi.mock("../components/Loading.jsx", () => ({
	default: () => <p>Loading component</p>,
}));

vi.mock("../components/Error.jsx", () => ({
	default: () => <p>Error component</p>,
}));

describe("Components component", () => {
	it("should render Loading component if loading state of useFetch is true", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: false,
			loading: true,
		});

		render(<Comments />, { wrapper: BrowserRouter });

		const element = screen.getByText("Loading component");

		expect(element).toBeInTheDocument();
	});
	it("should render Error component if error state of useFetch is true", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: true,
			loading: false,
		});

		render(<Comments />, { wrapper: BrowserRouter });

		const element = screen.getByText("Error component");

		expect(element).toBeInTheDocument();
	});
	it("should render static content if loading and error states of useFetch are not true and data is falsy.", async () => {
		useFetch.mockReturnValueOnce({
			data: false,
			error: false,
			loading: false,
		});

		render(<Comments />, { wrapper: BrowserRouter });

		const element = screen.getByText("There are not comments.");

		expect(element).toBeInTheDocument();
	});
	it("should render data if loading and error states of useFetch are not true and data length is greater then 0.", async () => {
		const mockComments = [
			{
				_id: "1",
				author: "a",
				title: "This is title A",
				content: "This is content A",
				createdAt: new Date("2024/5/1"),
				lastModified: new Date("2024/5/2"),
			},
			{
				_id: "2",
				author: "b",
				title: "This is title B",
				content: "This is content B",
				createdAt: new Date("2024/5/2"),
				lastModified: new Date("2024/5/3"),
				reply: "2",
			},
			{
				_id: "3",
				author: "c",
				title: "This is title C",
				content: "This is content C",
				createdAt: new Date("2024/5/1"),
				lastModified: new Date("2024/5/5"),
			},
		];
		useFetch.mockReturnValueOnce({
			data: mockComments,
			error: false,
			loading: false,
		});

		render(<Comments />, { wrapper: BrowserRouter });

		const element = screen.getByRole("list");

		expect(element).toBeInTheDocument();
	});
});
