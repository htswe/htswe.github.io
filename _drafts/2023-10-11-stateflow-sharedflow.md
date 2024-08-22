# StateFlow and SharedFlow

## Exposing `Flow` instead of `LiveData` in the ViewModel

It is a massive anti-pattern to use `LiveData` somewhere other than `View` and `ViewModel`. It is mainly because observing `LiveData` object and performing transformation is always on *main thread* although we want them to execute on *background thread*.

`Flow` is probably the best option that could be used across layers in both UI and non-UI layers. We do not need to convert `Flow` to `LiveData`, hence less mental overhead. Moreover, `Flow` comes with plenty of operators that we could leverage upon.

Lastly, without `LiveData`, it means we have no dependency on Android Framework and easily convertible to Kotlin Multiplatform Project.

It sounds so great, what about disadvantage? Maybe more boilerplate codes.

## Naive Approach - Exposing regular Flows

The usage of `Flow` is pretty straightforward. In activity,

```kotlin
activity
========
lifecycleScope.launch {
    viewModel.currentStockPrice.collect { uiState ->
        render(uiState)
    }
}
```

```kotlin
viewmodel
=========
val currentStockPrice: Flow<UiState>
    = stockPriceDataSource.latestStockList
        .map {
            UiState.Success(it) as UiState
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onComplete {
            println("Flow has completed")
        }
```

It is launched from `lifecycleScope`, therefore it is tied to the lifecycle of the activity. It will be cancelled when the activity gets destroyed.

Next, it is no longer needed to do `null` check unlike `LiveData` unless `currentStockPrice` is `nullable`. This is great to have non null type.

It looks good when we run the app. However, there is some flaws.

1. The first flaw is that Flow producer continues to run even when the app is in background.
2. Activity receives emissions and renders UI in the background.
3. Multiple collectors create multiple flows. The desired approach would be same emissions are received by all collectors.
4. Configuration change restarts the flow. Rotating device or switching light/dark mode will restart the flow.

## Lifecycle-aware Coroutines with "repeatOnLifecycle()"

The `Flow` by itself doesn't know anything about the Android lifecycle. In order to make it aware, we could manually start or stop the job, therefore we won't be making network call when the app is background.

```kotlin

var job: Job? = null

override fun onStart() {
    super.onStart()
    job = lifecycleScope.launch {
        viewModel.currentStockPrice.collect { uiState ->
            render(uiState)
        }
    }
}

override fun onStop() {
    super.onStop()
    job?.cancel()
}
```

It works, however, there is a lot of boilerplate codes to write. Fortunately, we already have a function on `repeatOnLifeCycle` to avoid writing these boilerplate codes.
Here are some samples on how we could leverage `repeatOnLifecycle`.

```kotlin
override fun onCreate() {
    lifecycleScope.launch {
        repeatOnLifecycle(Lifecycle.State.STARTED) {
            viewModel.currentStockPrice.collect { uiState ->
                render(uiState)
            }
        }
    }
}
```

```kotlin
lifecycleScope.launch {
    viewModel.currentStockPrice
        .flowWithLifecycle(lifecycle, Lifecycle.State.STARTED)
        .collect { uiState ->
            render(uiState)
         }
}
```

## Flows are cold

With the help from `repeatOnLifecycle`, the `Flow` is much better to become aware of Android lifecycle and no longer calling network even when the app goes into background. However, we are still facing the problem of "multiple collectors create multiple flows".

To demonstrate that,

```kotlin
override fun onCreate() {
    lifecycleScope.launch {
        repeatOnLifecycle(Lifecycle.State.STARTED) {
            launch {
                viewModel.currentStockPrice.collect { uiState1 ->
                    println("uiState1")
                }
            }
            launch {
                viewModel.currentStockPrice.collect { uiState2 ->
                    println("uiState2")
                }
            }
        }
    }
}
```

The `Flow` builder are cold by default. What it meant that it only become active upon collection. The code in the `Flow` builder is only executed when someone starts to collect from it. If nobody ever collects from the `Flow`, the code inside the `Flow` will actually never be executed. This will be the first property of cold `Flow`.

Second property of cold `Flow` is that it will become inactive when coroutine get cancelled. To demonstrate this, we add the `delay` and cancel `job` before all the flow emits are done.

```kotlin
fun myColdFlow = flow {
    println("emit 1")
    emit(1)
    delay(1000)

    println("emit 2")
    emit(2)
    delay(1000)

    println("emit 3")
    emit(3)
}

var job = launch {
    myColdFlow
        .onCompletion {
            println("collection completed")
        }
        .collect {
            println("collect $it")
        }
}

delay(1500)
job?.cancel()
```

