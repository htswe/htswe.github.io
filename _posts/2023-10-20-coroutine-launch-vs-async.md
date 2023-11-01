---
title: "Coroutine Launch vs Async"
header:
  image: https://images.pexels.com/photos/39619/auto-racing-nascar-car-sport-39619.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Asynchronous
  - Coroutine
---

If you are new to `coroutine` or looking for the continuation, you could start from the previous article.

* [Coroutine Builders]({% post_url 2023-10-15-coroutine-builders %})

In this article, we will look at `launch` and `async` for making network requests.

### Network Request using `launch`

We could use `launch` for network request in both sequentially and concurrently.

For sequentially,

```kotlin
fun performNetworkRequestsSequentially() {
    uiState.value = UiState.Loading

    viewModelScope.launch {
        try {
            val oreo = mockApi.getAndroid(27) // get oreo first
            val pie = mockApi.getAndroid(28) // then pie
            val a10 = mockApi.getAndroid(29) // then android10

            val result = listOf(oreo, pie, a10)
            uiState.value = UiState.Success(result)
        } catch(exception: Exception) {
            uiState.value = UiState.Error("Failed")
        }   
    }
}
```

For concurrently,

```kotlin
fun performNetworkRequestsConcurrently() = runBlocking<Unit> {
    launch {
        val result1 = networkCall(1)
    }

    launch {
        val result2 = networkCall(2)
    }
}

suspend fun networkCall(number: Int): String {
    delay(500)
    return "Result $number"
}
```

The above code runs the network calls in parallel. However, those results are not accessible outside `launch` coroutine since the return for `launch` is a `Job`.

To access both results, we will need to use `join()` and a shared mutable state.

```kotlin
fun performNetworkRequestsConcurrently() = runBlocking<Unit> {
    val resultList = mutableListOf<String>()

    val job1 = launch {
        val result1 = networkCall(1)
        resultList.add(result1)
    }

    val job2 = launch {
        val result2 = networkCall(2)
        resultList.add(result2)
    } 

    job1.join()
    job2.join()

    print("Result list: $resultList")
}

suspend fun networkCall(number: Int): String {
    delay(500)
    return "Result $number"
}
```

Although it works in above code, `resultList` is a shared mutable state. A general rule in concurrent programming is to avoid shared mutable state whenever possible.

### Difference between `launch` and `async`

> `launch` returns `Job`. `async{}` returns `Deferred` (`Job` with `Result`).

Using `async`, the same functionality could be achieved without a shared mutable state.

```kotlin
fun performNetworkRequestsConcurrently() = runBlocking<Unit> {
    val deferred1 = async {
        val result1 = networkCall(1)
        result1
    }

    val deferred2 = async {
        val result2 = networkCall(2)
        result2
    } 

    val resultList = listOf(
        deferred1.await(),
        deferred2.await()
    )

    print("Result list: $resultList")
}

suspend fun networkCall(number: Int): String {
    delay(500)
    return "Result $number"
}
```

We could also add optional parameter to `async(start = CoroutineStart.LAZY)` and change to `deferred1.start()` to start lazily.

Let's try a little different using `async` to reflect some UI states. We will having `Loading` as well as `Error`.

```kotlin
fun performNetworkRequestsConcurrently()
{
    uiState.value = UiState.Loading

    val oreoDeferred = viewModelScope.async {
        mockApi.getAndroid(27)
    }

    val pieDeferred = viewModelScope.async {
        mockApi.getAndroid(28)
    }

    val a10Deferred = viewModelScope.async {
        mockApi.getAndroid(29)
    }

    viewModelScope.launch {
        try {
            awaitAll(oreoDeferred, pieDeferred, a10Deferred)
            uiState.value = UiState.Success()
        } catch (exception: Exception) {
            uiState.value = UiState.Error("Network Request Failed")
        }
        
    }
}
```

Using `awaitAll` for all the `Deferred` objects, we could make our code works. But if we do not know the exact number of network requests?

### Sequential unknown network requests

Imagine if we do not know the exact number of network requests and we want to make them run in sequential.

```kotlin
fun performNetworkRequestsSequentially() {
    uiState.value = UiState.Loading

    viewModelScope.launch {
        try {
            // this Api could return any number of android versions
            val recentVersions = mockApi.getRecentAndroidVersions()
            val recentFeatures = recentVersions.map { androidVersion -> 
                mockApi.getAndroid(androidVersion.apiLevel)
            }
            uiState.value = UiState.Success(recentFeatures)
        } catch(exception: Exception) {
            uiState.value = UiState.Error("Failed")
        }   
    }
}
```

## Concurrent unknown network requests

What about concurrent style if we do not know the exact number of network requests?

```kotlin
fun performNetworkRequestsConcurrently()
{
    uiState.value = UiState.Loading
    viewModelScope.launch {
        try {
            val recentVersions = mockApi.getRecentAndroidVersions()
            val versionFeatures = recentVersions.map { androidVersion ->
                async {
                    mockApi.getAndroid(androidVersion.apiLevel)
                }
            }.awaitAll()
            uiState.value = UiState.Success(versionFeatures)
        } catch (exception: Exception) {
            uiState.value = UiState.Error("Failed")
        }
    }
}
```

### Conclusion

Making network requests are often the usecase for `coroutine` and we look into it using `launch` and `async`. We also demonstrates sequential and concurrent request handling, highlighting the differences between the two approaches.

While `launch` will return `Job`, the use of `async` to obtain `Deferred` with wrapped results, simplifying result access.

We also explores handling both known and unknown sequential and concurrent network requests, emphasizing the flexibility and efficiency of coroutines in managing such scenarios. We hope this article provides a valuable understanding of how coroutines can effectively handle diverse network request scenarios.

Next, we will look into some useful higher-order functions from `coroutine`.
