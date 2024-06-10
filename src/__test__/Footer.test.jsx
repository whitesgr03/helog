import { vi, describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Footer from "../components/Footer";

vi.mock("../components/Address.jsx", () => ({
	default: () => <div>Address component</div>,
}));

describe("Footer component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Footer />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
