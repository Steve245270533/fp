import{_ as s,c as i,o as a,a3 as n}from"./chunks/framework.DC-ssQ6l.js";const y=JSON.parse('{"title":"第 2 章: 一等公民的函数","description":"","frontmatter":{},"headers":[],"relativePath":"guide/ch2.md","filePath":"guide/ch2.md"}'),h={name:"guide/ch2.md"},t=n(`<h1 id="第-2-章-一等公民的函数" tabindex="-1">第 2 章: 一等公民的函数 <a class="header-anchor" href="#第-2-章-一等公民的函数" aria-label="Permalink to &quot;第 2 章: 一等公民的函数&quot;">​</a></h1><h2 id="快速概览" tabindex="-1">快速概览 <a class="header-anchor" href="#快速概览" aria-label="Permalink to &quot;快速概览&quot;">​</a></h2><p>当我们说函数是“一等公民”的时候，我们实际上说的是它们和其他对象都一样...所以就是普通公民（坐经济舱的人？）。函数真没什么特殊的，你可以像对待任何其他数据类型一样对待它们——把它们存在数组里，当作参数传递，赋值给变量...等等。</p><p>这是 JavaScript 语言的基础概念，不过还是值得提一提的，因为在 Github 上随便一搜就能看到对这个概念的集体无视，或者也可能是无知。我们来看一个杜撰的例子：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> hi</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`Hi \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> greeting</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> hi</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name);</span></span></code></pre></div><p>这里 <code>greeting</code> 指向的那个把 <code>hi</code> 包了一层的包裹函数完全是多余的。为什么？因为 JavaScript 的函数是<em>可调用</em>的，当 <code>hi</code> 后面紧跟 <code>()</code> 的时候就会运行并返回一个值；如果没有 <code>()</code>，<code>hi</code> 就简单地返回存到这个变量里的函数。我们来确认一下：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hi; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// name =&gt; \`Hi \${name}\`</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hi</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;jonas&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// &quot;Hi jonas&quot;</span></span></code></pre></div><p><code>greeting</code> 只不过是转了个身然后以相同的参数调用了 <code>hi</code> 函数而已，因此我们可以这么写：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> greeting</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hi;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">greeting</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;times&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// &quot;Hi times&quot;</span></span></code></pre></div><p>换句话说，<code>hi</code> 已经是个接受一个参数的函数了，为何要再定义一个额外的包裹函数，而它仅仅是用这个相同的参数调用 <code>hi</code>？完全没有道理。这就像在大夏天里穿上你最厚的大衣，只是为了跟热空气过不去，然后吃上个冰棍。真是脱裤子放屁多此一举。</p><p>用一个函数把另一个函数包起来，目的仅仅是延迟执行，真的是非常糟糕的编程习惯。（稍后我将告诉你原因，跟可维护性密切相关。）</p><p>充分理解这个问题对读懂本书后面的内容至关重要，所以我们再来看几个例子。以下代码都来自 npm 上的模块包：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 太傻了</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getServerStuff</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ajaxCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">json</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> callback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(json));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 这才像样</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> getServerStuff</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ajaxCall;</span></span></code></pre></div><p>世界上到处都充斥着这样的垃圾 ajax 代码。以下是上述两种写法等价的原因：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 这行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ajaxCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">json</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> callback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(json));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 等价于这行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ajaxCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(callback);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 那么，重构下 getServerStuff</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getServerStuff</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ajaxCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(callback);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ...就等于</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> getServerStuff</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ajaxCall </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// &lt;-- 看，没有括号哦</span></span></code></pre></div><p>各位，以上才是写函数的正确方式。一会儿再告诉你为何我对此如此执着。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> BlogController</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">posts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Views.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(posts); },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">post</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Views.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post); },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">attrs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Db.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(attrs); },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  update</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">post</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">attrs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Db.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">update</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post, attrs); },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  destroy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">post</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Db.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">destroy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post); },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><p>这个可笑的控制器（controller）99% 的代码都是垃圾。我们可以把它重写成这样：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> BlogController</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  index: Views.index,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  show: Views.show,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  create: Db.create,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  update: Db.update,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  destroy: Db.destroy,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><p>...或者直接全部删掉，因为它的作用仅仅就是把视图（Views）和数据库（Db）打包在一起而已。</p><h2 id="为何钟爱一等公民" tabindex="-1">为何钟爱一等公民？ <a class="header-anchor" href="#为何钟爱一等公民" aria-label="Permalink to &quot;为何钟爱一等公民？&quot;">​</a></h2><p>好了，现在我们来看看钟爱一等公民的原因是什么。前面 <code>getServerStuff</code> 和 <code>BlogController</code> 两个例子你也都看到了，虽说添加一些没有实际用处的间接层实现起来很容易，但这样做除了徒增代码量，提高维护和检索代码的成本外，没有任何用处。</p><p>另外，如果一个函数被不必要地包裹起来了，而且发生了改动，那么包裹它的那个函数也要做相应的变更。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">httpGet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/post/2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">json</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> renderPost</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(json));</span></span></code></pre></div><p>如果 <code>httpGet</code> 要改成可以抛出一个可能出现的 <code>err</code> 异常，那我们还要回过头去把“胶水”函数也改了。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 把整个应用里的所有 httpGet 调用都改成这样，可以传递 err 参数。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">httpGet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/post/2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">err</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> renderPost</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(json, err));</span></span></code></pre></div><p>写成一等公民函数的形式，要做的改动将会少得多：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">httpGet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/post/2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, renderPost);  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// renderPost 将会在 httpGet 中调用，想要多少参数都行</span></span></code></pre></div><p>除了删除不必要的函数，正确地为参数命名也必不可少。当然命名不是什么大问题，但还是有可能存在一些不当的命名，尤其随着代码量的增长以及需求的变更，这种可能性也会增加。</p><p>项目中常见的一种造成混淆的原因是，针对同一个概念使用不同的命名。还有通用代码的问题。比如，下面这两个函数做的事情一模一样，但后一个就显得更加通用，可重用性也更高：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 只针对当前的博客</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> validArticles</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> articles</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  articles.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">article</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> article </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> article </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 对未来的项目更友好</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> compact </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> xs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> xs.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">x</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><p>在命名的时候，我们特别容易把自己限定在特定的数据上（本例中是 <code>articles</code>）。这种现象很常见，也是重复造轮子的一大原因。</p><p>有一点我必须得指出，你一定要非常小心 <code>this</code> 值，别让它反咬你一口，这一点与面向对象代码类似。如果一个底层函数使用了 <code>this</code>，而且是以一等公民的方式被调用的，那你就等着 JS 这个蹩脚的抽象概念发怒吧。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fs </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;fs&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 太可怕了</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fs.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">readFile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;freaky_friday.txt&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Db.save);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 好一点点</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fs.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">readFile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;freaky_friday.txt&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Db.save.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Db));</span></span></code></pre></div><p>把 Db 绑定（bind）到它自己身上以后，你就可以随心所欲地调用它的原型链式垃圾代码了。<code>this</code> 就像一块脏尿布，我尽可能地避免使用它，因为在函数式编程中根本用不到它。然而，在使用其他的类库时，你却不得不向这个疯狂的世界低头。</p><p>也有人反驳说 <code>this</code> 能提高执行速度。如果你是这种对速度吹毛求疵的人，那你还是合上这本书吧。要是没法退货退款，也许你可以去换一本更入门的书来读。</p><p>至此，我们才准备好继续后面的章节。</p><p><a href="./ch3.html">第 3 章: 纯函数的好处</a></p>`,38),p=[t];function l(k,e,d,r,E,g){return a(),i("div",null,p)}const o=s(h,[["render",l]]);export{y as __pageData,o as default};