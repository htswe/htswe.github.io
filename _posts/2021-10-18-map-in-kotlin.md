---
title: "Map in Kotlin"
header:
  image: https://1.bp.blogspot.com/-kaPzdE9wmjA/YW2ZeLAN7mI/AAAAAAAADeM/C8_vMf0gov0iORg_vT7l9gQDkO8mq0ySgCLcBGAsYHQ/s600/511SfrjN7TL._AC_SX466_.jpg
categories:
  - Tech
tags:
  - Kotlin
---

So we have seen the wonderful [Set][set-in-kotlin]. Next, we are going to look at `Map`.

> A Map connects keys to values and looks up a value when given a key.

In Kotlin, we can create `Map` by using `mapof()`. A plain `Map` is read-only.

```kotlin
val fruits = mapOf(
  "A" to "Apple",
  "B" to "Banana",
  "C" to "Cherry"
)

val aFruit = fruits["A"] //Apple
```

If you want a mutable version of `Map`, then you can look at `mutableMapOf()`.

```kotlin
val numbers = mutableMapOf(
  1 to "one",
  2 to "two"
)

numbers += 3 to "three"
```

### Interesting Note

- Both `mapOf()` and `mutableMapOf()` preserve the order in which the elements are put into the `Map`.
  `Map` returns `null` if it doesn’t contain an entry for a given key. If you need a result that can’t be `null`, use `getValue()` and catch `NoSuchElementException`.
  Another alternative is to use default value - `getOrDefault()` just does that.

### Conclusion

`Map` looks like a simple tiny database. They are also sometimes called associative arrays, because it associate key with value. Even thought `Map` are quite limited compared to database, they are nonetheless one of the great choices in programming data structure.

[set-in-kotlin]: {% post_url 2021-10-14-set-in-kotlin %}
