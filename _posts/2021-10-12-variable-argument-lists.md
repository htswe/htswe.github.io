---
title: "Variable Argument Lists"
header:
  image: https://1.bp.blogspot.com/-Ko_5jsrd0w4/YWWpLKKs-zI/AAAAAAAADdg/0X5Mt3tan6Y75H1YsM3sI9krxbYvkle7gCLcBGAsYHQ/w640-h426/stack-blocks.jpg
categories:
  - Tech
tags:
  - Kotlin
---

Do you know what `vararg` keyword is? Using this `vararg`, you can define a function that takes any number of argument.

The keyword `vararg` produces a flexibly-sized argument list.

It allows you to pass any number (including zero) of arguments, but it has to be the same type because you can later access it using the parameter name as an `Array`.

```kotlin
fun max(vararg nums: Int): Int {
  var max = 0
  for (n in nums) {
    if (n > max) max = n
  }
  return max
}

sum(9) // 9
sum(3, 20, 15) // 20
```

Although `Array` and `List` look similar, they are implemented differently -- `List` is a regular library class while Array has the special low level support. Array is actually come from Kotlin's requirement of compatibility with other programming languages such as Java.

In general, we use `List` when we need a simple sequence. We only consider an `Array` if the third party library requires Array type or when we are working with `vararg`.
