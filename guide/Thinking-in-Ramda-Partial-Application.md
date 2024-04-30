# Thinking in Ramda: 偏应用（部分应用）

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Partial Application](http://randycoulman.com/blog/2016/06/07/thinking-in-ramda-partial-application/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第三篇。

在[第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/)中，讨论了各种函数组合的方式。最后，演示了 `compose` 和 `pipe`， 可以以 "pipeline" （管道）的形式对一系列函数进行调用。

在上篇文章中，简单的函数链式调用（"pipeline"）时，其中的被调用函数都是一元的（除了首个函数）。但如果要使用多元函数呢？

例如，假设有一个书籍对象的集合，我们想要找到特定年份出版的所有图书的标题。可以使用 Ramda 的集合迭代函数完成该需求：

```js
const publishedInYear = (book, year) => book.year === year
 
const titlesForYear = (books, year) => {
  const selected = filter(book => publishedInYear(book, year), books)
 
  return map(book => book.title, selected)
}
```

如果能将 `filter` 和 `map` 组合成 "pipeline" 就好了，但我们并不知道该如何处理，因为 `filter` 和 `map` 都是二元函数。

如果不需要在 `filter` 中使用箭头函数会更好些。先来解决这个问题，并借此展示一些制作 "pipeline" 的知识。

## 高阶函数

在本系列文章的[第一篇](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8/)中，我们将函数视为 "一等结构"。一等函数可以作为参数传递给其他函数，也可以作为其他函数的返回值。我们一直在使用前者，但还没有见过后者（函数作为其他函数的返回值）。

获取或返回其他函数的函数称为 "高阶函数"。

在上面的示例中，我们传递了一个箭头函数给 `filter`：`book => publishedInYear(book, year)`，但我们想去掉箭头函数。为了做到这点，需要一个函数：输入一本书，若该书是在指定年份出版的则返回 `true`。但还需要一个指定的年份，让该操作更加灵活。

为了解决这个问题，可以将 `publishedInYear` 变为返回另一个函数的函数。我将使用普通的语法来实现该函数，以便能够清晰地展示其内部具体实现，然后使用箭头函数实现一个更短版本的函数：

```js
// Full function version:
function publishedInYear(year) {
  return function(book) {
    return book.year === year
  }
}
 
// Arrow function version:
const publishedInYear = year => book => book.year === year
```

利用新实现的 `publishedInYear`，可以重写 `filter` 调用，从而消除箭头函数：

```js
const publishedInYear = year => book => book.year === year
 
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
 
  return map(book => book.title, selected)
}
```

现在，当调用 `filter` 时，`publishedInYear(year)` 会立即调用，并返回一个接受 `book` 为参数的函数，这正是 `filter` 需要的。

## 部分应用函数

可以按上面的方式重写任何多参数函数。但我们不可能拥有所有我们想要的函数的源码；另外，很多情况下，我们可能还是希望以普通的方式调用多参数函数。

例如，在其他一些代码中，只是想检查一本书是否是在指定年份出版的，我们可能想要 `publishedInYear(book, 2012)`，但现在不能再那么做了。相反，我们必须要用这种方式：`publishedInYear(book)(2012)`。这样做降低了代码的可读性，也很烦人。

幸运的是，Ramda 提供了两个函数：`partial` 和 `partialRight`，来帮我们解决这个问题。

这两个函数可以让我们不必一次传递所有需要的参数，也可以调用函数。它们都返回一个接受剩余参数的新函数，当所有参数都传入后，才会真正调用被包裹的原函数。

`partial` 和 `partialRight` 的区别在于参数传递的顺序：`partial` 先传递原函数左侧的参数，而 `partialRight` 先传递右侧的参数。

回到刚开始的例子，使用上面的一个函数来代替原来对 `publishedInYear` 的重写。由于刚开始我们只需要最右侧的参数：`year`，所以需要使用 `partialRight`.

```js
const publishedInYear = (book, year) => book.year === year
 
const titlesForYear = (books, year) => {
  const selected = filter(partialRight(publishedInYear, [year]), books)
 
  return map(book => book.title, selected)
}
```

如果 `pubilshedInYear` 原本参数的顺序为 `(year, book)` ，而非 `(book, year)` ，则需要用 `partial` 代替 `partialRight`。

注意，为被 `partial` 和 `partialRight` 包裹的函数提供的参数必须包裹在数组中，即使只有一个参数。我不会告诉你我已经忘记了多少次，导致出现令人困惑的错误信息：

```bash
First argument to _arity must be a non-negative integer no greater than ten
```

## 柯里化(Curry)

如果到处使用 `partial` 和 `partialRight` 的话，会让代码变得冗长乏味；但是，将多元函数以一系列一元函数的形式调用同样不好。

幸运的是，Ramda 给我们提供了一个解决方案：`curry`。

[Currying（柯里化）](https://en.wikipedia.org/wiki/Currying) 是函数式编程的另一个核心概念。从技术角度讲，一个柯里化了的函数是一系列高阶一元函数，这也是我刚刚抱怨过的。在纯函数式语言中，柯里化函数在调用时，语法上看起来和调用多个参数没有什么区别。

但由于 Ramda 是一个 JavaScript 库，而 JavaScript 并没有很好的语法来支持一系列一元函数的调用，所以作者对传统柯里化的定义放宽了一些。

在 Ramda 中，一个柯里化的函数只能用其参数的子集来调用，它会返回一个接受其余参数的新函数。当使用它的所有参数调用，真正的原函数将被调用。

柯里化的函数在下列两种情况下工作的都很好：

1. 可以按正常情况下使用所有参数调用它，它可以像普通函数一样正常工作；
2. 也可以使用部分参数来调用它，这时它会像使用 `partial` 一样工作。

注意，这种灵活性带来了一些性能上的损失，因为 `curry` 需要搞清楚函数的调用方式，然后确定该做什么。一般来说，我只有需要在多个地方对同一个函数使用 `partial` 的时候，才会对函数进行柯里化。

接下来写一个柯里化版本的 `publishedInYear` 函数。注意，`curry` 会像 `partial` 一样工作；并且没有 `partialRight` 版本的 `curry` 函数。对这方面后续会有更多讨论，但现在我们需要将 `publishedInYear` 的参数翻转一下，以便让参数 `year` 在最前面。

```js
const publishedInYear = curry((year, book) => book.year === year)
 
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
 
  return map(book => book.title, selected)
}
```

现在可以只使用参数 `year` 来调用 `publishedInYear`，并返回一个新函数，该函数接受参数 `book` 并执行原函数。但是，仍然可以按普通方式对它调用：`publishedInYear(2012, book)`，不需要写烦人的语法 `)(`。所以，柯里化的函数在两种情况下都能很好地工作。

## 参数的顺序

注意，为了让 `curry` 工作，我们不得不对参数的顺序进行翻转。这在函数式编程中非常常见，所以几乎所有的 Ramda 函数都将待处理的数据放到参数列表的最后面。

你可以将先期传入的参数看作对操作的配置。所以，对于 `publishedInYear`，参数 `year` 作为配置（需要查找的年份），而参数 `book` 作为被处理的数据（被查找的对象）。

我们已经在集合迭代函数中见过这样的例子。它们都将集合作为最后一个参数，这样可以使这种风格的编程更容易些。

## 顺序错误的参数

如果不改变 `publishedInYear` 的顺序，还可以继续使用柯里化特性的优势吗？

当然可以了，Ramda 提供了几个选择。

## flip

第一个选择是 `flip`。`flip` 接受一个多元函数（元数 >= 2），返回一个元数相同的新函数，但前 2 个参数的顺序调换了。它主要用于二元函数，但也可以用于一般函数。

使用 `flip`，我们可以恢复 `publishedInYear` 参数的初始的顺序：

```js
const publishedInYear = curry((book, year) => book.year === year)
 
const titlesForYear = (books, year) => {
  const selected = filter(flip(publishedInYear)(year), books)
 
  return map(book => book.title, selected)
}
```

多数情况下，我更喜欢使用方便的参数顺序，但如果用到不能自己掌控的函数，`flip` 是一个好的选择。

## placeholder (占位符)

更通用的选择是使用 "placeholder" 参数（`__`）

假设有一个三元柯里化的函数，并且我们想传入第一个和最后一个参数，中间参数后续再传，应该怎么办呢？我们可以使用 "占位符" 作为中间参数：

```js
const threeArgs = curry((a, b, c) => { /* ... */ })
 
const middleArgumentLater = threeArgs('value for a', __, 'value for c')
```

可以在函数调用中多次使用 "占位符"。例如，如果只想传递中间参数呢？

```js
const threeArgs = curry((a, b, c) => { /* ... */ })
 
const middleArgumentOnly = threeArgs(__, 'value for b', __)
```

也可以使用 "占位符" 代替 `flip`：

```js
const publishedInYear = curry((book, year) => book.year === year)
 
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(__, year), books)
 
  return map(book => book.title, selected)
}
```

我觉得这个版本的可读性更好，但如果需要频繁使用参数顺序翻转的 `publishedInYear`，我可能会使用 `flip` 定义一个辅助函数，然后在任何用到它的地方使用辅助函数。在后续文章中会看到一些示例。 

注意， `__` 仅适用于柯里化的函数，而 `partial`、`partialRight` 和 `flip` 适用于任何函数。如果需要对某个普通函数使用 `__`，可以先用 `curry` 将其包裹起来。

## 来做一条管道（pipeline）

现在看看能否将我们的 `filter` 和 `map` 调用放入 "pipeline" (管道)中？下面是代码当前的状态，使用了方便的参数顺序的 `publishedInYear`：

```js
const publishedInYear = curry((year, book) => book.year === year)
 
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
 
  return map(book => book.title, selected)
}
```

在上一节中，我们了解了 `pipe` 和 `compose`，但我们还需要另一部分信息，以便能够使用上面所学的知识。

缺少的信息是：几乎所有的 Ramda 函数都是默认柯里化的，包括 `filter` 和 `map`。所以 `filter(publishedInYear(year))` 是完全合法的，它会返回一个新函数，该函数等待我们传递 `books` 给它，`map(book => book.title)` 也是如此。

现在可以编写 "pipeline" 了：

```js
const publishedInYear = curry((year, book) => book.year === year)
 
const titlesForYear = (books, year) =>
  pipe(
    filter(publishedInYear(year)),
    map(book => book.title)
  )(books)
```

我们来更进一步，将 `titlesForYear` 的参数顺序也调换一下，这样更符合 Ramda 中待处理数据放在最后的约定。也可以将该函数进行柯里化，以便其在后续的 "pipeline" 中使用。

```js
const publishedInYear = curry((year, book) => book.year === year)
 
const titlesForYear = curry((year, books) =>
  pipe(
    filter(publishedInYear(year)),
    map(book => book.title)
  )(books)
)
```

## 结论

本文可能是这个系列中讲解最深的一篇。部分应用和柯里化可能需要花一些时间和精力来熟悉和掌握。但一旦学会，他们会以一种强大的方式将数据处理变得更加函数式。

它们引导你通过创建包含许多小而简单代码块的 "pipeline" 的方式，来构建数据处理程序。

## 下一节

为了以函数式的方式编写代码，我们需要用 "声明式" 的思维代替 "命令式" 思维。要做到这点，需要找到一种函数式的方式来表示命令式的结构。[声明式编程](Thinking-in-Ramda-Declarative-Programming.md) 将会讨论这些想法。
