---
title: "If expression in String templates"
header:
  image: https://1.bp.blogspot.com/-mCmKhgHazpc/YVR_HBw1t8I/AAAAAAAADcM/zb4hHv9HH1U1BnuUVivR45qTG-KneyeUgCLcBGAsYHQ/w640-h426/portrait-man-exploding-mind-182038960.jpg
categories:
  - Tech
tags:
  - Kotlin
---

You can insert a value within a `String` using `String` templates. Remember to use a `$` before the identifier name:

```kotlin
fun main() {
    val areYouOkay = true

    println(
        "${if (areYouOkay) "okay" else "nooo"}"
    )
}
```

### Bonus

Use triple-quoted `String` to store multiline text or text with special characters.

```kotlin
fun main() {
val age = 5
println(
  """ // triple quotes
  {
  "name" : "Kotlin",
  "age" : $age
  }
  """
)
}
```
