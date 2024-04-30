# Ramda 简介

译者注：本文翻译自 [Michael Hurley](https://github.com/buzzdecafe) 的 《[Introducing Ramda](http://buzzdecafe.github.io/code/2014/05/16/introducing-ramda/)》，转载请与[原作者](https://github.com/buzzdecafe)或[本人](https://github.com/adispring)联系。下面开始正文。

---

在过去一年的时间里，我的同事 Scott Sauyet 和我一直在编写 [Ramda](https://github.com/ramda/ramda) ："一个实用的 JavaScript 函数式编程库"。当我们为 Frontend Masters 注册 "使用 JavaScript 进行核心函数式编程" 工作室时，惊讶地发现，他们选择 Ramda 来说明他们的示例。这件事给了我们信心，我们认为现在是宣布 Ramda 到来的时候了。

现在已经存在一些优秀的函数式库，如 [Underscore](https://github.com/jashkenas/underscore) 和 [Lodash](https://github.com/lodash/lodash)。Ramda 包含了所有你想要的列表操作函数，像 `map`、`filter`、`reduce` 和 `find` 等。但 Ramda 跟 Underscore 和 Lodash 有很大的区别。Ramda 的主要特性如下：

* **Ramda 先接受函数参数，最后接受数据参数。** [Brian Lonsdorf 解释了为什么这样的参数顺序很重要](http://www.youtube.com/watch?v=m3svKOdZijA)。简言之，柯里化和 "函数优先" 这两者相结合，使开发者在最终传入数据之前，能够以非常少的代码（通常为 "point-free" 风格，也即无参数风格）来组合函数。例如，以下面代码为例：

```js
// Underscore/Lodash style:
var validUsersNamedBuzz = function(users) {
  return _.filter(users, function(user) { 
    return user.name === 'Buzz' && _.isEmpty(user.errors); 
  });
};
```

现在可以这么写：

```js
// Ramda style:
var validUsersNamedBuzz = R.filter(R.where({name: 'Buzz', errors: R.isEmpty}));
```

* **Ramda 的函数是自动柯里化的** 。当你需要对 Underscore 或 Lodash 中的函数进行手动柯里化（或部分柯里化）时，Ramda 在内部已经替你完成这项工作了。实际上，Ramda 中所有的多元（多参数）函数都默认是柯里化的。例如：

```js
// `prop` takes two arguments. If I just give it one, I get a function back
var moo = R.prop('moo');
// when I call that function with one argument, I get the result.
var value = moo({moo: 'cow'}); // => 'cow'    
```

这种自动柯里化使得 "通过组合函数来创建新函数" 变得非常容易。因为 API 都是函数优先、数据最后（先传函数，最后传数据参数），你可以不断地组合函数，直到创建出需要的新函数，然后将数据传入其中。（Hugh Jackson 发表了一遍描述这种风格优点的 [非常优秀的文章](http://hughfdjackson.com/javascript/why-curry-helps/)。

```js
// take an object with an `amount` property
// add one to it
// find its remainder when divided by 7
var amtAdd1Mod7 = R.compose(R.moduloBy(7), R.add(1), R.prop('amount'));

// we can use that as is:
amtAdd1Mod7({amount: 17}); // => 4
amtAdd1Mod7({amount: 987}); // => 1
amtAdd1Mod7({amount: 68}); // => 6
// etc. 

// But we can also use our composed function on a list of objects, e.g. to `map`:
var amountObjects = [
  {amount: 903}, {amount: 2875654}, {amount: 6}
]
R.map(amtAdd1Mod7, amountObjects); // => [1, 6, 0]

// of course, `map` is also curried, so you can generate a new function 
// using `amtAdd1Mod7` that will wait for a list of "amountObjects" to 
// get passed in:
var amountsToValue = map(amtAdd1Mod7);
amountsToValue(amountObjects); // => [1, 6, 0]
```

[Ramda 提供了 npm 包](https://www.npmjs.org/package/ramda)，可以下载下来尝试一下。如果你对 Ramda 库有什么想法或改进建议，[请联系我们](https://github.com/CrossEye/ramda/issues)。
