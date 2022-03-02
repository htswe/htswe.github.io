---
title: "Named and Default Arguments"
header:
  image: https://1.bp.blogspot.com/-2oLAOLZ7FiQ/YXQmMvSlc4I/AAAAAAAADes/KW6u6nxo_vw_-psiFTh5qa1OLBMOw77bwCLcBGAsYHQ/s600/c870x524.jpg
categories:
  - Tech
tags:
  - Kotlin
---

### Some background

One thing that annoyed me mostly while I was working in Java is the `arguments` in the `function`. If you have a function that requires more than 3 arguments, it becomes cumbersome - we have to ensure that we pass the right value and the data type. It also demands that we have to follow the exact order of arguments in the function.

In Java, you can see how confusing it can be when you are calling `testSometing()` function.

```java
void testSomething(int a, int b, int c, int d, int e) {
  //something
}

main() {
  testSomething(1,1,3,2,5) //ambigious
  ...
}
```

### Kotlin Named Argument

> Named arguments improve code readability.

The same `testSomething` can be written in Kotlin more elegantly.

```kotlin
fun testSomething(a: Int, b: Int, c: Int, d: Int, e: Int) {
  //something
}

main() {
  testSomething(a=1, c= 3, b=1, e=5, d=2)
  ...
}
```

Furthermore, you can also rearrange the argument order as they are now all named. Note that you can mix named and positional arguments. If you change the argument order, you should use the named argument throughout the call.

### Kotlin Default Argument

Combination of named argument with default makes things more interesting and beautiful.

```kotlin
fun testSomething(a: Int = 0, b: Int = 0, c: Int = 0) {
  //something
}

main() {
  testSomething(c=10) // a and b are default to 0
}
```

### Custom Class as Default Argument

One **important** thing to take note if you are using `object` as a default argument, a new instance of that object is created for each invocation.

```kotlin
class Custom

fun test(c: Custom = Custom()) = print(c)

main() {
  test() // DefaultArgs@238x402
  test() // DefaultArgs@9103xa1
}
```
