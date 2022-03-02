---
title: "If expression"
header:
  image: https://1.bp.blogspot.com/-ZPWZZ5H_MIo/YVMzyoc68SI/AAAAAAAADcE/Hgtwa2TVv4oQcbT6cjBobwPTN0wBXWIQgCLcBGAsYHQ/w640-h480/yellow-octopus-happy-meme-16.jpg
categories:
  - Tech
tags:
  - Kotlin
---

One of basic things that gives me a spark in the eye is when I realise in Kotlin that:

> Either branch of an `if` expression can be a multiline block of code surrounded by curly braces.

```kotlin
fun main() {
    val mall = "jem"
    val time = 10

    val isShoppingMallOpen = if (
        mall == "jem" || mall == "vivo"
    ) {
        // in a block
        val openHour = 8
        val closeHour = 12
        println("Mall operates from $openHour to $closeHour")
        time in openHour..closeHour
    } else {
        false // single line
    }

    println("$isShoppingMallOpen")
}
```

What does Kotlin syntax surprise you? Are you a fan of block code?
