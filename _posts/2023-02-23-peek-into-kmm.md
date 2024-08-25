---
title: "Quick peek into KMM (Kotlin Multiplatform Mobile)"
header:
  image: https://images.pexels.com/photos/6039245/pexels-photo-6039245.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2
categories:
  - Tech
tags:
  - Learning
  - Mobile
---

### Introduction

Kotlin team is very ambitious and have been improving the experience of developers especially if you are working on Android. Together with Google, JetBrains who developed Kotlin makes many new tools and languages to increase productivity of developers. One of the shiny things that I have been curious for a long time is the idea of writing Kotlin code to build apps in both Android, iOS and Desktop. It is very tempting for someone who is already familiar with a language.

### Kotlin Multiplatform Mobile (KMM)

In September 2022, Kotlin team announced that KMM is in [Beta](https://kotlinlang.org/docs/components-stability.html). It is almost there, they said, but expects some migration steps may be required. KMM stable version will be coming in 2023 (which is this year). In mobile development, users expect us to support both iOS and Android. This expectation translates for most organization to hire 2 developers for each line of code to be written. The ongoing support and bug fix are also going to be expensive, not mentioning that both apps are expected to have same sets and functionality at the same time.

Any delay on one side of OS caused the other side to delay. Hence, cross platform development (Flutter from Google, React Native from Facebook) become popular.

### What to try

There is a great [documentation](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html) and video in (Youtube)[https://www.youtube.com/watch?v=2yd6rVJdICU] on how to get started from Kotlin team.

But I found this video much easier to understand - probably, it is short and straightforward.
{% include video id="ri6XfKmnC8w" provider="youtube" %}

But I really feel the documentation is so good that you could just skip the video. Maybe I am already familiar with mobile development.

The tool `kdoctor` is awesome. In most experiment, setting development environment (ie. installing necessary tools) has been painful sometimes. `kdoctor` checks our system and guide us what to do next.

My experience tells me that when it comes to install environment, it is also good to find environment switcher. `jenv` is one of the tools we could use if we like to have multiple `Java Runtime Environment (JRE)`. `jenv` allows us to switch different `JRE` within some command line without the needs to upgrade or downgrade the environment. This becomes handy if we are experimenting a lot of things and we want to keep things cleaner.

### What I think about it

It felt great to write Kotlin codes (mostly). If you are Android developer, you will feel home since we have to run for both Android and iOS app from **Android Studio**. `Gradle` is the build tool which Android developer are already familiar with.

If you are totally new to iOS and installing Xcode, it seems scary at first. But the template code that comes with creating new project makes it easy to understand. Well, if you understand some basic SwiftUi, it is easier.

The most important thing in my opinion is the understanding of the project structure. There are 3 main directory (`modules` in Gradle vocabulary) that you should know.

![image-center](https://kotlinlang.org/docs/images/basic-project-structure.png)

The concept is pretty much similar to React Native. When you have platform specific code (eg. Android permission, iOS keychain), you write those codes in their specific module. As much as possible, you keep codes in Shared module.

I will look more into what is sharable in future post. Based on the documentation, there is an example of using `Kotlin Coroutine` and `Ktor` for networking and serialization. Excellent example, I must say that. It demonstrates that networking utility library is available for KMM. Not sure if you like it. It seems that you have to learn a new utility library for things that you used to. I understand some well known libraries such as `Retrofit`, `Gson`, `Dagger` are already battle tested and ready for production. The good news is that some libraries are now moving to support `KMM`. It depends on the success of `KMM` to motivate more libraries to support cross platform. React Native has in fact moved into open source to get more support from community to build utility libraries. And endorsement from Kotlin team will be crucial too so that the developers will not have to struggle to find right library.

### Conclusion

If you are mobile developer or your business product is on mobile, you will be paying attention. Cross platform has some pros and cons, nevertheless, it has a place in today. If you are picking up Flutter, Dart is the language and both your developers need to learn that. React Native is in JavaScript/TypeScript, so it has its target audience. `KMM`, in my opinion, is targeting existing native mobile developers who are writing codes in `Kotlin` and `Swift`. Both languages are like cousins who looks very similar.

Will I use KMM when it is stable? Maybe not in existing codebase. But it is perfect for a pet project or personal project which doesn't need to use a lot of extensive features from each platform. How about you?
