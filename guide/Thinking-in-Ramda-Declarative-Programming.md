# Thinking in Ramda: 声明式编程

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Declarative Programming](http://randycoulman.com/blog/2016/06/14/thinking-in-ramda-declarative-programming/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第四篇。

在[第三节](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Partial-Application/)中，讨论了使用 "部分应用" 和 "柯里化" 技术来组合多元（多参数）函数。

当我们开始编写小的函数式构建块并组合它们时，发现必须写好多函数来包裹 JavaScript 操作符，比如算术、比较、逻辑操作符和控制流。这可能比较乏味，但 Ramda 将我们拉了回来，让事情变得有趣起来。

开始之前，先介绍一些背景知识。

## 命令式 vs 声明式

存在很多编程语言分类的方式，如静态语言和动态语言，解释型语言和编译型语言，底层和高层语言等等。

另一种划分的方式是命令式编程和声明式编程。

简单地说，命令式编程中，程序员需要告诉计算机怎么做来完成任务。命令式编程带给我们每天会用到的大量的基本结构：控制流（`if`-`then`-`else` 语句和循环），算术运算符（`+`、`-`、`*`、`/`），比较运算符（`===`、`>`、`<` 等），和逻辑运算符（`&&`、`||`、`!`）。

而声明式编程，程序员只需告诉计算机我想要什么，然后计算机自己理清如何产生结果。

其中一种经典的声明式编程语言是 Prolog。在 Prolog 中，程序是由一组 "facts" (谓词) 和 一组 "rules" (规则) 组成。可以通过提问来启动程序。Prolog 的推理机使用 facts 和 rules 来回答问题。

函数式编程被认为是声明式编程的一个子集。在一段函数式程序中，我们定义函数，然后通过组合这些函数告诉计算机做什么。

即使在声明式程序中，也需要做一些命令式程序中的工作。控制流，算术、比较和逻辑操作仍然是必须使用的基本构建块。但我们需要找到一种声明式的方式来描述这些基本构建块。

## 声明式替换

由于我们使用 JavaScript （一种命令式语言）编程，所以在编写 "普通" JavaScript 代码时，使用标准的命令式结构也是正常的。

但当使用 "pipeline" 或类似的结构编写函数式变换时，命令式的结构并不能很好的工作。

## 算术

在 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/) ，我们实现了一系列算术变换来演示 "pipeline"：

```js
const multiply = (a, b) => a * b
const addOne = x => x + 1
const square = x => x * x
 
const operate = pipe(
  multiply,
  addOne,
  square
)
 
operate(3, 4) // => ((3 * 4) + 1)^2 => (12 + 1)^2 => 13^2 => 169
```
注意我们是如何编写函数来实现我们想要的基本构建块的。

Ramda 提供了 `add`、`subtract`、`multiply` 和 `divide` 函数来替代标准的算术运算符。所以我们可以使用 Ramda 的 `multiply` 来代替我们自己实现的乘法，可以利用 Ramda 的柯里化 `add` 函数的优势来取代我们的 `addOne`，也可以利用 `multiply` 来编写 `square`：

```js
const square = x => multiply(x, x)
 
const operate = pipe(
  multiply,
  add(1),
  square
)
```

`add(1)` 与增量运算符（`++`）非常相似，但 `++` 修改了被操作的值，因此它是 "mutation" 的。正如在 [第一节](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8/) 中所讲，Immutability 是函数式编程的核心原则，所以我们不想使用 `++` 或 `--`。

可以使用 `add(1)` 和 `subtract(1)` 来做递增和递减操作，但由于这两个操作非常常用，所以 Ramda 专门提供了 `inc` 和 `dec`。

所以可以进一步简化我们的 "pipeline"：

```js
const square = x => multiply(x, x)
 
const operate = pipe(
  multiply,
  inc,
  square
)
```

