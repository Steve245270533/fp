# 爱上柯里化 (Favoring Curry)

译者注：本文翻译自 [Scott Sauyet](https://github.com/CrossEye) 的 《[Favoring Curry](http://fr.umio.us/favoring-curry/)》，转载请与[原作者](https://github.com/CrossEye)或[本人](https://github.com/adispring)联系。下面开始正文。

---

我[最近一篇](http://fr.umio.us/why-ramda/) 关于 [Ramda](https://github.com/ramda/ramda) 函数式组合的文章阐述了一个重要的话题。为了使用 Ramda 函数做这种组合，需要这些函数是柯里化的。

Curry，咖喱？某种辛辣的食物？是什么呢？又在哪里？

实际上，`curry` 是为纪念 Haskell Curry 而命名的，他是第一个研究这种技术的人。（是的，人们还用他的姓氏--Haskell--作为一门函数式编程语言；不仅如此，Curry 的中间名字以 'B' 开头，代表 [Brainf*ck](http://en.wikipedia.org/wiki/Brainfuck)

柯里化将多参数函数转化一个新函数：当接受部分参数时，返回等待接受剩余参数的新函数。

原始函数看起来像是这样：

```js
// uncurried version
var formatName1 = function(first, middle, last) {
    return first + ' ' + middle + ' ' + last;
};
formatName1('John', 'Paul', 'Jones');
//=> 'John Paul Jones' // (Ah, but the musician or the admiral?)
formatName1('John', 'Paul');
//=> 'John Paul undefined');
```

但柯里化后的函数更有用：

```js
// curried version
var formatNames2 = R.curry(function(first, middle, last) {
    return first + ' ' + middle + ' ' + last;
});
formatNames2('John', 'Paul', 'Jones');
//=> 'John Paul Jones' // (definitely the musician!)
var jp = formatNames2('John', 'Paul'); //=> returns a function
jp('Jones'); //=> 'John Paul Jones' (maybe this one's the admiral)
jp('Stevens'); //=> 'John Paul Stevens' (the Supreme Court Justice)
jp('Pontiff'); //=> 'John Paul Pontiff' (ok, so I cheated.)
jp('Ziller'); //=> 'John Paul Ziller' (magician, a wee bit fictional)
jp('Georgeandringo'); //=> 'John Paul Georgeandringo' (rockers)
```

或这样：

```js
['Jones', 'Stevens', 'Ziller'].map(jp);
//=> ['John Paul Jones', 'John Paul Stevens', 'John Paul Ziller']
```

你也可以分多次传入参数，像这样：

```js
var james = formatNames2('James'); //=> returns a function
james('Byron', 'Dean'); //=> 'James Byron Dean' (rebel)
var je = james('Earl'); also returns a function
je('Carter'); //=> 'James Earl Carter' (president)
je('Jones'); //=> 'James Earl Jones' (actor, Vader)
```

（有些人会坚持认为我们正在做的应该叫作 "部分应用(partial application)"，"柯里化" 的返回函数应该每次只接受一个参数，每次函数处理完单个参数后返回一个新的接受单参数的函数，直到所有必需的参数都已传入。他们可以坚持他们的观点，无所谓）

## 好无聊啊...! 它能为我做什么呢？

这里有一个稍有意义的示例。如果想计算一个数字集合的总和，可以这样：

```js
// Plain JS:
var add = function(a, b) {return a + b;};
var numbers = [1, 2, 3, 4, 5];
var sum = numbers.reduce(add, 0); //=> 15
```

而若想编写一个通用的计算数字列表总和的函数，可以这样：

```js
var total = function(list) {
    return list.reduce(add, 0);
};
var sum = total(numbers); //=> 15
```

在 Ramda 中，`total` 和 `sum` 和上面的定义非常相似。可以这样定义 `sum`：

```js
var sum = R.reduce(add, 0, numbers); //=> 15
```

但由于 `reduce` 是柯里化函数，当跳过最后一个参数时，就类似于 `total` 的定义了：

```js
// In Ramda:
var total = R.reduce(add, 0);  // returns a function
```

上面将会获得一个可以调用的函数：

```js
var sum = total(numbers); //=> 15
```

再次注意，函数的定义和将函数作用于数据是多么的相似：

```js
var total = R.reduce(add, 0); //=> function:: [Number] -> Number
var sum =   R.reduce(add, 0, numbers); //=> 15
```

## 我不关心这些，我又不是数学怪黎叔

那么你做 web 开发吗？huh？会对服务器发起 AJAX 请求吗？使用的是 [Promises](http://promises-aplus.github.io/promises-spec/) 吗？必须要操作返回的数据，对其进行过滤，取子集等？或者你做 server 端开发？会异步查询一个 no-SQL 数据库，并操作这些结果？

我最好的建议是，去看看 Hugh FD Jackson 的文章：[为什么柯里化有帮助](http://hughfdjackson.com/javascript/why-curry-helps/)。它是我读过的这方面最好的文章。如果你想要看视频，花上半个小时看一下 Dr. Boolean 的视频：[Hey Underscore, 你错了](http://www.youtube.com/watch?v=m3svKOdZijA)。（不要被标题吓到，他没有花太多时间批评那个库）

一定要看看这些材料！它们比我解释的更好；你已经察觉到我有多么的啰嗦、夸夸其谈、冗长甚至愚笨。如果你已经看了上面的材料，可以跳过本文剩余小节了。它们解释的已经够清楚了。

我已经警告过你了哦。

---

假设我们希望得到一些这样的数据：

```js
var data = {
    result: "SUCCESS",
    interfaceVersion: "1.0.3",
    requested: "10/17/2013 15:31:20",
    lastUpdated: "10/16/2013 10:52:39",
    tasks: [
        {id: 104, complete: false,            priority: "high",
                  dueDate: "2013-11-29",      username: "Scott",
                  title: "Do something",      created: "9/22/2013"},
        {id: 105, complete: false,            priority: "medium",
                  dueDate: "2013-11-22",      username: "Lena",
                  title: "Do something else", created: "9/22/2013"},
        {id: 107, complete: true,             priority: "high",
                  dueDate: "2013-11-22",      username: "Mike",
                  title: "Fix the foo",       created: "9/22/2013"},
        {id: 108, complete: false,            priority: "low",
                  dueDate: "2013-11-15",      username: "Punam",
                  title: "Adjust the bar",    created: "9/25/2013"},
        {id: 110, complete: false,            priority: "medium",
                  dueDate: "2013-11-15",      username: "Scott",
                  title: "Rename everything", created: "10/2/2013"},
        {id: 112, complete: true,             priority: "high",
                  dueDate: "2013-11-27",      username: "Lena",
                  title: "Alter all quuxes",  created: "10/5/2013"}
        // , ...
    ]
};
```

我们需要一个函数 `getIncompleteTaskSummaries`，接受成员名字（`memebername`）为参数，然后从服务器（或其他地方）获取数据，挑选出该成员未完成的任务，返回它们的 id、优先级、标题和到期日期，并按到期日期排序。实际上，它返回一个用来解析出这个有序列表的 Promise。

如果向 `getIncompleteTaskSummaries` 传入 "Scott"，它可能会返回：

```js
[
    {id: 110, title: "Rename everything", 
        dueDate: "2013-11-15", priority: "medium"},
    {id: 104, title: "Do something", 
        dueDate: "2013-11-29", priority: "high"}
]
```

好的，这就开始吧。下面这段代码是否看着很熟悉？

```js
getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(function(data) {
            return data.tasks;
        })
        .then(function(tasks) {
            var results = [];
            for (var i = 0, len = tasks.length; i < len; i++) {
                if (tasks[i].username == membername) {
                    results.push(tasks[i]);
                }
            }
            return results;
        })
        .then(function(tasks) {
            var results = [];
            for (var i = 0, len = tasks.length; i < len; i++) {
                if (!tasks[i].complete) {
                    results.push(tasks[i]);
                }
            }
            return results;
        })
        .then(function(tasks) {
            var results = [], task;
            for (var i = 0, len = tasks.length; i < len; i++) {
                task = tasks[i];
                results.push({
                    id: task.id,
                    dueDate: task.dueDate,
                    title: task.title,
                    priority: task.priority
                })
            }
            return results;
        })
        .then(function(tasks) {
            tasks.sort(function(first, second) {
                var a = first.dueDate, b = second.dueDate;
                return a < b ? -1 : a > b ? 1 : 0;
            });
            return tasks;
        });
};
```

下面的代码是否更好些呢？

```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.get('tasks'))
        .then(R.filter(R.propEq('username', membername)))
        .then(R.reject(R.propEq('complete', true)))
        .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
        .then(R.sortBy(R.get('dueDate')));
};
```

如果是的话，那么柯里化会更适合你。所有上面代码块中提及的 Ramda 函数都是柯里化的。（事实上，绝大多数 Ramda 的多参数函数都是柯里化的，除了极个别的几个之外）在很多情形下，柯里化是使代码能更容易组合成这么简洁优雅的模块的原因之一。

让我们看看发生了什么。

`get` （也称为 `prop`）定义如下：

```js
 ramda.get = curry(function(name, obj) {
     return obj[name];
 });
```

但是，当调用上面的代码时，我们只提供第一个参数：`name`。正如之前讨论的，这意味着我们会返回一个新函数，等待第一个 `then` 传入 `obj` 参数给它，这就意味着下面的代码：

```js
.then(R.get('task'))
```

可以看做是下面代码的缩写：

```js
.then(function(data) {
    return data.tasks;
})
```

接下来是 `propEq`，定义如下：

```js
ramda.propEq = curry(function(name, val, obj) {
    return obj[name] === val;
});
```

所以当使用参数 `username` 和 `membername` 调用它时，柯里化返给我们一个新函数，等价于：

```js
function(obj) {
    return obj['username'] === membername;
}
```

其中 `membername` 的值绑定到了传递给我们的值上面。

然后将该函数传给 `filter`。

Ramda 的 `filter` 的工作原理很像原生的 `Array.prototype.filter` ，但类型签名为：

```js
ramda.filter = curry(function(predicate, list) { /* ... */ });
```

所以，我们又进行柯里化了，只传入 "predicate" 函数（谓词），而没有一同传入从上一步输出的任务列表。（我已经告诉过你，所有的东西都是柯里化的，对吧？）

`propEq('complete', true) -> reject` 与 `propEq('username', membername) -> filter` 做了相似的事情。`reject` 和 `filter` 功能类似，除了它们的输出结果是相反的。它只保留使 predicate 函数返回 false 的元素。

好了，你还在看吗？我的食指开始发酸了。（真的要学习盲打了！）不需要我来解释最后两行了吧？真的吗？你确定？好吧！好吧！那我再解释一下。

接下来我们看看：

```js
R.pick(['id', 'dueDate', 'title', 'priority'])
```

`pick` 接受属性名称列表和一个对象，返回从原对象提取指定属性集的新对象。你看，我们又使用了柯里化。由于只传递了属性名称列表，我们得到了一个函数：一旦我们提供一个对象，就会返回一个相同类型的新对象。该函数被传给 `R.map`。与 `filter` 类似，它与原生 `Array.prototype.map` 功能基本相同，但签名如下：

```js
ramda.map = curry(function(fn, list) { /* ... */ });
```

不得不告诉你，这个函数也是柯里化的，因为我们只提供给它 `pick` 返回的函数（也是柯里化的！），而没有提供列表。`then` 将使用任务列表调用它。

好的，还记得小时候坐在教室，等待上课结束的情形吗？手里时钟的分针像是卡住了，另一只手正伸向桌洞里的糖果；老师却还在一遍一遍地重复相同的事情。还记得吗？然后那一刻终于到了，可能是结束前的最后两分钟，结束的时刻已经在眼前了：谢天谢地！下面是最后一个例子：

```js
.then(R.sortBy(R.get('dueDate')));
```

之前已经提到过 `get`。这也是柯里化的，它会返回一个函数：输入对象，输出该对象的 `dueDate` 属性值。我们将其传给 `sortBy`，它接受这样的函数和一个列表，并根据函数返回的值对列表中的元素进行排序。但等等，我们没有列表，对吧？当然没有。我们又在做柯里化。但当调用 `then` 时，它会接收到列表，将列表中的每个对象传给 `get`，并根据结果进行排序。

## 那么，柯里化有多重要呢？

这个例子展示了 Ramda 的一些实用函数和 Ramda 的柯里化特性。或许柯里化并没有那么重要。我们不加柯里化重写一遍：

```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(function(data) {
            return R.get('tasks', data)
        })
        .then(function(tasks) {
            return R.filter(function(task) {
                return R.propEq('username', membername, task)
            }, tasks)
         })
        .then(function(tasks) {
            return R.reject(function(task) {
                return R.propEq('complete', true, task);
            }, tasks)
        })
        .then(function(tasks) {
            return R.map(function(task) {
                return R.pick(['id', 'dueDate', 'title', 'priority'], task);
            }, tasks);
        })
        .then(function(abbreviatedTasks) {
            return R.sortBy(function(abbrTask) {
                return R.get('dueDate', abbrTask);
            }, abbreviatedTasks);
        });
};
```

上面是等价的程序。它仍然比原来的代码好一些。Ramda 实用的函数... 确实比较实用，即使没有柯里化。但我不认为它的可读性有下面的好：

```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.get('tasks'))
        .then(R.filter(R.propEq('username', membername)))
        .then(R.reject(R.propEq('complete', true)))
        .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
        .then(R.sortBy(R.get('dueDate')));
};
```

这就是我们柯里化的原因。

---

课程结束了。

我警告过你的。

下一次，当我让你去看别人的东西而不是我的的时候，你会注意了吧。现在不读我的文章可能已经来不及了，但是他们的作品真的很棒，强烈推荐大家看一下：

* [为什么柯里化有帮助](http://hughfdjackson.com/javascript/why-curry-helps/) ，Hugh FD Jackson
* [嗨 Underscore，你做错了](http://www.youtube.com/watch?v=m3svKOdZijA) ，Dr. Boolean, aka Brian Lonsdorf

这里还有一篇我今天刚看到的新的文章。不知它是否会经的其时间的考验，但现在看来值得一读：

* [将回调放在首位，代码会更优雅](http://bahmutov.calepin.co/put-callback-first-for-elegance.html) ，Gleb Bahmutov

## 一点不太好的小秘密

柯里化尽管非常强大，但单独使用并不足以让你的代码变得 "那么" 优雅。

应该有三个重要的组成部分：

* [上次](http://fr.umio.us/why-ramda/) 我讨论了 **函数式组合**。它可以轻松地将你所有好的想法组合在一起，而不必使用大量丑陋的胶水代码将它们聚合在一起。

* **柯里化** 同样很有用，因为它很好的支持了组合，而且消除了大量的样板代码，正如上面所示。

* 很多能操作有用数据结构（如对象类型的数组）的 **实用函数** 。

[Ramda](https://github.com/ramda/ramda) 的目标之一便是：在一个简单的包里面提供所有这些功能。

## 致谢

[buzzdecafe](http://buzzdecafe.github.io/) 帮助编辑了本文和上一篇文章，并且这次还起了一个完美标题。谢谢，Mike！
