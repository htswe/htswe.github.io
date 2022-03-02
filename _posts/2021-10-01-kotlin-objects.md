---
title: "Some interesting things from Kotlin Objects"
header:
  image: https://1.bp.blogspot.com/-_4BgY4EkF00/YVSI_DXOBFI/AAAAAAAADcU/NhtzJWFoLTY-__HV0xk9_veoKSqIzuAAwCLcBGAsYHQ/w640-h490/1v8udg.jpg
categories:
  - Tech
tags:
  - Kotlin
---

> Objects are the foundation for many modern languages, including Kotlin.

While I am looking at Kotlin object-oriented programming concept, there are some interesting things that I thought of taking note and sharing with you.

### Member function vs Methods

A function defined within a class belongs to that class. In Kotlin, we call these member functions of the class. Some object-oriented languages like Java choose to call them methods, a term that came from early object-oriented languages like Smalltalk. So it is the lingo -- use it correctly.

### Mutable or Immutable Properties

> A property is a var or val that's part of a class.
> A `var` property can be reassigned, while a `val` property can't. Defining a top-level `val` is safe because it cannot be modified. However, defining a mutable (`var`) top-level property is considered an anti-pattern.

```kotlin
val constant = 100
var counter = 1

fun inc() = counter++
fun dec() = counter--
```

Why is the `var` in the above code anti-pattern? As your program becomes more complex, it becomes harder to maintain the shared mutable state. You cannot guarantee it will change correctly.

### It is reference, not object

When a variable is assigned with another variable, it is not creating a new object. In fact, it is actually reference to the object.

```kotlin
class Car {
  var color: String = "Red"
}

fun main() {
  val aCar = Car()
  val bCar = aCar

  print("${aCar.color}") // Red
  print("${bCar.color}") // Red

  aCar.color = "Blue"
  print("${aCar.color}") // Blue
  print("${bCar.color}") // Blue
}
```

Remember that `var` and `val` control references rather than objects. A var allows you to rebind a reference to a new different object and a val prevents you from doing so.

### Visibility

This is particularly important if your code is being used by someone else. Best example is the library. The consumers of library don't want to rewrite their codes for a new version of the library. However, the library creator must be free to modify and make improvement, with some certainty that the client code won't get affected.

To control this visibility, Kotlin provides access modifiers. Library creators decide what is and is not accessible by the client programmer using the modifiers `public`, `private`, `protected` and `internal`.

![image-center](https://1.bp.blogspot.com/-fLAS2j05q_I/YVcmNBIGQlI/AAAAAAAADck/PivKn9cCTGMcjVRLvn-fbeQs4swZtq2pwCLcBGAsYHQ/w640-h480/Screenshot%2B2021-10-01%2Bat%2B11.15.37%2BPM.png){: .align-center}

So, think carefully on which access modifiers is suitable for each usecase.

5. Wait, what is `internal` access modifier?
   Real programs are often large. It can be helpful to divide such programs into one or more modules. A module is a logically independent part of a codebase.

An `internal` definition is accessible only inside the module where it is defined. `internal` lands somewhere between `private` and `public` - use it when private is too restrictive but you don't want an element to be a part of public API.

### Conclusion

Sometimes, it is little pieces that matter when you are experiencing a programming language. You may think those above things are common in some programming languages as well and you are totally right. Read more about Why Kotlin post on the motivation of Kotlin. So what is your favourite thing in this post?
