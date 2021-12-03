import * as L from "./src/LambdaCalculus.ts";

var code = "let two = λf λx (f (f x)); (two two)";
var term = L.read(code);
var norm = L.normal(term);
console.log(L.show(norm));
