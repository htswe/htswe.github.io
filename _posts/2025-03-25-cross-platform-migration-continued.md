---
title: "Cross-Platform Migration: Two Weeks In"
header:
  image: https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg
categories:
  - Development
tags:
  - Cross-Platform, Migration, Mobile Development
---

### Introduction

It's been two weeks since my last article on our [cross-platform migration journey](2025-03-11-migration-to-cross-platform). During this time, I've become more involved in standups and discussions, gaining insights from both iOS and Android engineers. However, the journey is not without its challenges.

### The Chaos

![Team Collaboration](https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg)

There are two main groups: one focused on replacing a MVP feature screen with React Native, and another setting up foundational elements like CI/CD scripts and utilities such as Firebase and Datadog. This two group focuses on making an brownfield app.

The team is currently experiencing a sense of chaos and disorganization. With numerous stakeholders involved, including web developers, design system teams, backend engineers assisting with integration tests, backend engineers developing untested greenfield react native pages, and automation QA setting up UI tests, the team feels overwhelmed. There is a lack of clarity regarding goals and plans, leaving the team feeling lost and uncertain about the direction of the project.

Despite working towards a common goal, the team feels divided. This division, coupled with the influx of stakeholders, exacerbates the feeling of disarray.

#### Feature Team Dynamics

The feature team, comprising both Android and iOS engineers, seems to collaborate more closely, likely because they work on the same screens. However, most engineers still use their own platform-specific tools, with only a few testing on both Android and iOS simulators.

#### Foundation Team Challenges

The foundation team appears more distant, with each member focusing on their platform's builds. Surprisingly, there's little discussion about whether tasks should be common or shared, leading to duplicated efforts. For instance, secrets management differs between platforms, causing friction when integrating into a common repository.

### The Struggle

![Late Night Work](https://images.pexels.com/photos/4050299/pexels-photo-4050299.jpeg)

The team is working tirelessly, often late into the night. Newcomers face challenges with initial setups, as documentation is outdated due to ongoing changes. While Confluence pages help, they initially disrupt busy team members. A workshop with Codelab-style instructions proved beneficial, allowing sub-team leaders to train their teammates effectively.

### Personal Reflections

These past two weeks have been intense. My work hours have extended, balancing native tasks with new React Native responsibilities. The stress is palpable, with longer meetings and alignment challenges. Fortunately, my manager and mentor provide much-needed support.

#### Leadership and Learning

Working with two team heads (android and iOS) is challenging, especially when one is slow to respond. My mentor suggested volunteering to lead, but my manager seems less enthusiastic. Learning about CI/CD and JS bundling was initially tough, but tools like Cursor LLM accelerated my understanding. I was initially gathering insights on the team's experience on compile times and tool efficacy for native development.

### Looking Ahead

![Future Planning](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg)

App size has become a pressing issue, which I'll explore in my next post. Despite the challenges, this journey offers valuable lessons in collaboration and adaptation.

### Summary

The past two weeks have highlighted the complexities of cross-platform migration, from team dynamics to technical hurdles. While the road is challenging, the potential benefits make it a journey worth pursuing. Stay tuned for more insights as we continue this transformation.