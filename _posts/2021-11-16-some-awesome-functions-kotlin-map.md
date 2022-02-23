---
title: "Some awesome functions in Kotlin Map"
header:
  image: https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

### Map

`Maps` are extremely useful programming tools, and there are numerous ways to construct them. Let’s recap what we learned in `List`.

```kotlin
data class Person(val name: String, val age: Int)

val names = listOf("Alice", "Bob", "Charles")
val ages = listOf(10, 10, 20)

fun people(): List<Person> =
  names.zip(ages) { name, age ->
    Person(name, age)
  }
```

### Filter or Group By

Based on the previous, what if you want to find out all the persons who are 10 years old? You may tempt to use `filter()` to do this.

```kotlin
people().filter { it.age == 10 }
```

You can also do this by using `groupBy()`.

```kotlin
val map = people().groupBy(Person::age)
// map[10]
```

Which one is preferred? I think `groupBy()` might be a better candidate as you only have to write only once. With `filter()`, you might have to write another filter if you want to find people who are 20 years old, for example.

If you only need two groups, then `partition()` function is more direct because it divides the contents into two lists based on the predicate. `groupBy()` is appropriate when you need more than two resulting groups.

### AssociateWith or AssociateBy

`associateWith()` allows to take a list of keys and build a `Map` by associating each of these keys with a value created by its parameter.

Example:

```kotlin
val result: Map<Person, String>
  = people().associateWith { it.name }
/* result will be
mapOf(
  Person("Alice", 10) to "Alice",
  Person("Bob", 10) to "Bob",
  Person("Charles", 20) to "Charles"
)
*/
```

`associateBy` is the reverse of `associateWith`.

```kotlin
val result: Map<Person, String>
  = people().associateBy { it.name }
/* result will be
mapOf(
  "Alice" to Person("Alice", 10),
  "Bob" to Person("Bob", 10),
  "Charles" to Person("Charles", 20)
)
*/
```
