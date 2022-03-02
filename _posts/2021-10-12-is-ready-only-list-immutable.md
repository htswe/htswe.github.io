---
title: "Kotlin: Is Read-Only List immutable?"
header:
  image: https://1.bp.blogspot.com/-d9pFUMv9WMU/YWWc2zCf3qI/AAAAAAAADdY/7QpJfo_o3EE6ei14ckAUbPQVzh23rVzpwCLcBGAsYHQ/w640-h342/make-immutability-mutable-again.jpg
categories:
  - Tech
tags:
  - Kotlin
---

> A `List` is a container, which is an object that holds other objects. Containers are also called `collections`.

A `List` is read-only -- you can read its contents but not write to list. However if the underlying implementation is a `MutableList` and you retain a mutable reference to that implementation, you can still modify it via that mutable reference.

```kotlin
fun main() {
  val a = mutableListOf(1)
  val b: List<Int> = a
  print(b) // [1]

  a += 2
  print(b) // [1,2]
}
```

As we can see, even thought the `b` is read only, the value can still be modified since it is referenced to the a which is MutableList.

Therefore, Read-Only List is still modifiable.
