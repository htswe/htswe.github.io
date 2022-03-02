---
title: "Why package"
header:
  image: https://1.bp.blogspot.com/-eCSt3jCfxzo/YWg-Ope0bOI/AAAAAAAADdo/lI3mxSuivAACC-iWQfr_oyzojTZkmt6QgCLcBGAsYHQ/w640-h638/Screenshot%2B2021-10-14%2Bat%2B10.26.41%2BPM.png
categories:
  - Tech
tags:
  - Kotlin
---

A fundamental principle in programming is the acronym **DRY**: `Don't Repeat Yourself`.

This is not new. In fact, over again and again, I have witnessed (guilty - I did it many times too) that we have multiple identical pieces of code in our codebase. Especially, we tend to copy the code from one place to another place without considering much. Each duplication creates opportunities for makes. This is where the package comes in.

A **package** is an associated collection of code. Each package is usually designed to solve a particular problem, and often contains multiple functions and classes. For example, `kotlin.math` packages contains many mathematical related functions.

Unlike Java, you can name the source file name to anything you like - the class name doesn't need to be the same as file name. Kotlin allows to choose any name for the package, but it is considered a good style for the package name to be identical to the directory name where the package files are located. Learn more about the [coding conventions][coding-convention] of Kotlin.

[coding-convention]: https://kotlinlang.org/docs/coding-conventions.html#naming-rules