```bash
emit 1
collect 1
emit 2
collect 2
collection completed
```

The 3rd property of cold `Flow` is that each emission to every collectors. In another word, each `collect` has own stream of data. To demonstrate this property, let's assume we have two collectors.

```kotlin
launch {
    myColdFlow
        .collect {
            println("collect#1 $it")
        }
}

launch {
    myColdFlow
        .collect {
            println("collect#2 $it")
        }
}
```

```bash
emit 1
emit 1
collect#1 1
collect#2 1
.
.
emit 3
emit 3
collect#1 3
collect#2 3
```

As we could see, each emit statement is printed twice, therefore, the code inside `flow` builder is executed for each collectors. The values are not shared which will lead us to the next post about `SharedFlow`.

## SharedFlows are hot

Unlike cold `Flow`, hot `Flow` are active whether there is collector or not.

```kotlin
val sharedFlow = MutableSharedFlow<Int>()
val scope = CoroutineScope(Dispatchers.Default)

scope.launch {
    repeat(times: 5) {
        println("Emits $it)
        sharedFlow.emit(it)
        delay(500)
    }
}

Thread.sleep(3000) // so that bash is able to execute and show the result
```

```bash
Emits 0
Emits 1
Emits 2
Emits 3
Emits 4
```

As we see, hot `Flow` emits regardless of the collector. As a result, there is also a drawback. If there is no active collector, we might lose the emitted value.

```kotlin
val sharedFlow = MutableSharedFlow<Int>()
val scope = CoroutineScope(Dispatchers.Default)

scope.launch {
    repeat(times: 5) {
        println("Emits $it)
        sharedFlow.emit(it)
        delay(100)
    }
}

Thread.sleep(300) // so that bash is able to execute and show the result

scope.launch {
    sharedFlow.collect {
        println("Collects $it")
    }
}

```

```bash
Emits 0
Emits 1
Emits 2
Emits 3
Collects 3
Emits 4
Collects 4
```

As the collector only starts to collect after `300` sleep, the collector misses earlier emissions.

The 2nd property states that hot `Flow` stays active even when there is no more collector. As we have seen, the `Flow` emits whether there is collector or not. The emission and collection are independent to each other. It is because the emission and collection for hot `Flow` run in own coroutine. In cold `Flow`, both perform in same coroutine.

The 3rd property is that the emissions are shared among all collectors.

```kotlin
...
scope.launch {
    sharedFlow.collect {
        println("Collects#1 $it")
    }
}

scope.launch {
    sharedFlow.collect {
        println("Collects#2 $it")
    }
}
```

```bash
Emits 0
Emits 1
Emits 2
Emits 3
Collects#1 3
Collects#2 3
Emits 4
Collects#1 4
Collects#2 4
```

Emissions are shared between the two collectors. Therefore this type of `Flow` is called a `SharedFlow`.

## Converting Flows to SharedFlows with "shareIn()"

Now, we are going to convert our cold `Flow` to hot `Flow` (`SharedFlow`). We understand that in cold `Flow`, each collector has its own stream of data. We want to share the emission of `Flow`. Furthermore, with cold `Flow`, when there is configuration change (eg. rotating screen or toggling light/dark mode), it restarts the `Flow`. It is because in cold `Flow`, the cancellation of coroutine will cancel the `Flow`. In hot `Flow`, both emission and collection are independent from each other, therefore it will keep on working even when the coroutine is cancelled.

```kotlin
val currentStockPrice: Flow<UiState>
    = stockPriceDataSource.latestStockList
        .map {
            UiState.Success(it) as UiState
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onComplete {
            println("Flow has completed")
        }
        .shareIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed()
        )
```

Just by adding `shareIn` operator, our `flow` is now becoming a `SharedFlow`. The operator has some parameters.

