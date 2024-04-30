# Thinking in Ramda: 概要总结

译者注：本文翻译自 Randy Coulman 的 《[Thinking in Ramda: Wrap-Up](http://randycoulman.com/blog/2016/07/19/thinking-in-ramda-wrap-up/)》，转载请与[原作者](https://github.com/randycoulman)或[本人](https://github.com/adispring)联系。下面开始正文。

---

本文是函数式编程系列文章：[Thinking in Ramda](https://adispring.coding.me/categories/Thinking-in-Ramda/) 的总结篇。

在过去的八篇文章中，我们一直在讨论 [Ramda JavsScipt 库](http://ramda.cn/)，它提供了一系列以函数式、声明式和数据不变性方式工作的函数。

在这个系列中，我们了解了蕴含在 Ramda API 背后的一些指导原则：

* 数据放在最后：几乎所有的函数都将数据参数作为最后一个参数。

* 柯里化：Ramda 几乎所有的函数都是自动柯里化的。也即，可以使用函数必需参数的子集来调用函数，这会返回一个接受剩余参数的新函数。当所有参数都传入后，原始函数才被调用。

这两个原则使我们能编写出非常清晰的函数式代码，可以将基本的构建模块组合成更强大的操作。

## 总结

作为参考，一下是本系列文章的简单概要。

* [入门](https://adispring.coding.me/2017/06/09/Thinking-in-Ramda-%E5%85%A5%E9%97%A8/)：介绍了函数、纯函数和数据不变性思想。作为入门，展示了一些集合迭代函数，如：`map`、`filter` 和 `reduce` 等。

* [函数组合](https://adispring.coding.me/2017/06/10/Thinking-in-Ramda-Combining-Functions/)：演示了可以使用工具（如 `both`、`either`、`pipe` 和 `compose`）以多种方式组合函数。

* [部分应用(Partial Application)](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Partial-Application/)：演示了一种非常有用的函数延时调用方式：可以先向函数传入部分参数，以后根据需要将其余参数传入。借助 `partial` 和 `curry` 可以实现部分应用。我们还学习了 `flip` 和占位符（`__`）。

* [声明式编程](https://adispring.coding.me/2017/06/11/Thinking-in-Ramda-Declarative-Programming/)：介绍了命令式和函数式编程之间的区别。学习了如何使用 Ramda 的声明式函数代替算术、比较、逻辑和条件运算符。

* [无参数风格编程(Pointfree Style)](https://adispring.coding.me/2017/06/13/Thinking-in-Ramda-Pointfree-Style/)：介绍了 pointfree 风格的思想，也被称为 "tatic" 式编程。在 pointfree 式编程时，实际上不会看到正在操作的数据参数，数据被隐含在函数中了。程序是由许多较小的、简单的构建模块组合而成。只有在最后才将组合后的函数应用于实际的数据上。

* [数据不变性和对象](https://adispring.coding.me/2017/06/16/Thinking-in-Ramda-Immutability-and-Objects/)：该节让我们回到了声明式编程的思想，展示了读取、更新、删除和转换对象属性所需的工具。

* [数据不变性和数组](https://adispring.coding.me/2017/06/17/Thinking-in-Ramda-Immutability-and-Arrays/)：继续上一节的主题，展示了数据不变性在数组中的应用。

* [透镜(Lenses)](https://adispring.coding.me/2017/06/18/Thinking-in-Ramda-Lenses/)：引入了透镜的概念，该结构允许我们把重点聚焦在较大的数据结构的一小部分上。借助 `view`、`set` 和 `over` 函数，可以对较大数据结构的小部分被关注数据进行读取、更新和变换操作。

## 后续

该系列文章并未覆盖到 Ramda 所有部分。特别是，我们没有讨论处理字符串的函数，也没有讨论一些更高阶的概念，如 [transducers](http://ramda.cn/docs/#transduce)。

要了解更多 Ramda 的作用，我建议仔细阅读 [官方文档](http://ramda.cn/docs/)，那里有大量的信息。所有的函数都按照它们处理数据的类型进行了分类，尽管有一些重叠。比如，有几个处理数组的函数可以用于处理字符串，`map` 可以作用于数组和对象两种类型。

如果你对更高级的函数式主题感兴趣，可以参考一下资料：

* Transducers：这里有一篇 [使用 transducers 解析日志](http://simplectic.com/blog/2015/ramda-transducers-logs/) 的介绍性文章。（译者也翻译了该系列两篇文章：[《Transducers Explained: Part 1 中文》](https://adispring.coding.me/2016/10/24/Transducers-Explained-Part-1/) 和 [《Transducers Explained: Pipelines 中文》](https://adispring.coding.me/2016/11/01/Transducers-Explained-Pipelines/)）。

* 代数数据类型：如果你已经阅读了很多关于函数式编程的知识，应该听过代数类型和相关术语，如 "Functor"、"Applicative" 和 "Monad"。如果有兴趣深入了解这方面的思想，及其在 Ramda 中的实现和应用，可以查看 [ramda-fantasy](https://github.com/ramda/ramda-fantasy) 项目，该项目实现了符合 [Fantasy Land 规范](https://github.com/fantasyland/fantasy-land) （又称为 JavaScript 代数规范）的一些数据类型。
