import { Parser, Maybe, ParseSuccess, ParseError } from "@jessejenks/ts-combinator";
const { oneOf, sequence, map, exact, lazy, spaces, maybe, int } = Parser;

export type Expr = {
	kind: "EXPR";
	value: Term | Add;
};

const Expr = (value: Term | Add): Expr => ({
	kind: "EXPR",
	value,
});

export type Term = {
	kind: "TERM";
	value: Factor | Mult;
};

const Term = (value: Factor | Mult): Term => ({
	kind: "TERM",
	value,
});

export type Factor = {
	kind: "FACTOR";
	value: Int | Expr;
};

const Factor = (value: Int | Expr): Factor => ({
	kind: "FACTOR",
	value,
});

export type Add = {
	kind: "ADD";
	left: Factor | Mult;
	right: Term | Add;
};

const Add = (left: Factor | Mult, right: Term | Add): Add => ({
	kind: "ADD",
	left,
	right,
});

export type Mult = {
	kind: "MULT";
	left: Expr | Int;
	right: Factor | Mult;
};

const Mult = (left: Expr | Int, right: Factor | Mult): Mult => ({
	kind: "MULT",
	left,
	right,
});

export type Int = {
	kind: "INTEGER";
	value: number;
};

const Int = (value: number): Int => ({
	kind: "INTEGER",
	value,
});

export const toSExp = (expr: Expr | Term | Factor | Add | Mult | Int): string => {
	switch (expr.kind) {
		case "EXPR":
		case "TERM":
		case "FACTOR":
			return toSExp(expr.value);
		case "ADD":
			return `(+ ${toSExp(expr.left)} ${toSExp(expr.right)})`;
		case "MULT":
			return `(* ${toSExp(expr.left)} ${toSExp(expr.right)})`;
		case "INTEGER":
			return String(expr.value);
	}
};

export const exprParser: Parser<Term | Add> = map(
	([term, , maybeRight]) => {
		switch (maybeRight.variant) {
			case Maybe.Variant.Nothing:
				return Term(term);

			case Maybe.Variant.Just:
				const [, , expr] = maybeRight.value;
				return Add(term, expr);
		}
	},

	sequence(
		lazy(() => termParser),
		spaces(),
		maybe(
			sequence(
				exact("+"),
				spaces(),
				lazy(() => exprParser),
			),
		),
	),
);

const termParser: Parser<Factor | Mult> = map(
	([factor, , maybeRight]) => {
		switch (maybeRight.variant) {
			case Maybe.Variant.Nothing:
				return Factor(factor);

			case Maybe.Variant.Just:
				const [, , term] = maybeRight.value;
				return Mult(factor, term);
		}
	},

	sequence(
		lazy(() => factorParser),
		spaces(),
		maybe(
			sequence(
				exact("*"),
				spaces(),
				lazy(() => termParser),
			),
		),
	),
);

const factorParser: Parser<Int | Expr> = oneOf<Int | Expr>(
	map(Int, int()),
	map(
		([, , expr]) => Expr(expr),
		sequence(
			exact("("),
			spaces(),
			lazy(() => exprParser),
			spaces(),
			exact(")"),
		),
	),
);
