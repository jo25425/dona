import maskName from '../parsing/shared/maskName';
import {describe, expect, it} from '@jest/globals';

describe('maskName', () => {
    it('should replace all characters except the first letter of each word with asterisks', () => {
        expect(maskName("John Doe")).toBe("J*** D**");
        expect(maskName("Jane-Marie O'Connor")).toBe("J********* O*******");
    });

    it('should handle names with punctuation correctly', () => {
        expect(maskName("Dr. Smith")).toBe("D** S****");
        expect(maskName("Mr. T!")).toBe("M** T*");
    });

    it('should handle single-word names', () => {
        expect(maskName("Alice")).toBe("A****");
        expect(maskName("O'Connor")).toBe("O*******");
    });

    it('should handle names with multiple spaces', () => {
        expect(maskName("  John   Doe  ")).toBe("J*** D**");
    });

    it('should handle empty strings', () => {
        expect(maskName("")).toBe("");
        expect(maskName("   ")).toBe("");
    });

    it('should handle names with only punctuation', () => {
        expect(maskName("...")).toBe(".**");
        expect(maskName("!?")).toBe("!*");
    });

    it('should handle names with special characters', () => {
        expect(maskName("John_Doe")).toBe("J*******");
        expect(maskName("Jane@Doe")).toBe("J*******");
    });
});