1. `scope`, since we are on viewModel and we want it to stop emitting when viewModel is destoryed, we will go with `viewModelScope`.
2. `started` is an interface for `SharingStarted` and it controls when the coroutine starts to collect and emit values. There are 3 `SharingStarted` objects that we could use from Coroutine library. Since it is an interface, we could also add our own object as well. Let's see a bit more.
   1. `SharingStarted.Eagerly()` option, the flow of the data source would start immediately with/without collectors. For our above example, we do not want that. We do not want to miss any event. Moreover, it will also continue when we do not have any more collector. In our case, it means our network request will not stop. Therefore, this option is not suitable for us.
   2. `SharingStarted.Lazily()` option, will work similar to `Eagerly`. The difference is that it starts lazily when the first collector starts to collect from `SharedFlow`. This will guarantee that the first collector will get all emitted values. However, there is still the same problem about the upstream flow continues even when there is no more collector. So it is not what we need too.
   3. `SharingStarted.WhileSubscribed()` option, it starts collecting on the first collector and stops on the last collectors. It happened during somebody subscribed. It is quite suitable for our above example.

## Keeping upstream Flow alive during configuration change

So far, in the previous blog, we used `shareIn` operator to convert `Flow` to `SharedFlow`. By doing so, multiple collectors share the same flow. However, if we toggle configuration changes in android (ie. rotate screen or switch light/dark mode), we could find that **configuration changes restarts the flow instead of keeping it alive**.

The problem is `whileSubscribe()` option that we are using. This option collects the flow when the first collector starts collecting and stops when last collector stops collecting. Since there is a configuration changes, the `activity` instance is destroyed on `onStop` method, which will make all collectors for `flow` destroyed too. Since the last collector stops, the flow completed. When `onCreate` method is called, the activity starts collecting from `SharedFlow` again.

The good news is that we could do it with pretty simple fix. We could add a stop time value to `whileSubscribed()` behavior.

```kotlin
val currentStockPrice: Flow<UiState>
    = stockPriceDataSource.latestStockList
        .map {
            UiState.Success(it) as UiState
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onComplete {
            println("Flow has completed")
        }
        .shareIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(stopTimeoutMills = 5000),
            relay = 1,
        )
```

The default value for `stopTimeoutMills` is zero, which means the coroutine of flow is immediately canceled once there is no more collector.
A good value set (some inside by Google library) is ***5 seconds***. This means to tell the android framework not to destroy immediately and wait for the timeout first.

However, now we have another problem. So if we do a configuration change once again, we could see a blank screen for a couple of seconds. The reason is after the activity is destroyed, the UI in new activity is not updated and waiting for an event in new UI flow. We could apply `replay = 1` to re-trigger the last event.

## StateFlow

In previous post, we were finally able to create a flow that works as expected. This was a `SharedFlow` with a `replay = 1`. We use this flow to emit a state, the UI state. In the case of coroutine library, there is another type of `Flow` that is specifically designed for the usecase of emitting states. It is `StateFlow`.

`StateFlow` is a special purpose, high performance and efficient implementation of `SharedFlow` for the narrow but widely used case of sharing state. `StateFlow` always has an initial value and replace with most recent value to the subscriber.

In another word, `StateFlow` is basically just an optimized `SharedFlow` with a `replay = 1` and with an initial value. In term of code, there are not much different from `SharedFlow`.

One interesting thing about `StateFlow` is that it is not thread safe when we are directly assigning values to immutable `StateFlow`.

```kotlin
suspend fun main() {
    val counter = MutableStateFlow(0)

    coroutineScope {
        repeat (10,000) {
            launch {
                counter.value = counter.value + 1
            }
        }
    }

    println(counter.value)
}
```

```bash
820 // some random value that is less than 10,000
```

The above example demonstrated that even though we expect 10,000 in `counter`, it is less than that when the counter is being updated from multiple threads. Let's make it thread safe.

```kotlin
...
    // counter.value = counter.value + 1 (not thread safe)
    counter.update { value ->
        value + 1
    }
...
```

## Converting Flows to StateFlows with "stateIn()"

Converting `Flow` to `StateFlow` is similar to `SharedFlow`.

```kotlin
val currentStockPrice: Flow<UiState>
    = stockPriceDataSource.latestStockList
        .map {
            UiState.Success(it) as UiState
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onComplete {
            println("Flow has completed")
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(stopTimeoutMills = 5000),
            initialValue = UiState.Loading,
        )
```

We use `stateIn` operator to convert the `Flow` to `StateFlow`. The `scope` and `started` have been discussed in `shareIn` topic. Since `StateFlow` already has `relay = 1`, there is no `relay`, instead it needs `initialValue`.

## SharedFlow vs StateFlow

|            | `SharedFlow` | `StateFlow` |
| -------- | -------- | -------- |
| Initial value | No | Yes |
| Replay Cache | Customizable | Fixed size of 1 |
| Subsequent equal value emit | Yes | No |
