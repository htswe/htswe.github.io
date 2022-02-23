---
title: "Another choice for middle ground (Composition Vs Inheritance)"
header:
  image: https://images.unsplash.com/photo-1503135279369-a01d94b5c9e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

Both composition and inheritance place sub objects inside the new class. With composition, the sub object is explicit whereas the sub object with inheritance is implicit.

Class delegation is midway between composition and inheritance. Like composition, we have to place the member inside our class. Like inheritance, it exposes the interface of the sub object.

Let’s see this:

```kotlin
interface Control {
    fun up(speed: Int): String
    fun down(speed: Int): String
    fun left(speed: Int): String
    fun right(speed: Int): String
}

class DroneController: Control {
    override fun up(speed: Int) = "up $speed"
    override fun down(speed: Int) = "down $speed"
    override fun left(speed: Int) = "left $speed"
    override fun right(speed: Int) = "right $speed"
}
```

What if we want a super drone controller that can speed 2 times while going up and down? What about inheriting `DroneController`? But it doesn’t work because `DroneController` is not `open`.

We can create an instance of `DroneController` as a property and explicitly delegate all the exposed member functions to that instance.

```kotlin
class SuperDroneController: Control {
    private val controller = DroneController()

    // delegate
    override fun up(speed: Int)
        = controller.up(speed) + "2x"
    override fun down(speed: Int)
        = controller.down(speed) + "2x"
    override fun left(speed: Int) = controller.left(speed)
    override fun right(speed: Int) = controller.right(speed)
}
```

It is called [Delegation Design Pattern](https://en.wikipedia.org/wiki/Delegation_pattern) which allows object composition to achieve the same code reuse as inheritance.

### Kotlin `by` keyword

For the `SuperDroneController` example, in Kotlin language, we can remove the boilerplate code with the keyword `by`.

```kotlin
class SuperDroneController(dController: DroneController) :
    Control by dController {

    override fun up(speed: Int)
        = dController.up(speed) + "2x"
    override fun down(speed: Int)
        = dController.down(speed) + "2x"
}
```

### Use case: Multiple Class inheritance

Kotlin doesn’t support multiple class inheritance, but you can simulate it using class delegation. For example, you want to produce a button by combining a class that draws a rectangle and another class that manages mouse events.

```kotlin
// a class drawing rectangle

interface Rectangle {
    fun draw(): String
}

class ButtonImage (val w: Int, val h: Int) : Rectangle {
    override fun draw() =
        "drawing with $w and $h"
}
```

Next is the mouse event manager.

```kotlin
interface MouseManager {
    fun click(): Boolean
}

class UserInput : MouseManager {
    override fun click() = true
}
```

Finally, here is our `Button`.

```kotlin
class Button(image: Rectangle, input: MouseManager) :
    Rectangle by image, MouseManager by input

fun main() {
    val buttonImage = ButtonImage(10, 5)
    val userInput = UserInput()

    button = Button(buttonImage, userInput)
    button.draw()
    button.click()
}
```

### Summary

Inheritance can be constraining. We cannot inherit a class when the superclass is not `open` or our class is already extending another class. Class delegation can help us with that.

Usually, there are 3 choices: _inheritance_, _composition_ and _class delegation_. Try **_composition_** first. it is the simplest one and solves most of use cases. If you really need a hierarchy of type, then go for inheritance. If none of them can work, then think about class delegation.
