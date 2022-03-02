---
title: "Property Accessor"
header:
  image: https://1.bp.blogspot.com/-959boLzvq3M/YXLaO05UyqI/AAAAAAAADec/Gcwzbw96dVYveJ_GWCJOT38_iroxS2_VwCLcBGAsYHQ/s600/cookie-the-pom-gySMaocSdqs-unsplash.jpg
categories:
  - Tech
tags:
  - Kotlin
---

If you are new to Kotlin, there is something in property accessor that you might find it interesting. There are two methods - `get()` for getter and `set()` for setter for each property.

```kotlin
var a: Int = 0
  get() {
    return field
  }
  set(value) {
    field = value
  }
```

The default behaviour for a property returns its stored value from a getter and modifies it with a setter. Inside those, the stored value is manipulated indirectly using the `field` keyword and they are only valid within these two functions.

If we set a property as `private`, both `get()` and `set()` will also become `private`. For best practice, we usually make setter function as `private` whereas getter function will be exposed as `public`. In that way, the property is allowed to read outside the class, however, the value can only be modified within the same class.

```kotlin
class Balance {
  var value: Int = 0
    private set

  fun inc() = value++
  fun dec() = value--
}

class Client() {
  val balance = Balance()
  balance.inc() // this will increase the balance
  print(balance.value)
}
```