`subtract` 是二元操作符 `-` 的替代，但还有一个表示取反的一元操作符 `-`。我们可以使用 `multiply(-1)`，但 Ramda 也提供了 `negate` 来实现相同的功能。

## Comparison (比较)

还是在 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/)，我们写了一些函数来确定一个人是否有资格投票。该代码的最终版本如下所示：

```js
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18
 
const isCitizen = either(wasBornInCountry, wasNaturalized)
 
const isEligibleToVote = both(isOver18, isCitizen)
```

注意，上面的一些函数使用了标准比较运算符（`===` 和 `>=`）。正如你现在所怀疑的，Ramda 也提供了这些运算符的替代。

我们来修改一下代码：使用 `equals` 代替 `===`，使用 `gte` 替代 `>=`。

```js
const wasBornInCountry = person => equals(person.birthCountry, OUR_COUNTRY)
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => gte(person.age, 18)
 
const isCitizen = either(wasBornInCountry, wasNaturalized)
 
const isEligibleToVote = both(isOver18, isCitizen)
```

Ramda 还提供了其他比较运算符的替代：`gt` 对应 `>`，`lt` 对应 `<`，`lte` 对应 `<=`。

注意，这些函数保持正常的参数顺序（`gt` 表示第一个参数是否大于第二个参数）。这在单独使用时没有问题，但在组合函数时，可能会让人产生困惑。这些函数似乎违反了 Ramda 的 "待处理数据放在最后" 的原则，所以我们在 pipeline 或类似的情况下使用它们时，要格外小心。这时，`flip` 和 占位符 (`__`) 就派上了用场。

除了 `equals`，还有一个 `identical`，可以用来判断两个值是否引用了同一块内存。

`===` 还有一些其他的用途：可以检测字符串或数组是否为空（`str === ''` 或 `arr.length === 0`），也可以检查变量是否为 `null` 或 `undefined`。Ramda 为这两种情况提供了方便的判断函数：`isEmpty` 和 `isNil`。

## Logic (逻辑)

在 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/) 中（参见上面的相关代码）。我们使用 `both` 和 `either` 来代替 `&&` 和 `||` 运算符。我们还提到使用 `complement` 代替 `!`。

当组合的函数作用于同一份输入值时，这些组合函数帮助很大。上述示例中，`wasBornInCountry`、`wasNaturalized` 和 `isOver18` 都作用于同一个人上。

但有时我们需要将 `&&`、`||` 和 `!` 作用于不同的数值。对于这些情况， Ramda 提供了 `and`、`or` 和 `not` 函数。我以下列方式进行分类：`and`、`or` 和 `not` 用于处理数值；`both`、`either` 和 `complement` 用于处理函数。

经常用 `||` 来提供默认值。例如，我们可能会编写如下代码：

```js
const lineWidth = settings.lineWidth || 80
```

这是一个常见的用法，大部分情况下都能正常工作，但依赖于 JavaScript 对 "falsy" 值的定义。假设 `0` 是一个合法的设置选项呢？由于 `0` 是 "falsy" 值，所以我们最终会得到的行宽为 80 。

我们可以使用上面刚学到的 `isNil` 函数，但 Ramda 提供了一个更好的选择：`defaultTo`。

```js
const lineWidth = defaultTo(80, settings.lineWidth)
```

`defaultTo` 检查第二个参数是否为空（`isNil`）。如果非空，则返回该值；否则返回第一个值。

## Conditionals (条件)

控制流在函数式编程中不是必要的，但偶尔也会有些用处。在 [第一节](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8/) 中讨论的集合迭代函数在大部分情况下都可以很好的取代循环，但 "条件" 仍然非常重要。

## ifElse

我们来写一个函数，`forever21`，接受一个年龄，并返回下一个年龄。但正如名字所示，一旦成长到 21 岁，就一直保持这样。

```js
const forever21 = age => age >= 21 ? 21 : age + 1
```

