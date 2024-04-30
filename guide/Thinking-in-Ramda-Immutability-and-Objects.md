# Thinking in Ramda: 数据不变性和对象

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Immutability and Objects](http://randycoulman.com/blog/2016/06/28/thinking-in-ramda-immutability-and-objects/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第六篇。

在 [第五节](https://adispring.coding.me/2017/06/13/Thinking-in-Ramda-Pointfree-Style/) 中，我们讨论了如何以 "pointfree" 或 "tacit" 风格来编写函数：函数的参数不会显式的出现。

那时候，因为缺少一些工具，我们还无法将所有的函数转换为 "pointfree" 的风格。现在我们就来学习这些工具。

## 读取对象属性

再来回顾一下 [第五节](https://adispring.coding.me/2017/06/13/Thinking-in-Ramda-Pointfree-Style/) 已经重构过的 "合格选民" 的例子：

```js
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18
 
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

如上所示，我们已经将 `isCitizen` 和 `isEligibleToVote` 变为 "pointfree" 风格的了，但前三个函数还没有 "pointfree" 化。

正如 [第四节](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Declarative-Programming/) 所学，可以使用 `equals` 和 `gte` 来让函数更 "声明式" 一些。我们就此开始：

```js
const wasBornInCountry = person => equals(person.birthCountry, OUR_COUNTRY)
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => gte(person.age, 18)
```

为了让这些函数变为 "pointfree" 的，需要一种方法来使构建出来的函数的 `person` 参数排在参数列表的最后。问题是，我们需要访问 `person` 的属性，现有唯一的方法却是命令式的。

## prop

幸运的是， Ramda 为我们提供了访问对象属性的辅助函数：`prop`。

使用 `prop`，可以将 `person.birthCountry` 转换为 `prop('birthCountry', person)`。现在来试试。

```js
const wasBornInCountry = person => equals(prop('birthCountry', person), OUR_COUNTRY)
const wasNaturalized = person => Boolean(prop('naturalizationDate', person))
const isOver18 = person => gte(prop('age', person), 18)
```

哇！现在看起来更糟了，还需要继续重构。首先，需要交换传递给 `equals` 的参数的顺序，这样可以将 `prop` 放到最后。`equals` 在任意顺序下都能正常工作。

```js
const wasBornInCountry = person => equals(OUR_COUNTRY, prop('birthCountry', person))
const wasNaturalized = person => Boolean(prop('naturalizationDate', person))
const isOver18 = person => gte(prop('age', person), 18)
```

接下来，使用 `equals` 和 `gte` 的柯里化特性来创建新函数，新函数可以作用于 `prop` 输出的结果上。

```js
const wasBornInCountry = person => equals(OUR_COUNTRY)(prop('birthCountry', person))
const wasNaturalized = person => Boolean(prop('naturalizationDate', person))
const isOver18 = person => gte(__, 18)(prop('age', person))
```

还是不太好，还需要继续优化。我们继续利用柯里化的特性来优化 `prop` 的调用。

```js
const wasBornInCountry = person => equals(OUR_COUNTRY)(prop('birthCountry')(person))
const wasNaturalized = person => Boolean(prop('naturalizationDate')(person))
const isOver18 = person => gte(__, 18)(prop('age')(person))
```

又变糟了。但现在我们看到了一种熟悉的模式，所有的三个函数都具有相同的形式：`g(f(person))`。由 [第二节](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions) 可知，这等价于 `compose(g, f)(person)`。

我们来利用这一点。

```js
const wasBornInCountry = person => compose(equals(OUR_COUNTRY), prop('birthCountry'))(person)
const wasNaturalized = person => compose(Boolean, prop('naturalizationDate'))(person)
const isOver18 = person => compose(gte(__, 18), prop('age'))(person)
```

现在好一些了，三个函数的形式变成了 `person => f(person)`。由 [第五节](https://adispring.coding.me/2017/06/13/Thinking-in-Ramda-Pointfree-Style) 可知，现在可以将这三个函数写成 "pointfree" 的了。

```js
const wasBornInCountry = compose(equals(OUR_COUNTRY), prop('birthCountry'))
const wasNaturalized = compose(Boolean, prop('naturalizationDate'))
const isOver18 = compose(gte(__, 18), prop('age'))
```

未重构前，并不能明显看出我们的方法是在做两件事情。它们都先访问对象的属性，然后对该属性的值进行一些操作。重构为 "pointfree" 风格后，程序的表意变得清晰了许多。

我们来展示更多 Ramda 处理对象的函数。

## pick

`prop` 用来读取并返回对象的单个属性，而 `pick` 读取对象的多个属性，然后返回有这些属性组成的新对象。

例如，如果想同时获取一个人的名字和年龄，可以使用：`pick(['name', 'age'], person)`。

## has

在不读取属性值的情况下，想知道对象中是否包含该属性，可以使用 `has` 来检测对象是否拥有该属性，如 `has('name' ,person)`；还可以使用 `hasIn` 来检测原型链上的属性。

## path

`prop` 用来读取对象的属性，`path` 可以读取对象的嵌套属性。例如，我们可以从更深层的结构中访问邮编：`path(['address', 'zipCode'], person)`。

注意，`path` 容错性更强。如果路径上的任意属性为 `null` 或 `undefined`，则 `path` 返回 `undefined`，而 `prop` 会引发错误。

## propOr / pathOr

`propOr` 和 `pathOr` 像是 `prop`/`path` 与 `defaultTo` 的组合。如果在目标对象中找不到属性或路径的值，它们允许你提供默认值。

例如，当我们不知道某人的姓名时，可以提供一个占位符：`propOr('<Unnamed>', 'name', person)`。注意，与 `prop` 不同，如果 `person` 为 `null` 或 `undefined` 时，`propOr` 不会引发错误，而是会返回一个默认值。

## keys / values

`keys` 返回一个包含对象中所有属性名称的数组。`values` 返回这些属性的值组成的数组。当与 [第一节](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8) 中提到集合迭代函数结合使用时，这两个函数会非常有用。

## 对属性增、删、改、查

现在已经有很多对对象进行声明式读取的函数，但如果想要进行更改操作呢？

由于数据不变性很重要，我们不想直接更改对象。相反，我们想要更改后形成的新对象。

Ramda 再次为我们提供了很多辅助函数。

## assoc / assocPath

在命令式编程时，可以使用赋值操作符设置或更改一个人的名字：`person.name = 'New name'`。

在函数式、数据不变的世界里，可以使用 `assoc` 来代替：`const updatedPerson = assoc('name', 'New name', person)`。

`assoc` 返回一个添加或修改属性的新对象，原对象保持不变。

还有用于更新嵌套属性的方法：`assocPath`：`const updatedPerson = assocPath(['address', 'zipcode'], '97504', person)`。

## dissoc / dissocPath / omit

如何删除属性呢？我们可能想删除 `person.age` 。在 Ramda 中，可以使用 `dissoc`：`const updatedPerson = dissoc('age', person)`。

`dissocPath` 类似于 `dissoc`，但可以作用于对象的嵌套属性：`dissocPath(['address', 'zipCode'], person)`。

还有一个 `omit`，用于一次删除多个属性。`const updatedPerson = omit(['age', 'birthCountry'], person)`。

注意，`pick` 与 `omit` 的操作很像，两者是互补的关系。它们能辅助实现白名单（使用 `pick` 保留想要的属性集）和黑名单（使用 `omit` 删除不想要的属性集）的功能。

## 属性转换

我们现在已经知道如何利用声明式和数据不变性的方式来处理对象。我们来写一个函数：`celebrateBirthday`，在生日当前更新他的年龄。

```js
const nextAge = compose(inc, prop('age'))
const celebrateBirthday = person => assoc('age', nextAge(person), person)
```

这是一种很常见的模式。如上所示，我们并不想用给定的新值覆盖已有属性值，而是想通过函数作用于属性的旧值来对其进行转换。

就目前已知的方法，我尚未找到一种以更少重复代码和 pointfree 的形式来优化该段代码的方式。

Ramda 使用 `evolve` 方法再次拯救了我们。我在 [之前的文章](http://randycoulman.com/blog/2016/02/16/using-ramda-with-redux/) 中也提到过 `evolve`。

`evolve` 接受一个对象，其中包含对每个需要转换属性的转换函数。我们来使用 `evolve` 来重构 `celebrateBirthday`：

```js
const celebrateBirthday = evolve({ age: inc })
```

这段代码通过将 `evolve` 参数对象属性对应的函数作用于被变换对象相同属性值上，来转换已有对象的属性。本例中使用 `inc` 对 `person` 的 `age` 属性进行加 1 操作，并返回 `age` 更新后的新 `person` 对象。

`evolve` 可以一次转换多个属性，还可以进行嵌套转换。"转换函数对象"（包含转换函数的对象）与被转换对象具有基本相同的结构，`evolve` 会递归地遍历这两个对象，然后将转换函数作用于对应的属性值上。

注意，`evolve` 不会添加新属性，如果为目标对象不存在的属性指定转换函数，`evolve` 会将其忽略。

`evolve` 已经很快成为我编程时的主力。

## 合并对象

有时，需要合并两个对象。一种常见的情形是当使用含有 "options" 配置项的函数时，常常需要将这些配置项与一组默认配置项进行组合。Ramda 为此提供了 `merge` 方法。

```js
function f(a, b, options = {}) {
  const defaultOptions = { value: 42, local: true }
  const finalOptions = merge(defaultOptions, options)
}
```

`merge` 返回一个包含两个对象的所有属性和值的新对象。如果两个对象具有相同的属性，则采用第二个对象参数的属性值。

在单独使用 `merge` 时，采用第二个参数的属性值作为最终值是非常有用的；但在 pipeline 中可能没什么用。在 pipeline 中，通常会对一个对象进行一系列转换，其中一个转换是合并一些新的属性值到对象中。这种情况，可能需要第一个参数中的属性值作为最终值。

如果只是在 pipeline 中简单地使用 `merge(newValues)`，可能不会得到你想要的结果。

对于这种情况，我通常会定义一个辅助函数 `reverseMerge`：`const reverseMerge = flip(merge)`。回想一下，`flip` 会翻转函数前两个参数的位置。

`merge` 执行的是浅合并。如果被合并的对象存在属性值为对象的属性，子对象并不会继续嵌套合并。如果想递归地进行 "深合并"，可以使用 Ramda 的 `mergeDeep` 系列函数。（译者注：作者在写这篇文章时，Ramda 还没有 `mergeDeep` 系列函数，`mergeDeep` 系列函数是在 v0.24.0 中加入的）

注意，`merge` 只接受两个参数。如果想要将多个对象合并为一个对象，可以使用 `mergeAll`，它接受一个需要被合并对象的数组作为参数。

## 结论

本文展示了 Ramda 中一系列很好的以声明式和数据不变方式处理对象的方法。我们现在可以对对象进行增、删、改、查，而不会改变原有的对象。并且也可以在组合函数时使用这些方法来做这些事情。

## 下一节

现在可以以 Immutable 的方式处理对象，那么数组呢？[数据不变性和数组](Thinking-in-Ramda-Immutability-and-Arrays.md) 将演示对数组的处理。

