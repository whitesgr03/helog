import { vi, describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Contact from "../components/Contact";

vi.mock("../components/Address.jsx", () => ({
	default: () => <div>Address component</div>,
}));

describe("Contact component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Contact />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
