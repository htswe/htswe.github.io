---
title: "Set"
header:
  image: https://1.bp.blogspot.com/-dwT69_r2uQo/YWhSXWLLQWI/AAAAAAAADd4/05s1fRmFLT4MiNSexuYeqZBooU_PZfDVgCLcBGAsYHQ/w640-h428/noah-naf-qhfxY3X6JV0-unsplash.jpg
categories:
  - Tech
tags:
  - Kotlin
---

In computer science, `Set` is an interesting abstract data type that stores unique values. It is a collection that allows only one element of each value.

If you have a list of values and you want to make it a unique collection of values, you just have to convert it to a `Set`. Isn’t it wonderful?

We can also perform some Venn-diagram operations like checking for subset, union, intersect and difference, using either

dot notation – eg. `set.union`(other)
infix notation – set `intersect` other
You can also use `distinct()`, which returns a `List`. You can also apply `toSet()` on a `String` to convert it into a set of unique characters.

```kotlin
val setA = setOf(1, 2, 3)
setA.union(setOf(3, 4, 5)) // setOf(1, 2, 3, 4, 5)
setA intersect setOf(3, 4, 5) // setOf(3)

val list = listOf(1, 2, 1, 2, 3)
list.toSet() // (1, 2, 3)
list.distinct() // listOf(1, 2, 3)
"Hello".toSet() // setOf('H','e','l','o')
```
