---
title: "Extension lambdas"
header:
  image: https://images.pexels.com/photos/302304/pexels-photo-302304.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
  - Advanced
---

> Any fool can write code that a computer can understand. Good programmers write code that humans can understand.

> <cite><a href="https://martinfowler.com/">Martin Fowler</a></cite>

An extension lambda is like an extension function. It defines a lambda instead of a function.

```kotlin
val a: (String, Int) -> String = { str, n ->
  str.repeat(n)
}

val b: String.(Int) -> String = {
  this.repeat(it)
}

a("Rambo", 2) // RamboRambo

"Rambo".b(2) //RamboRambo
b("Rambo", 2) //RamboRambo
```

Both `a` and `b` yield same result. `a` is an ordinary lambda like the ones we usually see in a lot of places. It takes two params - `String` and `Int`, then returns a `String`. The lambda body also has two params `str` and `n`, followed by the arrow `->`.

`b` moves the `String` param outside the parenthesis and it changes similar to extension function `String.(Int)`. Just like extension function, the object of the type being extended, becomes the receiver and `this` is now referring to `String`. There is one interesting thing about it too. While we could use `"Rambo".b(2)`, `b` can also be called using the traditional form `b("Rambo", 2)`.

> Kotlin documentation usually refers **extension lambdas** as **_function literals with receiver_**. The term **_function literals_** encompasses both lambdas and anonymous functions.

### Extension Lambda with multiple parameters

Like an extension function, an extension lambda can have multiple parameters:

```kotlin
val zero: Int.() -> Boolean = {
  this == 0
}

val one: Int.(Int) -> Boolean = {
  this % it == 0
}

val two: Int.(Int, Int) -> Boolean = { arg1, arg2 ->
  this % (arg1 + arg2) == 0
}
```

### Extension Lambda with function reference

Using `::` we can pass a function reference when an extension lambda is expected.

```kotlin
fun f1(n: Int) = n + 3
fun Int.f2() = this + 3

fun Int.d1(f: (Int) -> Int) = f(this) * 2
fun Int.d2(f: Int.() -> Int) = f() * 2

fun main() {
  5.d1(::f1) // (5+3)*2 = 16
  5.d2(::f1) // (5+3)*2 = 16

  5.d1(Int::f2) // (5+3)*2 = 16
  5.d2(Int::f2) // (5+3)*2 = 16
}
```

A reference to an extension function has the same type as an extension lambda: `Int::f2` has the type `Int.() -> Int`.

### Extension Lambda in Kotlin library

The Kotlin standard library contains a number of functions that work with extension lambdas. For example, `StringBuilder` is a modifiable object that produces an immutable `String` when you call `toString()`. In contract, the more modern [`buildString()`][build-string-func] accepts an extension lambda. It creates its own `StringBuilder` object, applies the extension lambda to that object, then calls `toString()` to produce the result:

```kotlin
fun original(): String {
  val sb = StringBuilder()
  sb.append("123:")
  ('a'..'f').forEach { sb.append(it) }
  return sb.toString()
}

fun clean() = buildString {
  append("123:")
  ('a'..'f').forEach { sb.append(it) }
}

fun evenCleaner() =
  ('a'..'f').joinToString("", "123:")


original() // 123:abcdef
clean() // 123:abcdef
evenCleaner() // 123:abcdef
```

The `original()` is usually what we used to do for `StringBuilder`. Using `buildString()` in `clean()`, we do not even need to create a `StringBuilder` and makes everything much more succinct. If we dig even deeper, we can even find more direct solution that will skip the builder altogether.

So we ask what other standard library functions similar to `buildString()` that uses extension lambdas. We found `Lists` and `Maps`.

```kotlin
val chars: List<String> = buildList {
  add("English:")
  ('a'..'z').forEach { add("$it") }
}

val charMap: Map<Char, Int> = buildMap {
  ('a'..'z').forEachIndexed { n, ch ->
    put(ch, n) // {a=0, b=1, ... , z=25}
  }
}
```

### Writing Builder using Extension Lambda

The post is getting long and probably, we will end with this good piece. We already know the [Builder][builder-design-pattern] pattern has several benefits:

1. It creates in multi-steps process, easier to construct if the object is complex.
2. It produces different variations with the same code
3. It separates common construction code from specialized code, making it easier to write & read.

Implementing builders using extension lambdas provide **additional** benefits, which is the creation of a _Domain-Specific-Language_ (DSL). The goal of DSL is syntax that is comfortable and sensible to a user who is a domain expert rather than programming expert. This allows that user to produce working solution knowing only a small subset of the surrounding language while at the same time benefitting from the structure and safety of that language.

```kotlin
open class Recipe : ArrayList<RecipeUnit>()

open class RecipeUnit {
  override fun toString() = "${this::class.simpleName}"
}
```

```kotlin
open class Operation : RecipeUnit()
class Toast: Operation()
class Grill: Operation()
class PutOnPlate: Operation()
```

```kotlin
open class Ingredient : RecipeUnit()
class Bread : Ingredient()
class Butter : Ingredient()
class Jam : Ingredient()
```

```kotlin
open class Sandwich : Recipe() {
  fun execute(op: Operation): Sandwich {
    add(op)
    return this
  }
  fun grill() = execute(Grill())
  fun toast() = execute(Toast())
  fun putOnPlate() = execute(PutOnPlate())
}
```

```kotlin
fun sandwich(fillings: Sandwich.() -> Unit): Sandwich {
  val sandwich = Sandwich()
  sandwich.add(Bread())
  sandwich.toast()
  sandwich.fillings() // lambda magic here
  sandwich.putOnPlate()
  return sandwich
}

val butterJamSandwich = sandwich {
  add(Butter()) // i want butter
  add(Jam()) // i also want jam
}
```

`sandwich()` gives us the basic ingredients and operations required to make **any** toasted sandwich. The beauty here is when we want different variant type of sandwich, the `fillings` extension lambda allows the caller to configure the `Sandwich` in numerous different ways, but with no constructor for each configuration. How awesome it is.

I found one of my coworkers wrote an Android extension of `SpannableText` which allows you to specify underline, italic, bold, foreground colors, etc using this extension lambda in DSL approach. It looks cleaner and easier to use it.

[build-string-func]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html
[builder-design-pattern]: https://en.wikipedia.org/wiki/Builder_pattern
