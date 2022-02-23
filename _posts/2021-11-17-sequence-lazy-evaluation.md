---
title: "Sequence: lazy evaluation"
header:
  image: https://images.pexels.com/photos/7311920/pexels-photo-7311920.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

What is `Sequence`? A Kotlin Sequence is like a `List`, but you can only iterate. You cannot index into `Sequence`. And this restriction produces very efficient chained operations.

In other functional programming languages, Kotlin `Sequence` are called `streams`. Since Java 8 has `Stream` library, Kotlin has to choose another name to keep interoperability with Java.

### List vs Sequence

The operation on Lists are performed eagerly - they always happen immediately. When chaining List operation, the first result must be done before starting the next.

```kotlin
list.listOf(1, 2, 3, 4)
  .filter { it % 2 == 0 }
  .any { it > 0 }
```

![eager evaluation](/assets/images/eager-evaluation.png){: .align-center}

In this example, `filter()` operation from `1` to `n` must be completed before it can go to `any()` operation. Eager evaluation is intuitive and straightforward, but can be **_suboptimal_**. If you look carefully on the above example, it would make more sense to stop after encountering the first element that will satisfies the `any()`. This optimization might be much faster than evaluating every element and then search for a single match.

> Eager evaluation is called horizontal evaluation.

The alternative to _eager evaluation_ is _lazy evaluation_ : a result is computed only when needed.
![lazy evaluation](/assets/images/lazy-evaluation.png){: .align-center}

> Performing lazy operations on sequence is called vertical evaluation.

With lazy evaluation, an operation is performed on an element only when that element’s associated result is requested. If the final result of a calculation is found before processing the last element, no further elements are processed.

This lazy evaluation optimization is simply done by converting `List` to `Sequence` using `asSequence()`.

```kotlin
list.listOf(1, 2, 3, 4)
  .asSequence()
  .filter { it % 2 == 0 }
  .any { it > 0 }
```

### Two types of operation

There are two categories of `Sequence` operations: _intermediate_ and _terminal_. Intermediate operations return another `Sequence` as a result. `filter()` and `map()` are intermediate operations.

Terminal operations return a non-Sequence. To do this, a terminal operation executes all stored computations. For example, `any()` is the terminal operation that returns `Boolean`.

### Size of Sequence

`Collections` are a known size, discoverable through their `size` property. `Sequences` are treated as if they are **infinite**.

So what happen if we want to get some items - `takeIf` can be used, followed by a terminal operation like `toList()` or `sum()`.

```kotlin
items.takeIf { it % 2 == 0 }.toList()
```

## Summary

Sequences are a part of the language standard library and allow lazy evaluation of large amount of data (in millions), as opposed to collections, which compute and evaluate operations on a data set _eagerly_.
