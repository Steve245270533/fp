# Thinking in Ramda: 无参数风格编程 (Pointfree Style)

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Pointfree Style](http://randycoulman.com/blog/2016/06/21/thinking-in-ramda-pointfree-style/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第五篇。

在[第四节](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Declarative-Programming/)中，我们讨论了如何用声明式编程（告诉计算机做什么，我们想要什么）代替命令式编程（告诉计算机该怎么做，详细的执行步骤）来编写代码。

你可能已经注意到了，我们编写的几个函数（如 `forever21`、`alwaysDrivingAge`、`water`）都接受一个参数，构建一个新函数，然后将该函数作用于该参数。

这是函数式编程里非常常见的一种模式，Ramda 同样提供了优化这种模式的方法。

## Pointfree 风格（无参数风格）

我们在 [第三节](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Partial-Application/) 中讨论了 Ramda 的两个指导原则：

* 将数据放到参数列表的最后面。
* 柯里化所有的东西。

这两个原则衍生出了一种被函数式程序员称为 "pointfree" 的风格。我喜欢将 pointfree 的代码看作："数据？什么数据？这里没有数据！"

有一篇很好的博客：[Why Ramda?](http://fr.umio.us/why-ramda/)，展示了 pointfree 风格 真得不错。具体来说，它有一些有趣的标题，例如："数据在哪里？"，"好了，已经有了！"，"那么我可以看看数据吗？" 和 "拜托，我只是想要我的数据"。

我们还没有使用需要的工具来让所有的例子都变成完全 "pointfree" 的，现在就开始吧。

再看一下 `forever21`：

```js
const forever21 = age => ifElse(gte(__, 21), always(21), inc)(age)
```

注意，参数 `age` 出现了两次：一次在参数列表中；一次在函数的最后面：我们将由 `ifElse` 返回的新函数作用于 `age`。

在使用 Ramda 编程时稍加留意，就会发现很多这种模式的代码。这也意味着，总应该有一种方法将这些函数转成 "pointfree" 风格。

我们来看看这会是什么样子：

```js
const forever21 = ifElse(gte(__, 21), always(21), inc)
```

嘭~~！我们刚刚让 `age` 消失了。这就是 Pointfree 风格。注意，这两个版本所做的事情完全一样。我们仍然返回一个接受年龄的函数，但并未显示的指定 `age` 参数。

可以对 `alwaysDrivingAge` 和 `water` 进行相同的处理。

原来的 `alwaysDrivingAge` 如下所示：

```js
const alwaysDrivingAge = age => ifElse(lt(__, 16), always(16), identity)(age)
```

可以使用相同的方法使其变为 pointfree 的。

```js
const alwaysDrivingAge = when(lt(__, 16), always(16))
```

下面是 `water` 原来的形式：

```js
const water = temperature => cond([
  [equals(0),   always('water freezes at 0°C')],
  [equals(100), always('water boils at 100°C')],
  [T,           temp => `nothing special happens at ${temp}°C`]
])(temperature)
```

现在将其变为 pointfree 风格的：

```js
const water = cond([
  [equals(0),   always('water freezes at 0°C')],
  [equals(100), always('water boils at 100°C')],
  [T,           temp => `nothing special happens at ${temp}°C`]
])
```

## 多元函数（多参数函数）

如果函数接受多个参数会怎样呢？回顾一下 [第三节](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Partial-Application/) 中的例子：`titlesForYear`。

```js
const titlesForYear = curry((year, books) =>
  pipe(
    filter(publishedInYear(year)),
    map(book => book.title)
  )(books)
)
```

注意，`books` 出现了两次：一次作为参数列表的最后一个参数（最后一个数据！）；一次出现在函数最后，当我们将其传入 pipeline 的时候。这跟我们之前看到参数为 `age` 的模式类似，所以可以对它进行相同的转换：

```js
const titlesForYear = year =>
  pipe(
    filter(publishedInYear(year)),
    map(book => book.title)
  )
```

可以了！我们现在有了一个 pointfree 版本的 `titlesFroYear`。

其实，这种情况下，我可能不会刻意追求 pointfree 风格，因为就像之前文章讨论过的：JavaScript 在调用一系列单参数函数方面并不方便。

在 pipeline 中使用 `titleForYear` 是很方便，如我们可以很轻松的调用 `titlesForYear(2012)`，但当想要单独使用它时，我们就不得不回到之前文章里看到的形式 `)(`，对我而言，并不值得做出这种妥协（没必要为了 pointfree 而 pointfree）。

但只要有如上形式的单参数函数（或者可能以后会被重构），我几乎总是写成 pointfree 风格的。

## 重构为 pointfree 风格的代码

有时我们的代码不会遵循这种模式。我们可能会在同一函数内多次对数据进行操作。

在 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/) 的几个例子中便是这种情形。我们使用诸如 `both`、`either`、`pipe`、`compose` 来重构代码。一旦我们这样做了，便会很容易让函数转换为 pointfree 风格的。

我们来回顾一下 `isEligibleToVote` 这个例子，代码如下：

```js
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18
 
const isCitizen = person => wasBornInCountry(person) || wasNaturalized(person)
 
const isEligibleToVote = person => isOver18(person) && isCitizen(person)
```

先从 `isCitizen` 开始。它接受一个 `person`, 然后将两个函数作用于该 `person`，将结果使用 `||` 组合起来。正如在 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/) 中学到的，可以使用 `either` 将两个函数组合成一个新函数，然后将该组合函数作用于该 `person`。

