---
title: "Kotlin Extension Properties"
header:
  image: https://1.bp.blogspot.com/-CDTgZo3wb7s/YXrIFu3Lt9I/AAAAAAAADgI/T4eclKtuyHUB1OLc7_wUtacVR53lzBHUgCLcBGAsYHQ/s500/af4caf96e61e074646c1ef2b051ffca0%2B%25281%2529.jpg
categories:
  - Tech
tags:
  - Kotlin
---

### Extension Properties

In Kotlin, just like [extension function][extension-is-a-magic], properties can have _extension_ properties too. The syntax is similar to extension functions - the extended type comes right before the function or the property name -

```kotlin
val String.indices: IntRange
  get() = 0 until length

print("hello".indices) // 0..4
```

One question that people usually confuse is whether to choose **function** or **property**. The simplest suggestion is

- **property** describes state
- **function** describe behavior
  Preferring a property over a function makes sense only if it is simple enough and improves readability.

We could also create extension properties on generic

> [Kotlin Style Guide][kotlin-style-guide] recommends a function over a property if the function throws an exception.

If you are planning to make extension on [generic][kotlin-generic] property, it is possible. For example,

```kotlin
val <T> List<T>.firstOrNull: T?
  get() = if (isEmpty()) null else this[0]
```

If you do not wish to use generic, another way is to replace `T` with `*`. It is called **_star projection_**.

```kotlin
val List<*>.indices: IntRange
  get() = 0 until size
```

### Summary

While both extension function and extension properties can do mostly the same, we should try keeping close the Style Guide by Kotlin. The basic rule of thumb is to **_find out if it describes a behavior or state_**.

There is also additional set of guidelines that help us to decide if property is preferred over function:

- does not throw exception
- is cheap to calculate or cached on the first run
- returns same result on multiple invokes

[kotlin-style-guide]: https://kotlinlang.org/docs/coding-conventions.html

[kotlin-generic]: {% post_url 2021-10-28-kotlin-generic %}
[extension-is-a-magic]: {% post_url 2021-10-23-extension-function-is-a-magic %}
