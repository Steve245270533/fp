# 为什么柯里化有帮助

译者注：本文翻译自 [Hugh FD Jackson](https://hughfdjackson.com/) 的 《[Why Curry Helps](https://hughfdjackson.com/javascript/why-curry-helps/)》，转载请与[原作者](https://hughfdjackson.com/)或[本人](https://github.com/adispring)联系。下面开始正文。

---

程序员的梦想是编写代码，并能够非常容易地对其进行复用。还要有强表达力，因为你书写的方式就是在表达你想要的东西，并且它应该被复用，因为... 好吧，你正在复用。你还想要什么呢？

[curry](https://npmjs.org/package/curry) 可以帮忙。

## 什么是柯里化，为什么它如此的美味？

JavaScript 中正常的函数调用如下：

```js
var add = function(a, b){ return a + b }
add(1, 2) //= 3
```

一个函数接受多个参数，并返回一个值。我可以使用少于指定数量的参数调用它（可能得到奇怪的结果），或者多于指定的数量（超出的部分一般会被忽略）。

```js
add(1, 2, 'IGNORE ME') //= 3
add(1) //= NaN
```

一个柯里化的函数需要借用一系列单参数函数来处理它的多个参数。例如，柯里化的加法会是这样：

```js
var curry = require('curry')
var add = curry(function(a, b){ return a + b })
var add100 = add(100)
add100(1) //= 101
```

接受多个参数的柯里化函数将被写成如下形式：

```js
var sum3 = curry(function(a, b, c){ return a + b + c })
sum3(1)(2)(3) //= 6
```

由于这在 JavaScript 语法中很丑，[curry](https://npmjs.org/package/curry) 允许你一次调用多个参数：

```js
var sum3 = curry(function(a, b, c){ return a + b + c })
sum3(1, 2, 3) //= 6
sum3(1)(2, 3) //= 6
sum3(1, 2)(3) //= 6
```

## 所以呢？

如果你还未习惯这样一门语言：柯里化函数是其日常工作一部分（如 [Haskell](http://learnyouahaskell.com/)），那么它给我们带来的好处可能不太明显。在我看来，有两点非常重要：

* 小的模块可以轻松地配置和复用，不杂乱。
* 从头至尾都使用函数。

### 小模块

我们来看一个明显的例子；映射一个集合来获取它的成员的 ids：

```js
var objects = [{ id: 1 }, { id: 2 }, { id: 3 }]
objects.map(function(o){ return o.id })
```

如果你正想搞清楚第二行的真正逻辑，我来跟你解释一下吧：

> MAP over OBJECTS to get IDS (对Objects进行映射，来获得对应的ID)

有很多种实现这种操作的方式；可以函数定义的形式实现。我们来理一理：

```js
var get = curry(function(property, object){ return object[property] })
objects.map(get('id')) //= [1, 2, 3]
```

现在我们正在探讨这个操作的真正逻辑 - 映射这些对象，获取它们的 ids 。BAM。我们在 `get` 函数中真正创建的是一个 **可以部分配置的函数**。

如果想复用 '从对象列表中获取ids' 这个功能，该怎么办呢？我们先用一种笨的方法实现：

```js
var getIDs = function(objects){
    return objects.map(get('id'))
}
getIDs(objects) //= [1, 2, 3]
```

Hrm，我们似乎从高雅和简洁的方式回到了混乱的方式。可以做些什么呢？Ah，如果 `map` 可以先部分配置一个函数，而不同时调用集合，会怎样呢？

```js
var map = curry(function(fn, value){ return value.map(fn) })
var getIDs = map(get('id'))

getIDs(objects) //= [1, 2, 3]
```

我们开始看到，如果基本的构建块是柯里化函数，我们可以轻松地从中创建新的功能。更令人兴奋的是，代码读起来也很像你所工作领域（语言、环境）的逻辑。

## 全是函数

这种方法的另一个优点是它鼓励创建函数，而不是方法。虽然方法很好 - 允许多态，可读性也不错 - 但它们并不总是能拿来干活的工具，比如大量的异步代码。

在这个示例中，我们从服务器获取一些数据，并对其进行处理。数据看起来像是这样：

```js
{
    "user": "hughfdjackson",
    "posts": [
        { "title": "why curry?", "contents": "..." },
        { "title": "prototypes: the short(est possible) story", "contents": "..." }
    ]
}
```

你的任务是提取每个用户的帖子的标签。赶紧来试一下：

```js
fetchFromServer()
    .then(JSON.parse)
    .then(function(data){ return data.posts })
    .then(function(posts){
        return posts.map(function(post){ return post.title })
    })
```

好吧，这不公平，你在催我。（另外，我代表你写了这段代码 - 可能你会更有优雅地解决它，但我好像离题了...）。

由于 Promises 链（或者，如果你喜欢，也可以用回调）需要与函数一起 *工作*，你不能轻易地映射从服务器获取的值，而无需首先显式地将其包裹在代码块中。（需要显式的写出参数）

再来一次，这次使用已经定义好的工具：

```js
fetchFromServer()
    .then(JSON.parse)
    .then(get('posts'))
    .then(map(get('title')))
```

这具有很强的逻辑性、表达力；如果不使用柯里化函数，我们几乎不可能轻易的将其实现。

## 总结

[curry](https://npmjs.org/package/curry) 赋予你一种强大的表达能力。

我建议你下载下来，玩一会儿。如果你已经熟悉了这个概念，我觉得你可以直接找到合适的 API。如果没有的话，建议你和你的同事一起研究一下吧。

