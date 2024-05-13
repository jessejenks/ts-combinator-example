import { Result } from "@jessejenks/ts-combinator";
import { exprParser, toSExp } from "./expressions";
import { dateParser } from "./dates";

["2024-05-12", "2024/05/12", "2024:05:12", "2024-05/12", "2024/05-12", "2024:05/12"].forEach((input) => {
	const result = dateParser.parse(input);
	switch (result.variant) {
		case Result.Variant.Ok:
			console.log(`input: "${input}" -> ${JSON.stringify(result.value.parsed)}`);
			break;
		case Result.Variant.Err:
			console.log(result.error.message);
			break;
	}
});

["1", "1 + 2", "1 + 2 + 3", "(1 + 2) + 3", "1 + 2 * 3", "(1 + 2) * 3", "1 * 2 + 3"].forEach((expr) => {
	const result = exprParser.parse(expr);
	switch (result.variant) {
		case Result.Variant.Ok:
			console.log(`input: "${expr}" -> ${toSExp(result.value.parsed)}`);
			break;
		case Result.Variant.Err:
			console.log(result.error.message);
			break;
	}
});
