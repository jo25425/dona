import {daysBeforeMonths, normalizeDate, NumericDate} from './utils/date';
import {convertTime12to24, normalizeAMPM, normalizeTime} from './utils/time';

const regexParser = /\[?(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}),? (\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?: ([ap]\.?m\.?))?\]?(?: -|:)? (.+?): ((?:.|\s)*)/i;
const regexParserSystem = /\[?(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}),? (\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?: ([ap]\.?m\.?))?\]?(?: -|:)? ((?:.|\s)+)/i;
const regexStartsWithDateTime = /\[?(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}),? (\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?: ([ap]\.?m\.?))?\]?/i;

type Options = {
  daysFirst?: boolean;
};

type MessageObj = {
  system: boolean;
  msg: string;
};

export type ParsedMessage = {
  date: number;
  author: string;
  message: string;
};

export type ParsingResult = {
  texts: ParsedMessage[];
  contacts: string[];
};


function inferDateFormat(datedItems: {date: string}[]): boolean | null {
  const numericDates: NumericDate[] = Array.from(
      new Set(datedItems.map(({ date }) => date)),
      (date) => {
        const dateParts = date.split(/[-/.]/).map(Number);

        // Ensure there are exactly three parts (day, month, year)
        if (dateParts.length === 3) {
          return dateParts as NumericDate;
        }

        // Handle invalid date format if necessary, throw or return a fallback
        throw new Error(`Invalid date format: ${date}`);
      }
  );
  return daysBeforeMonths(numericDates);
}

function computeDateTime(date: string, time: string, ampm: string | null, daysFirst: boolean | null): number {
  let day, month, year;

  if (daysFirst === false) {
    [month, day, year] = date.split(/[-/.]/);
  } else {
    [day, month, year] = date.split(/[-/.]/);
  }
  [year, month, day] = normalizeDate(year, month, day);

  const [hours, minutes, seconds] = normalizeTime(
      ampm ? convertTime12to24(time, normalizeAMPM(ampm)) : time
  ).split(/[:.]/);

  // Convert month and year to numbers before using them in Date constructor
  return new Date(
      Number(year), Number(month) - 1, Number(day),
      Number(hours), Number(minutes), Number(seconds)
  ).getTime()
}

/**
 * Given an array of lines, detects the lines that are part of a previous
 * message (multiline messages) and merges them.
 * It also labels the system messages.
 * The result is an array of messages.
 */
export function makeArrayOfMessages(lines: string[]): MessageObj[] {
  return lines.reduce((acc: MessageObj[], line: string) => {
    /**
     * If the line doesn't conform to the regex, it's probably part of the
     * previous message or a "WhatsApp event."
     */
    if (!regexParser.test(line)) {
      /**
       * If it doesn't match the first regex but still starts with a datetime,
       * it should be considered a "WhatsApp event," so it gets labeled "system."
       */
      if (regexStartsWithDateTime.test(line) && regexParserSystem.exec(line) !== null) {
        return acc.concat({ system: true, msg: line });
      }

      // Last element not set, just skip this (might be an empty file).
      if (typeof acc.slice(-1)[0] === 'undefined') return acc;

      // Else it's part of the previous message and should be concatenated.
      return acc.slice(0, -1).concat({
        system: acc.slice(-1)[0].system,
        msg: `${acc.slice(-1)[0].msg}\n${line}`,
      });
    }

    return acc.concat({ system: false, msg: line });
  }, []);
}

/**
 * Given an array of messages, parses them and returns an object with the fields
 * date, author, and message.
 */
export function parseMessages(messages: MessageObj[], options: Options = {}): ParsingResult {
  let allContactNames: string[] = [];

  const parsed = messages.map(obj => {
    const { system, msg } = obj;

    // If it's a system message, use another regex to parse it.
    if (system) {
      const [, date, time, ampm, message] = regexParserSystem.exec(msg) ?? [];
      return { date, time, ampm: ampm || null, author: 'System', message };
    }

    const [, date, time, ampm, author, message] = regexParser.exec(msg) ?? [];
    allContactNames.push(author);
    return { date, time, ampm: ampm || null, author, message };
  });

  // Remove duplicate contact names.
  allContactNames = [...new Set(allContactNames)];

  // Try to understand date format if not supplied (days before month or opposite)
  let daysFirst: boolean | null = options.daysFirst ?? inferDateFormat(parsed);

  // Convert date/time into a date object, then return the final object.
  const parsedMessages: ParsedMessage[] = parsed.map(({ date, time, ampm, author, message }) => {
    return {
      date: computeDateTime(date, time, ampm, daysFirst),
      author,
      message,
    };
  });

  return {
    texts: parsedMessages,
    contacts: allContactNames,
  };
}
