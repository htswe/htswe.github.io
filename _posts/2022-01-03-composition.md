---
title: "Composition"
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

One of most compelling arguments for object oriented programming is **_code reuse_**.

When i was a noob, when I heard the word "reuse", I thought it was "copying code". Copying seems an easy solution, but in reality, it doesn't work very well. As time passes, the requirements change. Applying the changes to all the duplicate codes become a maintenance nightmare. The question of "Did you find all the copies?" is always haunting me? And then you wish the reused code can be changed in just one place.

In object-oriented programming, we will reuse code by creating new classes, but instead of creating them from scratch, we use existing classes that someone has already built and debugged. The trick is to use the classes without dirtying the existing code.

![composing different flowers](https://images.pexels.com/photos/4466460/pexels-photo-4466460.jpeg){: .align-center}

Inheritance is one way to achieve this. Inheritance creates a new class as a _type of_ an existing class. You add code to the form of the existing class without modifying the original. Inheritance is a _cornerstone of object-oriented programming_.

### Composition

You can also choose a simpler approach, by creating objects of existing classes inside the new class. It is called _composition_. The new class is composed of objects of existing codes.

Composition is a _has-a_ relationship. "A house is a building and has a room" can be expressed:

```
interface Building
interface Room

interface House : Building {
	val room: Room
}
```

If your house has two rooms, the composition makes it easy to change:

```
interface House: Building {
	val room_one: Room
	val room_two: Room
}
```

### What to pick? Composition or Inheritance

Both composition and inheritance put object inside the new class. **Composition** has explicit objects while **Inheritance** has implicit objects.

**Composition** provides the functionality of an existing class, but not its interface. Usually you embed an object to use its features. To hide the object completely, you can make the object `private`.

```
class Existing {
	fun f1() = "feature1"
	fun f2() = "feature2"
}

class CompositionClass {
	private val existing = Existing()
	fun operation() = existing.f1() + existing.f2()
}
```

The users of `CompositionClass` will not have any idea that it is using the `Existing()` since we hide it under `private`. In case we find a better way to do the operation with another different class, we can modify it without impacting the user of `CompositionClass`.

If `CompositionClass` inherited `Existing`, the client now has to cast `CompositionClass` to `Existing`. The inheritance makes the relationship explicit. If you want to change `Existing`, you will break code that relies upon the connection.

### Summary

If you stuck with your code using inheritance, then give a try using composition. Sometimes, it might make your code cleaner. If you think your code need changes in near future, go with composition first because it will allow you to swap the underlying objects without breaking any of the clients.
