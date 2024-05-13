import { Parser } from "@jessejenks/ts-combinator";
const { oneOf, sequence, conditional, map, exact, singleDigit } = Parser;

type Year = { year: string };
type Month = { month: string };
type Day = { day: string };

type DateObject = Year & Month & Day;

const yearParser = map(
	(yearDigits): Year => ({ year: yearDigits.join("") }),
	sequence(singleDigit(), singleDigit(), singleDigit(), singleDigit()),
);

const monthParser = map(
	(monthDigits): Month => ({ month: monthDigits.join("") }),
	sequence(singleDigit(), singleDigit()),
);

const dayParser = map((dayDigits): Day => ({ day: dayDigits.join("") }), sequence(singleDigit(), singleDigit()));

const monthDayWithSeparator = (sep: Parser<string>, month: Parser<Month>, day: Parser<Day>) =>
	conditional(sep, sequence(month, sep, day));

export const dateParser = map(
	([year, [, [month, , day]]]): DateObject => ({ ...year, ...month, ...day }),
	sequence(
		yearParser,
		oneOf(
			monthDayWithSeparator(exact(":"), monthParser, dayParser),
			monthDayWithSeparator(exact("/"), monthParser, dayParser),
			monthDayWithSeparator(exact("-"), monthParser, dayParser),
		),
	),
);
