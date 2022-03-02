---
title: "2 Most Celebrated Kotlin Features"
header:
  image: https://1.bp.blogspot.com/-Z6FZEMLrAxM/YVHY1mDqNgI/AAAAAAAADbs/2oh5tmlnobkji9i5gpMqx1lSrz9kCtQfwCLcBGAsYHQ/w640-h368/4955744.jpg
categories:
  - Tech
tags:
  - Kotlin
---

While there are many great features in Kotlin language, there are two features which are very impactful and outstanding.

1. Java interoperability
2. Indication of Emptiness

### 1. Java interoperability

To be a "better C", C++ must be backwards compatible with the syntax with C, but Kotlin does not have to be backward compatible with the syntax with Java.

> It just have to work with the JVM.

This actually frees up the Kotlin team to create a much cleaner and more powerful syntax, without the complication that hindered Java.

For Kotlin, to be a "better Java", the experience of using Kotlin has to be pleasant. What did Kotlin do? Kotlin allows you to **coexist** with Java projects. If you already have Java project codes, fret not. You can also put Kotlin code inside the Java project and _Java doesn't even know that Kotlin is there_. How awesome it is.

With this effortless Java interoperability, it becomes very cheap or even free to try Kotlin to see whether it's a good fit. You can try Kotlin in either Android Studio or Community free version from JetBrains that supports both Java and Kotlin. There is even the tool to convert Java to Kotlin.

### 2. Indication of Emptiness

Emptiness (No value) is one of the challenging programming problem. Imagine this. You have a dictionary (no, not the book). It is a key value pairs and you use it to look up to get the value for given key. What if there is no key? You will reply with "no value for that key".

Okay. A little bit of history - _null reference_ was invented in 1965 for **ALGOL** by Tony Haore, who later called it "**_my billion-dollar mistake_**". You can find out more at here.

<iframe width="382" height="266" src="https://www.youtube.com/embed/ybrQvs4x0Ps" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

One problem with this null reference is that it is too simple -- sometimes being told a room is empty isn't enough. You might need to know, for example, why it is empty. This leads to the second problem: the implementation. For efficiency's sake, it was typically just a special value that could fit in the small amount of memory, and what better than the memory already allocated for that information?

The original C language did not automatically initialise storage when you declare a variable, which caused numerous problems. C++ improved it by setting newly allocated storage to all ZEROS. So if you are not initialise an integer variable, the default is zero (0). This seems not so bad, but it allowed the uninitialised values to quietly slip through the crack. Worse case, if a piece of storage is a pointer that points to another storage, a null pointer would point at location zero in memory, which is certainly not what you want.

Java addresses this problem by reporting such errors at runtime. But it can only be discovered at runtime. The only way to ensure the program won't crash is by running the program. This problem has wasted a huge amount of developer time in finding them.

Kotlin solves it by preventing operation at compile time, before the program could run. Hence it is one of the biggest impactful feature for Java developers who are now adapting to Kotlin. This can minimise or eliminate Java's most famous _NullPointerException_.

If you are wondering what NullPointerException, I have a message for you.

![image-center](https://1.bp.blogspot.com/-JNuTOjliIzg/YVHlOpvDAsI/AAAAAAAADb0/Rw8r6TgbrG44PzI9bIq4wR-_GAiu2XA_ACLcBGAsYHQ/w640-h384/questions-develoer-jobs-tags-users-earch-what-is-a-nullpointerexception-32587564.png){: .align-center}
