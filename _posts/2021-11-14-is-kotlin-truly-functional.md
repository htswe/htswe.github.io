---
title: "Is Kotlin truly functional"
header:
  image: https://images.pexels.com/photos/7241294/pexels-photo-7241294.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

### Background

A truly functional programming language like Javascript allows us to assign the function as a variable. Take an example of this:

```javascript
// JavaScript
const square = function (number) {
  return number * number;
};
var x = square(4); // x gets the value 16
```

Can Kotlin do the same? We can save the lambda in a variable, but not the function. But there is alternative - which is **Member References** which we are going to look into it.

### Member References

_Member references_ for function, property and constructor can replace trivial lambdas that simply call the corresponding function, property or constructor.

A member reference uses a double colon to separate the class name from the function or property. For example, `Message::isRead` is a member reference.

```kotlin
data  class  Message(
  val sender: String,
  val text: String,
  val isRead: Boolean
)

val messages = listOf(
  Message("Sheldon", "smart", true),
  Message("George", "handsome", false)
)

val unread = messages.filterNot(Message::isRead)
// Message("George", "smart", false)
```

### Property References

Property references are useful when specifying a non-trivial sort order.

```kotlin
val messages = listOf(
  Message("Sheldon", "smart", true),
  Message("George", "handsome", false),
  Message("Missy", "beautiful", true)
)

// first unread, sorted by sender
messages.sortedWith(compareBy(Message::isRead, Message::sender))
```

### Function References

Suppose you want a list of messages which contains some important stuffs. That means you might now have a number of complicated criteria to decide what “important” means. You can put that logic in a lambda, but that lambda could easily become large and complex. The code is more understandable if you extract it into a separate function.

> In Kotlin, you can’t pass a function where a function type is expected, but you can pass a reference to that function.

```kotlin
fun Message.isImportant(): Boolean =
  text.contains("Salary") || text.contains("Promotion")

val messages = listOf(
  Message("Boss", "Salary Adjustment", false)
)

messages.any(Message::isImportant)
```

If there is a top-level function taking `Message` as its only parameter, you can pass it as a reference. When you create a reference to a top-level function, there’s no class name, so it’s written `::function`

```kotlin
fun ignore(message: Message) =
  message.isImportant.not()
  && message.sender in setOf("Dan", "Charles")

messages.filter(::ignore)
```

### Constructor References

You can create a reference to a constructor using the class name.

```kotlin
data class Student(
  val id: Int,
  val name: String
)

val names = listOf("Alice", "Bob")
val students = names.mapIndexed { index, name ->
  Student(index, name)
}

// same thing is achieved with
val usingRef = names.mapIndexed(::Student)
```

`mapIndexed` was introduced in Lambda. Function and constructor references can eliminate specifying a long list of parameters that are simply passed into a lambda. It is also more readable than lambda.

## Summary

Like Java, Kotlin has member references, which can replace simple Lambdas that only call a member function or return a member property, it can convert Lambda to member reference automatically when it’s possible. You can store Lambda in a variable, however, you can’t store a function in a variable. It’s not like in a truly functional language where each function is a variable.

Function references allow you to store a reference to any defined function in a variable to be able to store it and qualitative it. Keep in mind that this syntax is just another way to call a function inside the Lambda, underlying implementation are the same.
