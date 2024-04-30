# Thinking in Ramda: 函数组合

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Combining Functions](http://randycoulman.com/blog/2016/05/31/thinking-in-ramda-combining-functions/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第二篇。

在[第一节](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8/)中，介绍了 Ramda 和函数式编程的一些基本思想，如函数、纯函数和数据不变性。并介绍了如何入门：可以从集合迭代函数（如 `forEach`、`map`、`reduce`）开始。

## 简单组合

一旦熟悉了可以将函数传递给其他函数，你可能会开始找将多个函数组合在一起的场景。

Ramda 为简单的函数组合提供了一些函数。我们来看看。

## Complement

在上一节，我们使用 `find` 来查找列表中的首个偶数。

```js
const isEven = x => x % 2 === 0
find(isEven, [1, 2, 3, 4]) //=> 2 
```

如果想找首个奇数呢？我们可以随手写一个 `isOdd` 函数并使用它。但我们知道任何非偶整数都是奇数，所以可以重用 `isEven` 函数。

Ramda 提供了一个更高阶的函数：`complement`，给它传入一个函数，返回一个新的函数：当原函数返回 "假值" 时，新函数返回 `true`；原函数返回 "真值" 时，新函数返回 `false`，即新函数是原函数的补函数。

```js
const isEven = x => x % 2 === 0
 
find(complement(isEven), [1, 2, 3, 4]) // --> 1
```

更进一步，可以给 `complement` 过的函数起个名字，这样新函数便可以复用：

```js
const isEven = x => x % 2 === 0
const isOdd = complement(isEven)
 
find(isOdd, [1, 2, 3, 4]) // --> 1
```

注意，`complement` 以函数的方式实现了逻辑非操作（`!`， not）的功能。

`Both/Either`

假设我们正在开发一个投票系统，给定一个人，我们希望能够确定其是否有资格投票。根据现有知识，一个人必须年满 18 岁并且是本国公民，才有资格投票。成为公民的条件：在本国出生，或者后来加入该国国籍。

```js
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18
 
const isCitizen = person => wasBornInCountry(person) || wasNaturalized(person)
 
const isEligibleToVote = person => isOver18(person) && isCitizen(person)
```

上面代码实现了我们的需求，但 Ramda 提供了一些方便的函数，以帮助我们精简代码。

`both` 接受两个函数，返回一个新函数：当两个传入函数都返回 `truthy` 值时，新函数返回 `true`，否则返回 `false`

`either` 接受两个函数，返回一个新函数：当两个传入函数任意一个返回 `truthy` 值时，新函数返回 `true`，否则返回 `false`

我们可以使用这两个函数来简化 `isCitizen` 和 `isEligibleToVote`。
```js
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```
注意，`both` 以函数的方式实现了逻辑与（`&&`）的功能，`either` 实现了逻辑或（`||`）的功能。

Ramda 还提供了 `allPass` 和 `anyPass`，接受由任意多个函数组成的数组作为参数。如名称所示，`allPass` 类似于 `both`，而 `anyPass` 类似于 `either`。

## Pipelines(管道)

有时我们需要以 pipeline 的方式将多个函数依次作用于某些数据。例如，接受两个数字，将它们相乘，加 1 ，然后平方。我们可以这样写：

```js
const multiply = (a, b) => a * b
const addOne = x => x + 1
const square = x => x * x
 
const operate = (x, y) => {
  const product = multiply(x, y)
  const incremented = addOne(product)
  const squared = square(incremented)
 
  return squared
}
 
operate(3, 4) // => ((3 * 4) + 1)^2 => (12 + 1)^2 => 13^2 => 169
```

注意，每次操作是对上次操作的结果进行处理。

## pipe

Ramda 提供了 `pipe` 函数：接受一系列函数，并返回一个新函数。

新函数的元数与第一个传入函数的元数相同（元数：接受参数的个数），然后顺次通过 "管道" 中的函数对输入参数进行处理。它将第一个函数作用于参数，返回结果作为下一个函数的入参，依次进行下去。"管道" 中最后一个函数的结果作为 `pipe` 调用的最终结果。

注意，除首个函数外，其余的函数都是一元函数。

了解这些后，我们可以使用 `pipe` 来简化我们的 `operate` 函数：

```js
const operate = pipe(
  multiply,
  addOne,
  square
)
```

当调用 `operate(3, 4)` 时，`pipe` 将 `3` 和 `4` 传给 `multiply` 函数，输出 `12`，然后将 `12` 传给 `addOne`，返回 `13`，然后将 `13` 传给 `square`，返回 `169`，并将 `169` 作为最终 `operate` 的最终结果返回。

## compose

另一种编写原始 `operate` 函数的方式是内联所有暂时变量：

```js
const operate = (x, y) => square(addOne(multiply(x, y)))
```

这样更紧凑，但也更不便于阅读。然而这种形式可以使用 Ramda 的 `compose` 函数进行重写。

`compose` 的工作方式跟 `pipe` 基本相同，除了其调用函数的顺序是从右到左，而不是从左到右。下面使用 `compose` 来重写 `operate`：

```js
const operate = compose(
  square,
  addOne,
  multiply
)
```

这与上面的 `pipe` 几乎一样，除了函数的顺序是相反的。实际上，Ramda 中的 `compose` 函数的内部是用 `pipe` 实现的。

我一直这样思考 `compose` 的工作方式：`compose(f, g)(value)` 等价于 `f(g(value))`。

注意，与 `pipe` 类似，`compose` 中的函数除最后一个外，其余都是一元函数。

## compose 还是 pipe？

具有命令式编程背景的人可能觉得 `pipe` 更容易理解，因为可以按照从左往右的顺序进行阅读。但 `compose` 更容易对如上所示的嵌套函数进行转换。

我也不太清楚什么时候该用 `compose`，什么时候该用 `pipe`。由于它们在 Ramda 中基本等价，所以选择用哪个可能并不重要。只要根据自己的情况选择合适的即可。

## 结论

通过特定的方式进行函数组合，我们已经可以开始编写更强的函数了。

## 下一节

你可能已经注意到了，在进行函数组合时，我们多数情况下都可以省略函数参数。只有在最终调用组合好的函数时，才传入参数。

这在函数式编程中非常常见，我们将在下一节 [`Partial Application` (部分应用)](Thinking-in-Ramda-Partial-Application.md)进行更多详细介绍。我们还会讨论如何组合多元（多参数）函数。
