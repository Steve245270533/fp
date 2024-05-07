import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/fp",
  title: "函数式编程指南",
  description: "函数式编程指南",
  head: [
    ["link", {rel: "icon", href: "./favicon.ico"}]
  ],
  themeConfig: {
    logo: '/images/logo.svg',

    nav: [
      { text: '主页', link: '/' },
    ],

    sidebar: [
      {
        items: [
          { text: '简单介绍', link: '/guide/README' },
        ]
      },
      {
        text: '第 1 部分',
        items: [
          { text: '第 1 章: 我们在做什么？', link: '/guide/ch1' },
          { text: '第 2 章: 一等公民的函数', link: '/guide/ch2' },
          { text: '第 3 章: 纯函数的好处', link: '/guide/ch3' },
          { text: '第 4 章: 柯里化（curry）', link: '/guide/ch4' },
          { text: '第 5 章: 代码组合（compose）', link: '/guide/ch5' },
          { text: '第 6 章: 示例应用', link: '/guide/ch6' },
        ]
      },
      {
        text: '第 2 部分',
        items: [
          { text: '第 7 章: Hindley-Milner类型签名', link: '/guide/ch7' },
          { text: '第 8 章: 特百惠', link: '/guide/ch8' },
          { text: '第 9 章: Monad', link: '/guide/ch9' },
          { text: '第 10 章: Applicative Functor', link: '/guide/ch10' },
          { text: '第 11 章: 再转换一次，就很自然', link: '/guide/ch11' },
          { text: '第 12 章: 遍历', link: '/guide/ch12' },
          { text: '第 13 章：集大成者的 Monoid', link: '/guide/ch13' },

        ]
      },
      {
        text: 'Ramda',
        items: [
          { text: 'Ramda 简介', link: '/guide/Introducing-Ramda' },
          { text: 'Why Ramda', link: '/guide/Why-Ramda' },
          { text: '爱上柯里化', link: '/guide/Favoring-Curry' },
          { text: '为什么柯里化有帮助', link: '/guide/Why-Curry-Helps' },
          { text: '试一试', link: 'https://ramda.cn/repl/' },
          { text: 'api文档', link: 'https://ramda.cn/docs/' },
        ]
      },
      {
        text: 'Ramda中的思考',
        items: [
          { text: '入门', link: '/guide/Thinking-in-Ramda-Getting-Started' },
          { text: '函数组合', link: '/guide/Thinking-in-Ramda-Combining-Functions' },
          { text: '偏应用（部分应用）', link: '/guide/Thinking-in-Ramda-Partial-Application' },
          { text: '声明式编程', link: '/guide/Thinking-in-Ramda-Declarative-Programming' },
          { text: '无参数风格编程 (Pointfree Style)', link: '/guide/Thinking-in-Ramda-Pointfree-Style' },
          { text: '数据不变性和对象', link: '/guide/Thinking-in-Ramda-Immutability-and-Objects' },
          { text: '数据不变性和数组', link: '/guide/Thinking-in-Ramda-Immutability-and-Arrays' },
          { text: '透镜（Lenses）', link: '/guide/Thinking-in-Ramda-Lenses' },
          { text: '概要总结', link: '/guide/Thinking-in-Ramda-Wrap-Up' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Steve245270533/' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Steve'
    },

    search: {
      provider: 'local'
    },
  }
})
