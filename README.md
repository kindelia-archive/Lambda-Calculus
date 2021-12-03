Lambda Calculus
===============

Just a simple λ-calculus interpreter in TypeScript.

```
import * as L from "LambdaCalculus.ts";

var code = "(λf λx (f (f x)) λf λx (f (f x)))";
var term = L.read(code);
var norm = L.normal(term);
console.log(L.show(norm));
```
