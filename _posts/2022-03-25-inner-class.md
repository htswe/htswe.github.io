---
title: "Inner class"
header:
  image: https://images.pexels.com/photos/4553165/pexels-photo-4553165.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

### Inner class

Inner class is like nested class, but an object of inner class maintains a reference to the outer class. `inner` has implicit link to outer class.

```kotlin
class House(private sqm: Int) {
  open inner class Room(name: String) {
    fun callOuter() =
      "Room $name is part of House $sqm in size"
  }

  private inner class BedRoom : Room("Master")
  fun masterRoom(): Room = BedRoom()
}
```

- The function `callOuter()` which is a member of `Room` class is able to access `sqm` without qualification.
- Because `BedRoom` inherits from `Room`, `BedRoom` must also be `inner` class. Nested classes cannot inherit from `inner` classes.
- `inner data` class is not allowed.

### Qualified `this`

We usually use `this` in a class to represent the current object. It is useful when we are accessing to the property or the member function. How would it work in inner class? To clear up on this confusion, Kotlin provides the qualified `this` syntax followed by `@` symbol and the name of the _target_ class.

```kotlin
class House(name: String = "House") {
  inner class Room(name: String = "Room") {
    fun whichIsWhich() {
      print(this.name) // Room
      print(this@Room.name) // Room
      print(this@House.name) // House
    }
  }
}
```

### Local & Anonymous Inner Class

Class defined inside member function are called _local inner class_. It can be created anonymously, using an `object` expression. In that case, the `inner` keyword is not used, but is implied.

```kotlin

fun interface Pet {
  fun speak(): String
}

object Pet {

  // local inner class
  fun dog(): Pet {
    val word = "Bark!"
    class Dog : Pet {
      override fun speak() = word
    }
    return Dog()
  }

  // anonymous inner class
  fun cat(): Pet {
    val word = "Meow~"
    return object : Pet {
      override fun speak() = word
    }
  }

  // using SAM conversion
  fun bird(): Pet {
    val word = "Chirp"
    return Pet { word }
  }
}

print(Pet.dog().speak()) // Bark!
print(Pet.cat().speak()) // Meow~
print(Pet.bird().speak()) // Chirp
```

### Summary

In Kotlin, file can contain multiple top level classes and functions. Therefore, it is quite rare for a need to use local classes. But if we need it, it is basic and straightforward. For example, it is reasonable to create a simple `data class` that is used inside a function. If a local class is getting complex, you can always convert to a regular class.
