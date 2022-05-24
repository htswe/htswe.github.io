---
title: "Property Delegation Tools"
header:
  image: https://images.pexels.com/photos/2842460/pexels-photo-2842460.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Advanced
---

The standard library contains special property delegation properties. `Map` is one of the few types in Kotlin library. Each property identifier becomes a `String` key for the map, and the property's type is captured in the associated value:

```kotlin
class Student(map: MutableMap<String, Any?>) {
  var name: String by map
  var age: Int by map
  var id: String by map
}

val aStudent = mutableMapOf<String, Any?>(
  "name" to "Jeep",
  "age" to 23,
  "id" to "X231322"
)
```

### Property Setter vs Delegate Observable

We might remember using `set` to set a new value to the `var`.

```kotlin
var name: String
  set(value) {
    print("name: $value")
    field = value
  }

var age: Int
  set(value) {
    print("age: $value")
    field = age
  }
```

While property setter works fine, Delegates, on the other hand, allows for accessing to the property and its old value.

```kotlin
class Student {
  var log = ""
  var surname: String by observable("x") { prop, old, new ->
    log += "${prop.name}: $old -> $new"
  }
}

val student = Student()
student.surname = "Lee"
print(student.log) // surname: x -> Lee
```

`observable` takes two arguments:

1. initialValue, "x" in this case
2. a function to invoke when there is `onChange` event occurs.

### delegate vetoable

it is very similar to `observable` in delegate, but it can veto the modification of the value of property. For example, we might have some rule that the student surname must be more than one character for some reasons.

```kotlin
fun surnameLengthCheck(
  property: KProperty<*>,
  old: String,
  new: String
) = return new.length > 1

class Student {
  var surname: String by Delegates.vetoable("Lee", ::surnameLengthCheck)
}

val student = Student()
student.surname = "Tan"
student.surname = "x"

print(student.surname) //Tan and x is rejected because it fails surnameLengthCheck
```

### delegate notNull

The last function in `delegate` is `nonNull`. It returns on property delegate for read/write with a non-`null` value. It is initialized not during the object construction time, but later time. It tries to read the property before the initial value has been assigned.

### Conclusion

As we can see `delegates` function in the kotlin standard library could be used to guard or trace about the setting of new value. `notNull`, `observable` and `vetoable` could be used to customize for setting or tracing new value.
