---
title: "Why Lambda"
header:
  image: https://1.bp.blogspot.com/-vE1AAA4CPcE/YYQIY5rgSsI/AAAAAAAADhA/Y-eRxYqcanMeHL8CF__pSRsd00yDe43PACLcBGAsYHQ/s600/such-useful-very-helping.jpg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

To some people, `lambda` may seem like syntax sugar, but it is more than that. If you have to repeat some codes with minor modification, you can leverage on the power of lambda.

Let’s take a look at an example. Imagine we have a function that takes a list of `Int` and returns a list of even number.

```kotlin
fun filterForEven(nums: List<Int>): List<Int> {
  val result = mutableListOf<Int>()
  for (i in nums) {
    if (i % 2 == 0) result += i
  }
  return result
}
```

Now, we have another function that takes a list of `Int` and returns a list of numbers which are positive number.

```kotlin
fun filterForPositive(nums: List<Int>): List<Int> {
  val result = mutableListOf<Int>()
  for (i in nums) {
    if (i > 0) result += i
  }
  return result
}
```

Those two functions can be replaced with

```kotlin
nums.filter { it % 2 == 0 }
nums.filter { it > 0 }
```

This `lambda` expression is clearer, more concise and avoids repetition. Both use the same `filter` function with different `predicate`.

This is one of the main shining example of functional programming, of which `map` and `filter` are great examples. _Functional programming_ usually solves problems in a small steps and trivial. However once you have a collection of these small, well-tested solutions, you can combine them with your code to create your code more robust and more quickly.

### Reusability of Lambda

You can store a lambda in a `val` or `var`. This allows us to reuse of the lambda by passing it as an argument. For example,

```kotlin
val isEven = { item: Int -> item % 2 == 0 }
list.filter(isEven) // returns a list of even number
list.any(isEven) // returns if the list contains even number
```

### Accessibility outside scope

Another important quality of lambda is the ability to access/refer to the elements (variables) outside the lambda scope.

> When a function “closes over” or “captures” the elements in its environment, we call it a closure

Take note that `lambda` and `closure` are two distinct features and not to mix it up. `lambda` is a low ceremony function with no name and minimum amount of code. You can read more here. `closure` is the concept that the functions that can access and modify properties defined outside the scope of the function.

When a language support `closure`, it will work like this:

val a = 10
nums.filter { it > a }
Even though a is not within the scope of filter lambda, the function is able to access the value of a.

To demonstrate on the closure without lambda, consider the code below.

```kotlin
var x = 1

fun upX() {
  x++
}

main() {
  upX() // x will become 2
}
```

The function `upX()` is able to modify/access to the variable `x` even thought `x` is outside the scope of `upX().`

Summary
Lambda is not just a sugar syntax for function. It is small, but very useful when you are duplicating code with minimal modification. With many lambda functions on hand, your development will be clearer, more concise and easy/fast to develop.
