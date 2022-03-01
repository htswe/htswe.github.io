---
title: "Extension function is a magic"
header:
  image: https://1.bp.blogspot.com/-4L6EAJm6hv0/YXLjZavTOaI/AAAAAAAADek/gOHQNNEENJA1RJ8ZyQF-m4FmSa1DbZgcQCLcBGAsYHQ/s512/magic.jpg
categories:
  - Tech
tags:
  - Kotlin
---

This is one of my most favorite features of Kotlin - **Extension Function**. Imagine this. You are using a 3rd party library - String that have all the things that I would need for text manipulation- _almost_. If I have another one or two functions under `String` topic, Extension Function would solve this problem beautifully.

Kotlin’s _extension functions_ effectively add member functions to existing class.

```kotlin
fun String.addGreetingEmoji() = "Hi $this 👋"
"Dave".addGreetingEmoji() // Hi Dave 👋
```

You can also apply extension function to your own class.

```kotlin
class Team(public val name: String)

fun Team.intro(noOfPeople: Int) = "$name team has $noOfPeople."

fun main() {
  val team = Team("Man Utd")
  println(team.intro(11)) //Man Utd team has 11.
}
```

Note that the extension function `Team.intro` can access to name in `Team` class. If the `name` is `private`, the extension function couldn’t access from the extension function.

For extension function, you can rewrite Team.intro(Int) into `intro(Team, Int)`. The only reason for using extension function is the syntax. This is called _syntax sugar_, which is cleaner and more powerful.
