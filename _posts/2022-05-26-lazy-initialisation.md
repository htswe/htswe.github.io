---
title: "Lazy initialization"
header:
  image: https://images.pexels.com/photos/7723962/pexels-photo-7723962.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

So far, we have **two** ways to initialize properties:

1. Store the initial value at the point of definition, or in the constructor
2. Define a custom getter that computes the property for each access

But what if there is a third usecase where it would be costly to initialize and we might not need to use it. For example, an heavy IO computation, network requests and database access are costly operations. If we follow the above two ways, it could make application take longer for start-up time and performing unnecessary work that is never used or not required to use it immediately.

This usecase becomes so frequent that Kotlin has added a built-in solution - `lazy`.

### `Lazy` concept

The concept isn't new or unique to Kotlin. Laziness could be implemented within other languages, whether or not there is built-in solution. Kotlin provides this concept using [property delegation]({{ site.baseurl }}{% link _posts/2022-05-06-property-delegate.md %}).

```kotlin
val iAmLazy: String by lazy { "I am lazy" }

print(iAmLazy)
```

Without `lazy` initialization, we'd be forced to make them `vars`, producing less reliable code.

```kotlin
class LazyInt(val init: () -> Int) {
  private var iAmLazy: Int? = null
  val value: Int
    get() {
      if (iAmLazy == null)
        iAmLazy = init()
      return iAmLazy!!
    }
}

val later = LazyInt {
  print("hi")
  100
}
// first time call
print(later.value) // hi 100
print(later.value) // 100
```

### Conclusion

It is true that sometimes we need to construct the properties that could be costly for initialization. Often, we could not be sure that property will be used in the program at all. This concept of `lazy` initialization was designed to prevent unnecessary initialization.