```js
const isCitizen = person => either(wasBornInCountry, wasNaturalized)(person)
```

可以使用 `both` 对 `isEligibleToVote` 做类似的处理。

```js
const isEligibleToVote = person => both(isOver18, isCitizen)(person)
```

现在我们已经完成了这些重构，可以看到，这两个函数都遵循上面提到的模式：`person` 出现了两次，一次作为函数参数；一次放到最后，将组合函数作用其上。现在可以将它们重构为 pointfree 风格的代码：

```js
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

## 为什么要这么做？

Pointfree 风格需要一定的时间才能习惯。可能并不需要所有的地方都没有参数。有时候知道某些 Ramda 函数需要多少参数，也是很重要的。

但是，一旦习惯了这种方式，它将变得非常强大：可以以非常有趣的方式将很多小的 pointfree 函数组合起来。

Pointfree 风格的优点是什么呢？人们可能会认为，这只不过是为了让函数式编程赢得 "优点徽章" 的学术活动而已（实际上并没有什么用处）。然而，我认为还是有一些优点的，即使需要花一些时间来习惯这种方式也是值得的：

* 它让编程更简单、精练。这并不总是一件好事，但大部分情况下是这样的。
* 它让算法更清晰。通过只关注正在组合的函数，我们可以在没有参数的干扰下，更好地了解发生了什么。
* 它促使我们更专注于正在做的转换的本身，而不是正被转换的数据。
* 它可以帮助我们将函数视为可以作用于不同数据的通用构建模块，而非对特定类型数据的操作。如果给数据一个名字，我们的思想便会被[禁锢](https://en.wikipedia.org/wiki/Anchoring)在："需要在哪里使用我们的函数"；如果去掉参数，便会使我们更有创造力。

## 结论

Pointfree 风格也被成为 [tacit 式编程](https://en.wikipedia.org/wiki/Tacit_programming)(隐含式编程)，可以使代码更清晰、更易于理解。通过代码重构将所有的转换组合成单一函数，我们最终会得到可以在更多地方使用的更小的构建块（函数）。

## 下一节

在当前示例中，我们尚未将所有代码都重构为 pointfree 的风格。还有一些代码是命令式的。大部分这种代码是处理对象和数组的。

我们需要找到声明式的方式来处理对象和数组。Immutability (不变性) 怎么样？我们如何以 "不变" (immutable) 的方式来操作对象和数组呢？

本系列的下一节，[数据不变性和对象](Thinking-in-Ramda-Immutability-and-Objects.md) 将讨论如何以函数式和 immutable 的方式来处理对象。紧随其后的章节：[数据不变性和数组](Thinking-in-Ramda-Immutability-and-Arrays.md) 对数组也是相同的处理方式。
