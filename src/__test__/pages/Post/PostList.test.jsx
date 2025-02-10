import { vi, describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import PostList from "../components/PostList";

vi.mock("../components/Posts");

describe("PostList component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<PostList />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
