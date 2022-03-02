---
title: "When expression"
header:
  image: https://1.bp.blogspot.com/-kNMrV_xmXU0/YXbFFezgtuI/AAAAAAAADfI/EJWmmFiWtE4nzNYFUQf6e8HD-ymbtqOHACLcBGAsYHQ/s491/Screenshot%2B2021-10-25%2Bat%2B10.53.44%2BPM.png
categories:
  - Tech
tags:
  - Kotlin
---

> A large part of computer programming is performing an action when a pattern matches.

Usually, this condition can be represented by `if` expression, however, when you have more than two or three choices to make, `when` expression are much nicer than `if` expression.

```kotlin
if (a == 0) print("a is zero")
else if (a == 1) print ("a is one")
else print ("a is neither zero nor one")

when (a) {
  0 -> print("a is zero")
  1 -> print("a is one")
  else -> print("a is neither zero nor one")
}
```

`when` expression makes the above code cleaner and more readable.

### When + Set

Many time, we will put a variable in the `when` expression. Do you also know that we can also match a `Set` of values against another `Set` of values as below

```kotlin
fun mixColors(first: String, second: String) =
  when(setOf(first, second)) {
    setOf("red","blue") -> "purple"
    setOf("red","yellow") -> "orange"
    setOf("blue", "yellow") -> "green"
    else -> "unknown"
  }

print(mixColors("red", "blue")) // purple
```

### When expression without argument

`when` has a special form that takes no argument. Omitting the argument means the branches can check different `Boolean` conditions.

```kotlin
val age = 17
val category = when {
  age < 17 -> "underage"
  age < 25 -> "young adult"
  else -> "adult"
}
```

### Conclusion

The expression `when` is overall a more elegant way to choose between several options.
