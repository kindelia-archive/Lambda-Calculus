Lambda Calculus
===============

Just a simple λ-calculus interpreter in TypeScript.

```typescript
import * as L from "https://raw.githubusercontent.com/Kindelia/Lambda-Calculus/master/src/LambdaCalculus.ts";

var code = "(λf λx (f (f x)) λf λx (f (f x)))";
var term = L.read(code);
var norm = L.normal(term);
console.log(L.show(norm));
```
