---
title: "The Journey from Native App to Cross-Platform"
header:
  image: https://images.pexels.com/photos/10376473/pexels-photo-10376473.jpeg
categories:
  - Development
tags:
  - Cross-Platform, Migration, Mobile Development
---

### Introduction

The company I worked for was using native android and ios apps for the past 8 years. The business was growing and there are many challenges arising from the native apps. For example, we need to hire at least one developer for each platform and we couldn't begin the development until all the new developers are hired.

As the business was growing, the number of developers in the team was increasing and most of the times, the two platforms were developed in different ways. The team was also focusing on their own platform and they were not able to help each other.

Each team has their own leads and they tend to work on their own platform. There is an increasing pressure on the team leaders to become more effective and efficient. The pressure of reusable and sharable among the platforms was increasing.

### Kotlin Multiplatform

As the pressure begun, we started to look for a solution to the problem. We started to look at Kotlin Multiplatform and we were very excited about the idea of using Kotlin for the shared code.

After the few rounds of discussions among android and iOS lead, we found that sharing UI code is not desirable from the iOS team as they are in the process of migrating to SwiftUI and they are not ready to share the UI code.

We found out that Kotlin Multiplatform could be shared as a library and we could use it in both android and iOS apps. This was a great news and we started to explore the idea.

Our first step was building a deep-link parser that can be shared between the apps. We built a shared library that can parse the deep-link and extract the parameters.

### Lesson Learnt in Kotlin Multiplatform

At the time of writing this article, Kotlin Multiplatform does not have the capability in Swift export yet. This was one of the reasons why our iOS team was reluctant to accept the idea.

The tooling (IDE) support is not there yet for Kotlin Multiplatform. We have switched between Xcode and Android Studio in order to build and test the code.

Exporting the library in Maven was easy, but requires some efforts to setup for the Swift Package Manager.

Kotlin Multiplatform is the closest cross platform to Android developer, but not for the iOS developer. We took special consideration to let iOS member to take the lead role and give enough space to explore and learn.

After sharing it with the other team leads, some teams are more willing while others are not.

It also took about 6 months for the discussion and the POC work.

### React Native

In unexpected turn of event, React Native idea was introduced. With the new architecture announced in 2024, there was the news that it has been significantly improved the React Native bridge and better performance in React Native older architecture.

The Over-the-air (OTA) update is one of the unique selling points for React Native.

We also have teams in web development who are proficient in React framework, hence it makes more sense from the resourcing point of view. Consolidating into the same/similar tech stack was the attractive option.

The team quickly build an prototype that looks like an existing product. With the good timing with Cursor editor and AI agents, the team managed to build the prototype really quickly.

### Lesson Learnt in React Native

With the right time and right tool, React Native development is really fast. The AI tool helps a lot and with existing codebase to reference, things move really well.

There are two types of React Native - greenfield and brownfield. The documentation for Android is much harder to find and solve than iOS platform. A number of them seems like hacky, for example, using `sed` command to overwrite the version numbers in `node_modules` which is auto-generated.

When the frontend project was driven by backend team leads, there have been unhappiness and criticism from both engineering and non-engineering teams. Some frontend leads were pondering if they are now forced to choose between "do" or "leave".

### Conclusion

You could read many articles about migrating from one platform to another. Most of them are probably written from technical standpoint such as app performance, coding, maintainability, etc.

In this article, it is taken from human aspect on what could have been done and what challenge we will face with the different approach. If you have any good story to share, I would like to hear about it too.
