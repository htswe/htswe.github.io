---
title: "Kotlin Lambda"
header:
  image: https://1.bp.blogspot.com/-2owRHClWi8Y/YYKsZ7iRy4I/AAAAAAAADg0/R_52ZmcAAtER1NsTxUZuGwaGi-IfHZ3oACLcBGAsYHQ/s500/uo6sboyw9t321.png
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

> The unavoidable price of reliability is simplicity – C.A.R Hoare

### Lambda

When you hear the word “Lambda”, what comes to your mind? The word _Lambda_ is used in many place with different context. We have AWS Lambda (serverless compute service), Python Lambda (small anonymous function) and Java 8 Lambda, etc. There might be many more depending on the context.

In Kotlin, Lambda is a low-ceremony function - it has no name, requires a minimal amount of code to create and you can insert it in other code.

Probably, the one that most programmers are familiar is map function. Usually, we transform from one object to another object in the map and it works normally with List. Let’s see an example.

```kotlin
val list = listOf(1, 2, 3, 4, 5)
val square = list.map({ n: Int -> n*n })
print(square) // 1 4 9 16 25
```

The lambda is the code within that `{ }`. The parameter is separated from the function body by an arrow `->`.

### Shorter Lambda for Single function argument

If the lambda is the only function argument, or the last argument, you can omit the parentheses. So we can make something like:

````kotlin
...
val square = list.map { n * n }
...

### What about more than one function argument
If the function takes more than one argument, all except the last lambda argument must be in parenthesis. For example, `joinToString` will need the last argument as a lambda.
```kotlin
val list = listOf(2,4, 5, 10)
list.joinToString(" ") {" $it ")
print(list)
````

## Summary

In general, you can use a lambda anywhere you use a regular function, but if the lambda becomes too complex, it’s offer better to define a named function (normal function), for clarity.
