# Thinking in Ramda: 入门

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Getting Started](http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第一篇。

本系列文章使用 [Ramda](http://ramda.cn) JavaScript 库进行演示。许多理论、方法同样适用于其他函数式 JavaScript 库，如 [Underscore](http://underscorejs.org/) 和 [Lodash](https://lodash.com/)。

我将尽量用通俗、非学术性的语言演示函数式编程。一方面想让更多的人理解该系列文章；另一方面本人在函数式编程方面造诣尚浅。

## Ramda

我已经在博客中多次提到过 [Ramda](http://ramda.cn) JavaScript 库：

* 在 [Using Ramda With Redux](http://randycoulman.com/blog/2016/02/16/using-ramda-with-redux/) 中，展示了在编写 [Redux](http://redux.js.org/) 应用程序时如何运用 Ramda 的例子。
* 在 [Using Redux-api-middleware With Rails](http://randycoulman.com/blog/2016/04/19/using-redux-api-middleware-with-rails/) 中，我使用 Ramda 来转换请求和响应的数据。

我发现 Ramda 是一个精心设计的库：包含许多 API ，来简洁、优雅进行 JavaScript 函数式编程。

如果你想在阅读本系列文章时进行 Ramda 实验，Ramda 网站有一个 [repl 运行环境](http://ramda.cn/repl/) 。

## 函数

正如名字所示，函数式编程与函数有很大的关系。为了演示，我们定义一个函数为一段可重用的代码：接受 0 到多个参数，返回单个值。

下面是一个简单的 JavaScript 函数：

```js
function double(x) {
  return x * 2
}
```

使用 ES6 箭头函数，可以以更简洁的方式实现相同的函数。现在就提一下，是因为在接下来会大量用到箭头函数：

```js
const double = x => x * 2
```

几乎每种语言都会支持函数调用。

有些语言更进一步，将函数视为一等公民：可以像使用普通类型的值的方式使用函数。例如：

* 使用变量或常量引用函数
* 将函数作为参数传递给其他函数
* 将函数作为其他函数的返回值

JavaScript 就是一种这样的语言，我们将利用它的这一优势进行编程。

## 纯函数

在进行函数式编程时，使用所谓的 "纯" 函数进行工作将变得非常重要。

[纯函数](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html)是没有副作用的函数。它不会给任何外部变量赋值，不会获取输入，不会产生 "输出"，不会对数据库进行读写，不会修改输入参数等。

纯函数的基本思想是：相同的输入，永远会得到相同的输出。

当然可以用非纯函数编程（而且这也是必须的，如果想让程序做任何有趣的事情），但在大多数情况下，需要保持大部分函数是纯函数。（译者注：并不是说，要禁止使用一切副作用，而是说，要让它们在可控的范围内发生）

## IMMUTABILITY

函数式编程的另一个重要概念是 "Immutability"。什么意思呢？"Immutability" 是指 "数据不变性"。

当以 immutable 方式工作时，一旦定义了某个值或对象，以后就再也不会改变它了。这意味着不能更改已有数组中的元素或对象中的属性。

如果想改变数组或对象中的元素时，需要返回一份带有更改值的新拷贝。后面文章将会对此做详细介绍。

Immutability 和 纯函数息息相关。由于纯函数不允许有副作用，所以不允许更改函数体外部的数据结构。纯函数强制以 immutable 的方式处理数据。

## 从哪里开始呢？

开始以函数式思维思考最简单的方式是，使用集合迭代函数代替循环。

如果用过具备这些特性的其他语言（如 Ruby、Smalltalk），你可能已经熟悉了这些特性。

Martin Fowler 有几篇关于 "Collection PipeLines" 非常好的文章，展示了[如何使用这些函数](https://martinfowler.com/articles/collection-pipeline/) 以及[如何将现有代码重构为 collection pipelines](https://martinfowler.com/articles/refactoring-pipelines.html)。

注意，所有这些函数 `Array.prototype` 都有（除了 `reject`）。因此不需要 Ramda 也可以使用它们。但是，为了保持和本系列其他文章一致，本文将使用 Ramda 版本的函数。

## foreach

不必写显式的循环，而是用 `forEach` 函数代替循环。示例如下：

```js
// Replace this:
for (const value of myArray) {
  console.log(value)
}
 
// with:
forEach(value => console.log(value), myArray)
```

`forEach` 接受一个函数和一个数组，然后将函数作用于数组的每个元素。

虽然 `forEach` 是这些函数中最简单的，但在函数式编程中它可能是最少用到的一个。`forEach` 没有返回值，所以只能用在有副作用的函数调用中。

## map

下一个要学习的最重要的函数是 `map`。类似于 `forEach`，`map` 也是将函数作用于数组的每个元素。但与 `forEach` 不同的是，`map` 将函数的每个返回值组成一个新数组，并将其返回。示例如下：

```js
map(x => x * 2, [1, 2, 3]) //=> [2, 4, 6]
```

这里使用了匿名函数，但我们也可以在这里使用具名函数：

```js
const double = x => x * 2
map(double, [1, 2, 3])
```

## filter/reject

接下来，我们来看看 `filter` 和 `reject`。就像名字所示，`filter` 会根据断言函数的返回值从数组中选择元素，例如：

```js
const isEven = x => x % 2 === 0
filter(isEven, [1, 2, 3, 4]) //=> [2, 4]
```

`filter` 将断言函数（本例中为 `isEven`）作用于数组中的每个元素。每当断言函数返回 "真值" 时，相应的元素将包含到结果中；反之当断言函数返回为 "falsy" 值时，相应的元素将从结果数组中排除掉（过滤掉）。

`reject` 是 `filter` 的补操作。它保留使断言函数返回 "falsy" 的元素，排除使断言函数返回 "truthy" 的元素。

```js
reject(isEven, [1, 2, 3, 4]) //=> [1, 3]
```

## find

`find` 将断言函数作用于数组中的每个元素，并返回第一个使断言函数返回真值的元素。

```js
find(isEven, [1, 2, 3, 4]) //=> 2 
```

## reduce

`reduce` 比之前遇到的其他函数要复杂一些。了解它是值得的，但如果刚开始不太好理解，不要被它挡住。你可以在理解它之前继续学习其他知识。

`reduce` 接受一个二元函数(`reducing function`)、一个初始值和待处理的数组。

归约函数的第一个参数称为 "accumulator" (累加值)，第二个参数取自数组中的元素；返回值为一个新的 "accumulator"。

先来看一个示例，然后看看会发生什么。

```js
const add = (accum, value) => accum + value

reduce(add, 5, [1, 2, 3, 4]) //=> 15
```

1. `reduce` 首先将初始值 `5` 和 数组中的首个元素 `1` 传入归约函数 `add`，`add` 返回一个新的累加值：`5 + 1 = 6`。
2. `reduce` 再次调用 `add`，这次使用新的累加值 `6` 和 数组中的下一个元素 `2` 作为参数，`add` 返回 `8`。
3. `reduce` 再次使用 `8` 和 数组中的下个元素 `3` 来调用 `add`，输出 `11`。
4. `reduce` 最后一次调用 `add`，使用 `11` 和 数组中的最后一个元素 `4` ，输出 `15`。
5. `reduce` 将最终累加值 `15` 作为结果返回。

## 结论

从这些集合迭代函数开始，需要逐渐习惯将函数传入其他函数的编程方式。你可能在其他语言中用过，但没有意识到正在做函数式编程。

## 下一节

本系列的下一篇文章，[函数组合](Thinking-in-Ramda-Combining-Functions.md) 将演示怎样以新的、有趣的方式对函数进行组合。
