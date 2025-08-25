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

After eight years of relying on native Android and iOS apps, my company's business growth had presented several new challenges. Our platform was struggling to scale, with development velocity constrained by the need to hire at least one developer for each platform before a project could even begin.

As the team expanded, a division emerged. The Android and iOS teams, each with their own leads and development practices, tended to work in silos. My key challenge was to address this by increasing efficiency and fostering a culture of reusability and knowledge-sharing across platforms.

### My Search for a Solution: The Kotlin Multiplatform Evaluation

To address this challenge, I began to evaluate cross-platform solutions together with 2 other android and iOS leads. My initial thought was to explore Kotlin Multiplatform (KMP), which seemed promising for sharing business logic.

After several discussions with the Android and iOS leads, I found that the iOS team was reluctant to share UI code due to their ongoing migration to SwiftUI. However, we discovered that KMP could be used to build a shared library for non-UI code, which was a significant breakthrough.

My team and I initiated a **proof-of-concept** by building a deep-link parser to be shared between the apps. This was a critical first step in proving the value of a shared codebase.

### Strategic Insights from the Kotlin Multiplatform Proof-of-Concept

Our six-month evaluation period provided valuable insights:

- **Organizational and Technical Hurdles**: We discovered that KMP's lack of a mature Swift export at the time was a major deterrent for the iOS team. This showed me that technical compatibility is not enough; organizational buy-in is a critical factor in a large-scale migration.

- **Tooling and Development Efficiency**: The need to constantly switch between Xcode and Android Studio highlighted the high cost of a fragmented development environment. I learned that a seamless developer experience is essential for a project's success.

- **Team Dynamics**: My team and I intentionally gave the iOS lead the space to explore and learn, to ensure we addressed their concerns and gave them a sense of ownership in the process. This taught me that building trust is key to successful collaboration.

### The Strategic Pivot to React Native

In a sudden turn of events, the React Native idea was introduced to my team. I quickly recognized its strategic advantages. With the New Architecture announced in 2024, React Native had made significant performance improvements.

The business case was further strengthened by two key factors:

- **Over-the-Air (OTA) Updates**: React Native's unique ability to ship instant updates to our users was a huge selling point.

- **Resourcing Efficiency**: With an internal team of web developers already proficient in React, I saw an opportunity to consolidate our talent pool and accelerate our resourcing strategy.

The team quickly built a prototype that resembled an existing product. Using AI tools, we were able to quickly validate the idea and secure buy-in from senior leadership.

### Lessons Learned as a Leader

This journey taught me valuable lessons that go beyond the technical. As a leader, I realized that the success of a technology initiative depends on:

- **Bridging the Technical and Human Gaps**: The frontend project was driven by a backend team, which caused significant friction. This experience taught me the importance of empowering the right people with the right skills to drive a project forward.

- **Navigating Tooling Hurdles**: Even with advanced tools, we faced significant challenges. I learned to identify these hurdles early and create a support system for the team to overcome them.

While you could read many articles on migrating platforms from a technical standpoint, this experience has been a masterclass in collaboration, adaptation, and leadership. It has prepared me to lead future teams through their own transformation journeys.