注意，条件（`age >= 21`）和第二个分支（`age + 1`）都可以写作 `age` 的函数。第一个分支（`21`）也可以重写成一个常量函数（`() => 21`）。现在我们有三个接受（或忽略）`age` 为参数的函数。

现在可以使用 Ramda 的 `ifElse` 函数了，这是一个相当于 `if...then...else` 或 `?:` 的函数。

```js
const forever21 = age => ifElse(gte(__, 21), () => 21, inc)(age)
```

如上所示，比较函数在进行组合时，可能并不是以我们想要的形式进行工作。所以在这里被迫引入了占位符（`__`）。我们也可以使用 `lte`：

```js
const forever21 = age => ifElse(lte(21), () => 21, inc)(age)
```

在这种情况下，我们不得不读作："21岁小于或等于给定年龄"。但这样可读性很低、比较乱，所以我坚持使用占位符版本的函数。

## constants (常量)

常量函数在这种情形下非常有用。你可能已经想到了，Ramda 为我们提供了一些便捷的方法。本例中，这个方法是 `always`。

```js
const forever21 = age => ifElse(gte(__, 21), always(21), inc)(age)
```

Ramda 还提供了 `T` 和 `F`，作为 `always(true) 和 always(false)` 的缩写。

## identity (恒等)

再来写一个函数：`alwaysDrivingAge`。该函数接受一个年龄，如果 `gte` 16，则将该年龄返回；但如果小于 16，则返回 16。这样任何人都可以伪造他们的驾驶年龄了，即使他们还没有达到。

```js
const alwaysDrivingAge = age => ifElse(lt(__, 16), always(16), a => a)(age)
```

条件中的第二个分支（`a => a`）是函数式编程中的另一种常见的模式。它被称为恒等函数。也即，输出永远等于输入的函数。

正如你所想的，Ramda 为我们提供了 `identity` 函数。

```js
const alwaysDrivingAge = age => ifElse(lt(__, 16), always(16), identity)(age)
```

`identity` 可以接受多个参数，但总是返回首个参数。如果想要返回除首个参数之外的参数，可以使用更通用的 `nthArg` 函数。但 `nthArg` 不如 `identity` 用的频繁。

## when 和 unless

在 `ifElse` 代码中，其中一个条件分支为 `identity` 也很常见。所以 Ramda 也提供了便捷的方法。

如果像上例所示，第二个分支是 `identity`，可以用 `when` 代替 `ifElse`：

```js
const alwaysDrivingAge = age => when(lt(__, 16), always(16))(age)
```

如果第一个条件分支是 `identity`，可以用 `unless`。借助 `gte(__, 16)` 来翻转一下我们的条件，便可以使用 `unless` 了。

```js
const alwaysDrivingAge = age => unless(gte(__, 16), always(16))(age)
```

## cond

Ramda 还提供了 `cond` 函数，来代替 `switch` 语句或链式的 `if...then...else` 语句。

这里采用 Ramda 文档中的例子来展示 `cond` 的用法：

```js
const water = temperature => cond([
  [equals(0),   always('water freezes at 0°C')],
  [equals(100), always('water boils at 100°C')],
  [T,           temp => `nothing special happens at ${temp}°C`]
])(temperature)
```

我目前还不需要在 Ramda 代码中使用 `cond`。但我很多年前编写过 Common Lisp 代码，所以 `cond` 函数感觉就像是位老朋友。

## 结论

本节中展示了很多将命令式代码转为函数声明式代码的 Ramda 函数。

## 下一节

你可能已经注意到了，最后我们编写的几个函数（`forever21`、`alwaysDrivingAge` 和 `water`）都接受一个参数，构建一个新函数，然后将该函数作用于参数。

这也是一种常见的模式，并且 Ramda 照例提供了一些简化这些代码的便捷方法。下一节中，[Pointfree Style](Thinking-in-Ramda-Pointfree-Style.md) 将演示如何简化符合这种模式的代码。
