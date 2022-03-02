---
title: "Kotlin testing framework"
header:
  image: https://1.bp.blogspot.com/-KqG0T2RCgNY/YViCbKcHVAI/AAAAAAAADcw/C8KJsIjoXr49n7tCmq00hRj0bRAok5fHgCLcBGAsYHQ/w640-h346/S35UegQ.png
categories:
  - Tech
tags:
  - Kotlin
---

Alright. Who here think that testing is optional? Even though some doesn't write tests, I believe no one will openly say so. Oops. it hurts.

> Constant testing is essential for rapid program development.

If you do testing, what is your favourite testing framework/ library? What? Do you mean there is more than just JUnit? No worry if you have the same question - I do too. Well after reading sometimes, there are

- [JUnit][junit] is one of the most popular Java test framework, and easily used from within Kotlin. No wonder many of us stick with JUnit framework. (As the time of writing, the latest version of JUnit is 5.)∏
- [Kotest][kotest] is designed for Kotlin, and takes many advantages of Kotlin language features. This is what they said in the website - Kotest is a flexible and elegant multi-platform test framework for Kotlin with extensive assertions and integrated property testing.
- [Spek Framework][spek] is another interesting approach to testing. Based on the website, it said "Spek is a specification framework that allows you easily define specifications in a clear, understandable, human readable way. You call them tests, we call them specifications."

Probably, you are familiar with JUnit style. Here, this is what Spek looks like for two of their styles:

```kotlin
/* Style 1 : describe it */
object SimpleSpec: Spek({
    describe("a calculator") {
        val calculator = SampleCalculator()

        on("addition") {
            val sum = calculator.sum(2, 4)

            it("should return the result of adding the first number to the second number") {
                assertEquals(6, sum)
            }
        }
    }
}
```

```kotlin
/* Style 1 : given, on, it */
object CalculatorSpec: Spek({
    given("a calculator") {
        val calculator = SampleCalculator()
        on("addition") {
            val sum = calculator.sum(2, 4)
            it("should return the result of adding the first number to the second number") {
                assertEquals(6, sum)
            }
        }
    }
}
```

Conclusion
After seeing there is other choices, I am now tempted to try out some of those. What is your thought?

[junit]: https://junit.org/junit5/
[kotest]: https://kotest.io/
[spek]: https://spekframework.github.io/spek/docs/latest/
