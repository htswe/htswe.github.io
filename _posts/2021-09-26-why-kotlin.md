---
title: "Why Kotlin"
header:
  image: https://1.bp.blogspot.com/-mGvp3fpQfbk/YVCFLePKOEI/AAAAAAAADbM/74sd-gSsWnUJyfOCnMYVvs_jNboDwyeTwCLcBGAsYHQ/w640-h429/unnamed.jpg
categories:
  - Tech
tags:
  - Kotlin
---

Why Kotlin? I mean why we need Kotlin in this world. Don't we have enough of programming language already? This was exactly the question that I have when Kotlin was first heard back in 2016. And then I didn't embark, part of the reasons was because most of the codes that I have to write/ maintain were written in Java.

It only came to me during 2018 when I was working on a project. I remembered that I was in holiday trip and I have to learn some basic syntax before I come back to start working on a new project.

Enough about why or when I picked up Kotlin. Let's see why we need Kotlin.

### Java History

Let's go back to 1995 when Java was first created by James Gosling and his team. They were given the task of writing code for TV set-top box. They decided that they didn't like C++ and instead of creating the box, created the Java language. What a badass. Their company, Sun Microsystems, put an enormous marketing push behind the free language to attempt domination of the emerging Internet landscape.

The perceived time window for Internet domination put a lot of pressure on Java language design, resulting in a significant number of flaws. You can find more about those in the book "Thinking in Java".

Although Java was remarkably successful, an important Kotlin design goal is to fix Java's flaws so the programmers can be more productive.

Java's success came from two innovation features:

1. VM (Virtual Machine)
2. GC (Garbage Collection)

#### VM

What is VM? It is an immediate layer between the language and the hardware. The language doesn't have to generate machine code for a particular processor. It only needs to generate an immediate language called bytecode that runs on the virtual machine. This JVM (Java VM) gave rise to the Java slogan - "write once, run everywhere". Other languages like Groovy or Clojure also target the same JVM.

#### Garbage Collection

It solves the problem of forgetting to release the memory, or when it is difficult to know when a piece of storage is no longer used.

### Kotlin Introduction

![image-center](https://blog.jetbrains.com/wp-content/uploads/2016/02/kotlin-1_0_Banner.png){: .align-center}

Just as C++ was initially intended to be "a better C", Kotlin was initially oriented towards being "a better Java". But it is now more than that. It **pragmatically** selects only the most successful and helpful features from other programming languages, thus if you have background in another programming language, you might recognise some features from that language in Kotlin.

Hence, The reason why Kotlin was created is to maximise productivity by leveraging tested concepts from other languages. Those includes

**Readability**
Readability is the primary goal in the design of the language. It makes it so by using concise syntax.

**Tooling**
As it comes from JetBrains, we can expect some quality in the developer tooling. It has the first class support, and they are all done by experienced people.

**Multi-Paradigm**
It supports multiple programming paradigms such as imperative programming, functional programming and object-oriented programming.

**Multi-Platform**
Although we know Kotlin for Android app development, Kotlin can be complied into different targets:

1. JVM (.class file)
2. Android (.dex file) : Current runtime is ART while former was called Dalvik.
3. JavaScript (web)
4. Native (machine code)

### Conclusion

Andrey Breslav, Kotlin Lead Language Designer, once said "Languages are often selected by passion, not reason... I'm trying to make Kotlin a language that is loved for a reason."

Here is the [blog post][kotlin-blog-post] by him when Kotlin was released to version 1 back in 2016.

![image-center](https://1.bp.blogspot.com/-I4zQsTT9Is0/YVCVEgsdF-I/AAAAAAAADbc/U71z1B8eLB8mTi7DzZ8qG1YpDbAwwvKvgCLcBGAsYHQ/w640-h636/Kirby-holding-a-sign-Meme-Infinite-love-meme.jpg){: .align-center}

[kotlin-blog-post]: https://blog.jetbrains.com/kotlin/2016/02/kotlin-1-0-released-pragmatic-language-for-jvm-and-android/
