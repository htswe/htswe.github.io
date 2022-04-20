---
title: "Scope function"
header:
  image: https://images.pexels.com/photos/247600/pexels-photo-247600.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

When I started doing Kotlin, the one that confused me the most was `scope` functions. However, once I understand what it is, it becomes my most favorite Kotlin feature. It makes code clear, concise and so easy to read. If you are still not sure what I am talking about, read on.

> Scope functions create a temporary scope wherein you could access an object without using its name.

There are five scope functions in Kotlin: `let()`, `apply()`, `with()`, `run()` and `also()`. They are designed to work with a lambda and do not require an `import`. All five scope works almost the same, but differ in

1. accessing the `context` object (`it` vs `this`)
2. what it returns

Let's look into some of the use cases for each of those five scope functions.

### `let()`

`let()` function is probably the most widely used in Kotlin to provide null safety call. As the name implies, it lets/allows to execute the block ONLY with non-null value when it use with `?` operator.

```kotlin
var aValue: Int? = null
aValue?.let { print(it) } // nothing will happen since aValue is null

aValue = 10
aValue?.let { print(it) } // 10
```

Another thing worth to mention here is the usage of `it` as context object. On the above example, `it` represents `aValue` which is no longer a `null`.

### `apply()`

It is pretty self explanatory. `apply()` is used to apply whatever in the block to the object properties.

```kotlin
class MyObj() {
  val name: String
  val color: String
}

val myObj = MyObj().apply {
  this.name = "Hello Object"
  color = "blue" // `this` can be hidden
}

print(myObj) // {name: Hello Object, color: blue}
```

### `with()`

If `apply()` mutates the properties of the object, `with` allows us to access the properties without repeating the object name.

```kotlin
print(myObj.name)
print(myObj.color)

with(myObj) {
  print(name) //this.name = name
  print(color)
}
```

### `run()`

`run()` combines `let()` and `with()`. Imagine that you want to invoke some functions of the object, provided that the object itself is not `null`.

```kotlin
myObj?.run {
  print(name) // this.name = name
}
```

### `also()`

Last, but not least `also()` can be used when we have to perform additional operations.

```kotlin
val list = mutableListOf<Int>(1, 2, 3)
list.also {
  it.add(4)
  it.remove(2)
}

print(list) // [1, 3, 4]
```

### Conclusion

Scope functions that access the context object using `this` produce cleanest syntax since we can omit `this` keyword within the scope. For those scope functions using `it`, we could rename to any lambda argument, so we can improve the readability if `it` keyword is too confusing.

Most importantly, check and align with the teammates on which scope functions is being agreed and used across the project codebase.
