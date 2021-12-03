import * as P from "https://raw.githubusercontent.com/Kindelia/Lambolt/master/src/Parser.ts"

type Term
  = {$: "Lam", body: (x: Term) => Term}
  | {$: "App", func: Term, argm: Term}
  | {$: "Var", name: string}

export function Lam(body: (x: Term) => Term) : Term {
  return {$: "Lam", body};
}

export function App(func: Term, argm: Term) : Term {
  return {$: "App", func, argm};
}

export function Var(name: string) : Term {
  return {$: "Var", name};
}

export function reduce(term: Term) : Term {
  switch (term.$) {
    case "App": {
      var func = reduce(term.func);
      switch (func.$) {
        case "Lam": return reduce(func.body(term.argm));
        default   : return term;
      }
    }
    default: return term;
  }
}

export function normal(term: Term) : Term {
  var term = reduce(term);
  switch (term.$) {
    case "App": return App(normal(term.func), normal(term.argm));
    case "Lam": return Lam(x => normal(term.body(x)));
    case "Var": return Var(term.name);
  }
}

export function show(term: Term, depth: number = 0) : string {
  switch (term.$) {
    case "Lam": return "λx"+(depth) + " " + show(term.body(Var("x"+depth)), depth + 1);
    case "App": return "(" + show(term.func, depth + 1) + " " + show(term.argm, depth + 1) + ")";
    case "Var": return term.name;
  }
}

export function bind(term: Term, name: string, variable: Term) : Term {
  switch (term.$) {
    case "Lam": return Lam(x => bind(term.body(x), name, variable));
    case "App": return App(bind(term.func, name, variable), bind(term.argm, name, variable));
    case "Var": return term.name === name ? variable : term;
  }
}

export function parse() : P.Parser<Term> {
  return s => P.grammar("Term", [
    P.guard(P.match("λ"), (state) => {
      var [state, skp0] = P.match("λ")(state);
      var [state, name] = P.name(state);
      var [state, body] = parse()(state);
      return [state, Lam(x => bind(body, name, x))];
    }),
    P.guard(P.match("("),
      P.list(P.match("("), P.match(""), P.match(")"), parse(), (args) => args.reduce(App))),
    P.guard(P.match(/[a-z_]/),
      (state) => {
        var [state, name] = P.name1(state);
        return [state, Var(name)];
      }),
    (state) => [state, null],
  ])(s);
}

export function read(code: string): Term {
  return parse()({index: 0, code})[1];
}
