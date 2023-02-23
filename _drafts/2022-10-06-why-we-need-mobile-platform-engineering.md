---
title: "Why we need mobile platform engineering"
classes: wide
toc: true
categories:
  - Tech
tags:
  - Learning, Mobile Engineering
---

### Reinventing the wheel

So you joined a young startup which is growing at rapid pace. Every week, you are seeing new name popping up in the team channel that you are in. You look around. Now new joiners are overwhleming more. The codebase seems alright. Very soon, all people are assigned into different squads and working fast & furious to release features after features. You no longer see other team mates who are working inside the same code base. 

One day, you realise some legacy feature is broken. Maybe the old version does not work anymore. The new version needs extra effort for refactoring. You look around and think who will do it. No one seems to care. You just make some walkaround so that you could go ahead with your day. But codebase starts to detoriate. It is fine - not my problem. Someone will do in some day. Sound familiar?

Let's take a look at another issue. As the number of mobile engineers working on an app grows, the frequency of "reinventing the wheel" are more often emerged. Since most engineering teams are usually designed to work in a smaller functional scrum teams (frontend, backend, QA, etc), the awareness and knowledge often limited within the team. For example, Team A needs a functionality to upload picture and they will make their own choices and create own implementation. When another team faces the same problem, ideally, we hope the team will talk to Team A and uses what Team A has implemented. In reality, we often spot that the other team does not talk to other teams and makes another implementation on their own. Ouch!

On the better case, the other team modify some cases to suit what Team A has implemented. Now, the functionality has been modified by two or more teams. It now faces another challenge on who is responsible for maintaining those code or fixing bugs (eg. updating libraries).

### Code is a liability

![image-center](https://images.unsplash.com/photo-1491173461353-3af78fcaa183)

In many mobile engineering team, **internal mobile libraries** are created during the development of the app. In many cases, those libraries are just wrapper around a well known solution (eg. `Retrofit` for networking, `Room` for data storage). The goal of wrapper is to have ability to swap to different solution (eg. `Room` to `Realm`) should the team needs it.

Most common internal mobile libraries are -
* logging (eg. `Timber`)
* analytics (eg. `Firebase`)
* data storage (eg. `Room`)
* networking
* testing
* image loading
* navigation
* architecture
* push notification
* others - location, doc scanning or sharing, etc

Most engineers often assume that the main challenge is to build the library itself and migrate the old code. However, the real issue comes when the team finds out that how painful the maintainence can be, after many years of implementation.

The usual issues are
1. The main author/ engineer has left the company. It is more common in today context where many engineers stay around 2-3 years before they move to another company.
2. Quick fixes and walkarounds detoriate the quality of the library. When a team comes across an issue that they could fix it by changing some area of the shared library, people often go for a short-term fix.
3. Team has no bandwidth for maintainace. Often the teams that building product features barely get time for small maintainence work. If major changes are required, there is no one taking this on.

### Mobile platform team

Creating mobile platform team helps us address some of the above issues. We started a mobile platform team when we have ~40 mobile engineers working on the same app and starting feeling the real pain of maintainance for ~5 years old codebase. There is no "golden rule" on the size of the team nor the age of the codebase, however most companies make this step when there are about 20 to 30 mobile engineers.

What does Mobile platform team do? One thing for sure is that the team is not meant to work on features. In my opinion, the primary goal is to fill the gap of often what the feature mobile engineering teams won't be able to address. For example, setting up mobile infra requirement or automating app distribution via continous delivery channels.

### What does platform team do

It will be very much depending on the company or individual team. Here are some of things that platform own, not limited.

* **Mobile build infra**, if the company is using 3rd party vendor for builds, the platform team might own the vendor assessment and relationship and the setup of the builds.
* **App release** Our mobile apps are released via some automated tools such as `fastlane` & build scripts. This area includes setting up and testing the release process.
* **Developer productivity** If one engineer takes 5 minutes to build a project and we have 100 engineers, it is going to become very costly. Developer productivity looks into tools and optimisation that could help the engineer's day to day expereience.
* **Architecture** As the team size grows, it becomes extremely important that the work produced are easily maintainable. Setting architecture and protecting it being broken is another important tasks for scaling teams.
* **Dependencies** We depend on both internal and external code artifacts. Keeping up to date and managing dependencies are becoming essential.
* **Reliability & performance** Is the app crashing too often? Is the app slow? Monitoring and measuring performance are important to build quality app.


### Conclusion

![image-center](https://images.unsplash.com/photo-1533928298208-27ff66555d8d)

The biggest challenge is finding out **when it is a good time to spin off** first mobile platform team. Large mobile teams clearly need one or more of platform teams. Starting too late means that the team will face lots of redundancy in code and inconsistency across the app implementation. What about starting early? It will be a drawback to make business case. Why hire engineer who are producing any feature?

In the next article, we will look at some experiemenations and guidelines on running a healthy mobile platform team.
