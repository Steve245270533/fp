# Thinking in Ramda: 数据不变性和数组

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Immutability and Arrays](http://randycoulman.com/blog/2016/07/05/thinking-in-ramda-immutability-and-arrays/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的第七篇。

在 [第六节](https://adispring.coding.me/2017/06/16/Thinking-in-Ramda-Immutability-and-Objects/) 中，讨论了以函数式和数据不变性（immutable）的方式来处理 JavaScript 对象。

本节将继续用相同的方式讨论数组。

## 读取数组元素

在 [第六节](https://adispring.coding.me/2017/06/16/Thinking-in-Ramda-Immutability-and-Objects/) 中，展示了许多读取对象属性的 Ramda 函数，包括 `prop`、`pick` 和 `has`。Ramda 有更多的方法来读取数组的元素。

数组中与 `prop` 类似的是 `nth`；与 `pick` 类似的是 `slice`，跟 `has` 类似的是 `contains`。来看一些例子。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
nth(3, numbers) // => 40  (0-based indexing)
 
nth(-2, numbers) // => 50 (negative numbers start from the right)
 
slice(2, 5, numbers) // => [30, 40, 50] (see below)
 
contains(20, numbers) // => true
```

`slice` 接受两个索引，返回从第 1 个索引开始（以 0 为起始）到第 2 个索引结束（不包含）的所有元素组成的子数组。

经常会访问首个（`nth(0)`）和最后一个（`nth(-1)`）元素，所以 Ramda 为这两种特殊情形提供的便捷方法：`head` 和 `last`。还提供了访问除首个元素之外的所有元素的函数：`tail`，除最后一个元素之外的所有元素的方法：`init`，前 `N` 个元素：`take(N)`，后 `N` 个元素：`takeLast(N)`。来看看这些函数的实例。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
head(numbers) // => 10
tail(numbers) // => [20, 30, 40, 50, 60]
 
last(numbers) // => 60
init(numbers) // => [10, 20, 30, 40, 50]
 
take(3, numbers) // => [10, 20, 30]
takeLast(3, numbers) // => [40, 50, 60]
```

## 增、删、改数组元素

对于对象，我们已经学了对其属性进行增、删、改的函数：`assoc`、`dissoc`、`evolve` 等。

但数组是有序数据结构，有好多函数与 `assoc` 类似。最常用的是 `insert` 和 `update`，Ramda 还提供了 `append` 和 `prepend` 来在数组头部或尾部添加元素。`insert`、`append` 和 `prepend` 会给数组添加新元素；`update` 使用新值替换已有元素。

正如一般函数式库应该具备的，所有这些函数都返回修改后的新数组，原有数组保持不变。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
insert(3, 35, numbers) // => [10, 20, 30, 35, 40, 50, 60]
 
append(70, numbers) // => [10, 20, 30, 40, 50, 60, 70]
 
prepend(0, numbers) // => [0, 10, 20, 30, 40, 50, 60]
 
update(1, 15, numbers) // => [10, 15, 30, 40, 50, 60]
```

为了将两个对象合并为一个，我们学习了 `merge`；Ramda 为数组合并提供了 `concat`。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
concat(numbers, [70, 80, 90]) // => [10, 20, 30, 40, 50, 60, 70, 80, 90]
```

注意，第二个数组添加到第一个数组之后。当单独使用 `concat` 时，可以很好的工作；但类似于 `merge`，在 pipeline 中可能并不像预期的那样工作。可以为在 pipeline 中使用定义一个辅助函数 `concatAfter`：`const concatAfter = flip(concat)`。

Ramda 还提供了几个删除元素的函数。`remove` 删除指定索引处的元素，`without` 通过值删除元素。还有常用到的删除前 `N` 或 后 `N` 个元素的函数：`drop` 和 `dropLast`。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
remove(2, 3, numbers) // => [10, 20, 60]
 
without([30, 40, 50], numbers) // => [10, 20, 60]
 
drop(3, numbers) // => [40, 50, 60]
 
dropLast(3, numbers) // => [10, 20, 30]
```

注意，`remove` 接受一个索引和一个删除元素的数量，而 `slice` 接受两个索引。如果你不知道这种不一致，可能会造成使用上的困扰。

## 变换元素

与对象一样，我们可能希望通过将函数应用于元素的原始值来更新数组元素。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
update(2, multiply(10, nth(2, numbers)), numbers) // => [10, 20, 300, 40, 50, 60]
```

为了简化这个常见的用例， Ramda 提供了 `adjust`，其工作方式类似于操作对象的 `evolve`。与 `evolve` 不同的是， `adjust` 只能作用于数组的单个元素。

```js
const numbers = [10, 20, 30, 40, 50, 60]
 
adjust(multiply(10), 2, numbers)
```

注意，与 `update` 相比，`adjust` 将前两个参数的位置交换了一下。这可能会引起困扰，但当进行部分应用时，这样做还是很有道理的。你可能会先提供一个调整函数，比如 `adjust(multiply(10))` ，然后再决定要调整的索引和数组。

## 结论

我们现在有了以声明式和不变式操作对象和数组的一系列方法。这允许我们在不改变已有数据的情况下，从较小的、函数式的构建模块来构建程序，通过对函数进行组合来实现我们想要的功能。

## 下一节

我们学习了读取、更新和转换对象属性和数组元素的方法。Ramda 提供了更通用的进行这些操作的工具：lens（透镜）。[Lenses](Thinking-in-Ramda-Lenses.md) 向我们演示了它们的工作原理和方式。
