# Thinking in Ramda: 透镜（Lenses）

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Lenses](http://randycoulman.com/blog/2016/07/12/thinking-in-ramda-lenses/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第八篇。

在 [第六节](https://adispring.coding.me/2017/06/16/Thinking-in-Ramda-Immutability-and-Objects/)  和 [第七节](https://adispring.coding.me/2017/06/17/Thinking-in-Ramda-Immutability-and-Arrays/) 中，我们学习了如何以声明式和不变式来读取、更新和转换对象的属性和数组的元素。

Ramda 提供了一个更通用的工具：透镜（lens），来进行这些操作。

## 什么是透镜？

透镜将 "getter" 和 "setter" 函数组合为一个单一模块。Ramda 提供了一系列配合透镜一起工作的函数。

可以将透镜视为对某些较大数据结构的特定部分的聚焦、关注。

## 如何创建透镜

在 Ramda 中，最常见的创建透镜的方法是 `lens` 函数。`lens` 接受一个 "getter" 函数和一个 "setter" 函数，然后返回一个新透镜。

```js
const person = {
  name: 'Randy',
  socialMedia: {
    github: 'randycoulman',
    twitter: '@randycoulman'
  }
}
 
const nameLens = lens(prop('name'), assoc('name'))
const twitterLens = lens(
  path(['socialMedia', 'twitter']),
  assocPath(['socialMedia', 'twitter'])
)
```

这里使用 `prop` 和 `path` 作为 "getter" 方法；`assoc` 和 `assocPath` 作为 "setter" 方法。

注意，上面实现不得不重复传递属性和路径参数给 "getter" 和 "setter" 方法。幸运的是，Ramda 为最常见类型的透镜提供了便捷方法：`lensProp`、`lensPath` 和 `lensIndex`。

* `LensProp`：创建关注对象某一属性的透镜。
* `lensPath`: 创建关注对象某一嵌套属性的透镜。
* `lensIndex`: 创建关注数组某一索引的透镜。

可以用 `lensProp` 和 `lensPath` 来重写上述示例：

```js
const nameLens = lensProp('name')
const twitterLens = lensPath(['socialMedia', 'twitter'])
```

这样便摆脱了向 "getter" 和 "setter" 重复输入两次相同参数的烦扰，变得简洁多了。在实际工作中，我发现我几乎从来不需要使用通用的 `lens` 函数。

## 我能用它做什么呢？

我们创建了一些透镜，可以用它们做些什么呢？

Ramda 提供了三个配合透镜一起使用的的函数：

* `view`：读取透镜的值。
* `set`：更新透镜的值。
* `over`：将变换函数作用于透镜。

```js
view(nameLens, person) // => 'Randy'
 
set(twitterLens, '@randy', person)
// => {
//   name: 'Randy',
//   socialMedia: {
//     github: 'randycoulman',
//     twitter: '@randy'
//   }
// }
 
over(nameLens, toUpper, person)
// => {
//   name: 'RANDY',
//   socialMedia: {
//     github: 'randycoulman',
//     twitter: '@randycoulman'
//   }
// }
```

注意，`set` 和 `over` 会按指定的方式对被透镜关注的属性进行修改，并返回整个新的对象。

## 结论

如果想从复杂数据结构的操作中抽象出简单、通用的方法，透镜可以提供很多帮助。我们只需暴露透镜；而不需要暴露整个数据结构、或者为每个可访问属性都提供 "setter"、"getter" 和 变换方法。

## 下一节

我们现在已经了解了许多 Ramda 提供的方法，已经足以应对大部分编程需要。[总结](Thinking-in-Ramda-Wrap-Up.md) 将回顾整个系列的内容，并会提到一些可能需要自己进一步探索的其他主题。
