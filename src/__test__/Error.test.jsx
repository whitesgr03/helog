import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Error from "../components/Error";

describe("Error component", () => {
	it("should render message from prop", () => {
		const mockMessage = "error message";
		render(<Error message={mockMessage} />);

		const element = screen.getByText(mockMessage);

		expect(element).toBeInTheDocument();
	});
	it("should render default message if type of message prop is not string", () => {
		render(<Error message={123} />);

		const element = screen.getByText(
			"Please come back later or if you have any questions, please contact us."
		);

		expect(element).toBeInTheDocument();
	});
});
