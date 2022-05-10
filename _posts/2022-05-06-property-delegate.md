---
title: "Property Delegation"
header:
  image: https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Advanced
---

In Kotlin, we could connect a property to a delegate with the `by` keyword:

```kotlin
class Readable(val n: Int) {
  val value: String by BasicRead()
}

class BasicRead {
  operator fun getValue(
    r: Readable,
    property: KProperty<*>
  ) = "value: ${r.n}"
}
```

The delegate's class must contain a `getValue()` function if the property is a `val` (read only). If the property is `var` (read/write), both `getValue()` and `setValue()` functions must be present.
Because `getValue()` returns a `String`, the type of `value` must also be `String`.

The second parameter `property` is a special type [`KProperty`][kproperty], and this provides reflective information about the delegated property.

If the delegated property is a `var`, it must handle both reading and writing, so the delegate class requires both `getValue()` and `setValue()`.

```kotlin

class ReadWritable(var n: Int) {
  var msg = ""
  var value: String by BasicReadWrite()
}

class BasicReadWrite {

  operator fun getValue(
    rw: ReadWriteable,
    property: KProperty<*>
  ) = "getValue: ${rw.n}"

  operator fun setValue(
    rw: ReadWritable,
    property: KProperty<*>,
    newString: String
  ) {
    rw.n = newString.toIntOrNull() ?: 0
    rw.msg = "setValue to ${rw.n}"
  }

}

val x = ReadWritable(11)
print(x.value) //getValue: 11

x.value = 99
print(x.value) //getValue: 99
print(x.msg) //setValue to 99
```

### Using `ReadOnlyProperty` interface

The above example doesn't implement an `interface`. The class can be used as a delegate if it follows the convention of having necessary function(s) with signature(s). However, we could also implement the `ReadOnlyProperty` -

```kotlin
class ReadableByInterface(val n: Int) {
  val value: String by BasicReadWithInterface()
  // SAM conversion
  val valueSam: String by ReadOnlyProperty { _, _ -> "getValue: $n" }
}

class BasicReadWithInterface : ReadOnlyProperty<ReadableByInterface, String> {
  override operator fun getValue(
    r: ReadableByInterface,
    property: KProperty<*>
  ) = "value: ${r.n}"
}
```

Implementing `ReadOnlyProperty` communicates us that `BasicReadWithInterface` can be used as a delegate and ensures a proper `getValue()` definition. Likewise, we could use `ReadWriteProperty` interface to implement to become a delegate, ensuring proper `getValue()` and `setValue()` definitions.

### Extension Function as Delegate

`getValue()` and `setValue()` can be written as extension functions as well.

```kotlin
class Addition(val a: Int, val b: Int) {
  val sum by Sum()
}

class Sum

operator fun Sum.getValue(
  r: Addition,
  property: KProperty<*>
) = r.a + r.b

val addition = Addition(10, 20)
print(addition.sum) // 30
```

Why is this important? Using extension, we could use existing class that we are unable to modify or inherit and still delegate a property with it.

### Summary

The delegation pattern has proven to be a good alternative to implementation inheritance, and Kotlin supports it natively with zero boilerplate code.

With delegate, we could just implement once, add them to a library and reuse them later. The most common property that we use often is `lazy` where the value is computed only on first access.

[kproperty]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/
