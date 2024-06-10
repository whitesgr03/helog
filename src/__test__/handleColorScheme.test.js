import { vi, describe, it, expect } from "vitest";

import handleColorScheme from "../utils/handleColorScheme";

describe("handleColorScheme function", () => {
	it("should return true if matches dark color scheme.", () => {
		const mockResult = true;

		Object.defineProperty(window, "matchMedia", {
			value: vi.fn().mockImplementation(() => ({
				matches: mockResult,
			})),
		});

		const actual = handleColorScheme();

		const expected = mockResult;

		expect(actual).toEqual(expected);
	});
	it("should return false if matches method dose not exist.", () => {
		const mockResult = false;

		Object.defineProperty(window, "matchMedia", {
			value: vi.fn(),
		});

		const actual = handleColorScheme();

		const expected = mockResult;

		expect(actual).toEqual(expected);
	});
	it("should return false if not match media dark color scheme.", () => {
		const mockResult = false;

		Object.defineProperty(window, "matchMedia", {
			value: vi.fn().mockImplementation(() => ({
				matches: mockResult,
			})),
		});

		const actual = handleColorScheme();

		const expected = mockResult;

		expect(actual).toEqual(expected);
	});
});
