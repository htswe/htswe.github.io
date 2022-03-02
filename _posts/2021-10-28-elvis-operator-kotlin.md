---
title: "Elvis operator in Kotlin"
header:
  image: https://images.pexels.com/photos/6131932/pexels-photo-6131932.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

This operator is a question mark followed by a colon (`?:`) with no space in between. It is named for an emoticon (short form of “emotion icon”) of the musician Elvis Presley, and is also a play on the words “else-if” (which sounds vaguely like “Elvis”)

![image-center](https://upload.wikimedia.org/wikipedia/commons/2/2d/PresleyPromo1954PhotoOnly.jpg){: .align-center}

A number of programming languages (eg. C#, TypeScript, etc) provide a _null coalescing operator_ that performs the same action as Kotlin’s Elvis operator.

In Elvis operator, if the expression on the left of `?:` is not `null`, that expression becomes the result. If the left-hand expression is `null`, then the expression on the right of the `?:` becomes the result.

```kotlin
val len1: Int = if (b != null) b.length else -1

val len2: Int = b?.length ?: -1
```

The `len1` is using `if-else` expression while `len2` is using Elvis operator. They both will result in the same.
