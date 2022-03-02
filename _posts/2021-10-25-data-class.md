---
title: "Data class"
header:
  image: https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

One of main motivation of Kotlin is to reduce repetitive coding. One that many of us have spent a significant amount of time and effort is the `class` mechanism. However, creating classes that primarily hold data still requires a considerable amount of repetitive code. This is where `data class` simplify Kotlin code and perform common tasks.

### Two features of data class

You can define a data class using `data` keyword. Each constructor parameter must be preceded by `var` or `val`.

```kotlin
data class Sample(
  val arg1: Int,
  val arg2: Int
)

val s1 = Sample(10, 20)
val s2 = Sample(10, 20)
print(s1)	// "Sample(arg1=10, arg2=20)"
print(s1 == s2)	// true
```

Based on the sample above, you can see **two** features:

1. On `print` statement, you can notice that the `String` produced by `s1`. The data class display objects in a nice, readable format without requiring any additional code.
2. In normal class, in order to achieve the comparison between `s1` and `s2`, we have to implement `equals()` function. In `data` classes, this function is automatically generated. It compares the values of all properties specified as constructor parameters.

### copy

Another useful function generated for every `data` class is `copy()`, which creates a new object containing the data from the current object. However, it also allows you to change selected values in the process.

```kotlin
data class Contact(
  val name: String,
  val number: String,
  val address: String
)

val contact = Contact("Mike", "12345", "US")
val newContact = contact.copy(address = "UK")
```

All arguments have default values that are equal to the current values, so you provide only the ones you want to replace.

### hashCode

`hashCode()` is used in conjunction with `equal()` to rapidly look up a `Key` in a `HashMap` or `HashSet`. Creating a correct `hashCode()` by hand is tricky and error-prone, so let the data class to do it for you.

### Conclusion

In conclusion, `data class` simplifies and reduces a lot of boilerplate code and functions such as `copy()`, `equals()` and `hashCode()`. You should use `data class` over normal class if the purpose is to purely hold the data.
