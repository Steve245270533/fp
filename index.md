---
layout: home

hero:
  name: "函数式编程指南"
  text: "Functional Programming"
  tagline: 强大、简洁、优雅
  image:
    src: /images/logo.svg
    alt: Functional Programming
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/README

features:
  - icon: 💡
    title: 你很有可能在日常工作中使用它
  - icon: ⚡️
    title: 你不必从头学起就能开始编写程序
  - icon: 🌳
    title: 这门语言完全有能力书写高级的函数式代码
---

<script lang="ts" setup>
import { onMounted } from 'vue'
import VanillaTilt from 'vanilla-tilt';


onMounted(() => {
  const element = document.querySelector('.image')
  VanillaTilt.init(element, { reverse: true, transition: true })
})
</script>