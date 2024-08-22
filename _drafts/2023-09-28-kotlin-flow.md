# Kotlin Flow

## What is a flow?

A suspending function asynchronously returns a single value, but Kotlin flow returns multiple asynchronously computed values. It is like asynchronous data stream.

```kotlin
fun main() {
    val result = factorialOf(5)
}

private fun factorialOf(num: Int): BigInteger {
    var factorial = BigInteger.ONE
    for (i in 1..num) {
        Thread.sleep(10)
        factorial = factorial.multiply()
    }
    return factorial
}
```

The above function returns a single big integer value after the computation is finished. Our goal is to convert this function that returns not only the final result, but also all intermediate results.

We could try it with `List` that returns all the intermediate results.

```kotlin
private fun factorialOf(num: Int): List<BigInteger> = buildList {
    var factorial = BigInteger.ONE
    for (i in 1..num) {
        Thread.sleep(10)
        factorial = factorial.multiply()
        add(factorial)
    }
}
```

But it is not the data stream, we are received all data at once. Let's fix it using `Sequence`. `Sequence` allows us to lazily compute values.

```kotlin
private fun factorialOf(num: Int): Sequence<BigInteger> = sequence {
    var factorial = BigInteger.ONE
    for (i in 1..num) {
        Thread.sleep(10)
        factorial = factorial.multiply()
        yield(factorial)
    }
}
```

Now, we could see the data stream coming in different time. However, the data stream is still synchronous. It means that the main function is blocking our main thread. Here comes the `Flow`.

```kotlin
fun main() = runBlocking {
    launch {
        factorialOf(5).collect {
            println(it)
        }
    }

    println("Ready for more work")
}
private fun factorialOf(num: Int): Flow<BigInteger> = flow {
    var factorial = BigInteger.ONE
    for (i in 1..num) {
        delay(10)
        factorial = factorial.multiply()
        emit(factorial)
    }
}.flowOn(Dispatchers.Default)
```

The last thing is the difference between `suspend` function and `Flow`. The `suspend` function performs asynchronous operations and then returns a single value. In regular function that returns `Flow`, the `Flow` itself could perform asynchronous operations. `Flow` could return or emit multiple values.

## Reactive Programming

The foundation of Reactive Programming is the Observer pattern in which software components could observe other components and react accordingly to the changes.

`RxJava` and Kotlin `Flow` extends the idea by adding some useful operators for data processing and threading.

A good example is the `RoomDb` from Jetpack libraries. The database table are exposed as `Flow`, therefore we could use it to reflect the changes in the database immediately to the UI.

## Flow Builders

### `flowOf`

```kotlin

// collect as terminal operator
val myFlow = flowOf(1, 2, 3).collect {
    println(it)
}

```

### `asFlow`

```kotlin

listOf("a","b","c").asFlow().collect {
    println(it)
}

```

### `flow`

```kotlin

flow {
    delay(1000)
    emit("value")
}.collect {
    println(it)
}

```

We could even collect from other `flow` in the past block and re-emit.

```kotlin

flow {
    delay(1000)
    // flowOf("a","b","c").collect {
        // emit(it)
    // }
    emitAll(flowOf("a","b","c"))
}.collect {
    println(it)
}

// to shorten flowOf and collect, we could use `emitAll`.

```

## Terminal operators

```kotlin
val flow = flow {
    delay(100)
    println("Emitting first value")
    emit(1)
    delay(100)
    println("Emitting second value")
    emit(2)
}
```

Declaration alone won't execute the `println` statement until the terminal operator is used.

```kotlin
flow.collect {
    println("received $it")
}
```

We could also use other terminal operator, such as `first()` or `firstOrNull`. It will receive the first `emit` that fulfill the condition.

Likewise, there is also `last()` operator that capture the last `emit` item.

There is `single()` operator that expect only a single `emit` item.

For multiple items, we could use `toSet()` or `toList()` which will terminate the flow after the last item is emitted.

For reducing result, we could use operator such as `fold`

```kotlin
val item = flow.fold(initial: 5) { acc, emit ->
    acc + emit
}
println("Received after fold: $item")
```

## `launchIn` terminal operator

```kotlin
val flow = flow {
    delay(100)
    println("Emitting first value")
    emit(1)
    delay(100)
    println("Emitting second value")
    emit(2)
}

val scope = CoroutineScope(EmptyCoroutineContext)
flow
    .onEach { println("received $it") }
    .launchIn(scope)
```

If we look into the definition of `launchIn(scope)`, it is a simple `scope.launch` and the `flow.collect` inside the block.

```kotlin
scope.launch {
    flow.collect {
        println("received $it")
    }
}
```

With `launchIn`, it is much easier to read. There is also a subtle different. if we have another `flow` with same code, we will see both `launchIn` working in parallel.

```kotlin
val scope = CoroutineScope(EmptyCoroutineContext)
flow
    .onEach { println("received $it - 1") }
    .launchIn(scope)

flow
    .onEach { println("received $it - 2") }
    .launchIn(scope)
```

```bash
Emitting first value
Emitting first value
received 1 - 1
received 1 - 2
Emitting second value
Emitting second value
received 2 - 1
received 2 - 2
```

On the other hand, we make `collect` twice as below.

```kotlin
scope.launch {
    flow.collect {
        println("received first $it")
    }
    flow.collect {
        println("received second $it")
    }
}
```

```bash
Emitting first value
received 1 - 1
Emitting second value
received 2 - 1
Emitting first value
received 1 - 2
Emitting second value
received 2 - 2
```

With `launchIn`, the emits are in parallel, whereas, `flow.collect` is in serial.

## Lifecycle operators

There are two lifecycle operators in `flow`.

1. `onStart`
2. `onCompletion` 

With this two operators, we could now display Loading and Data UI State. One thing to take note is that we need `map` operator to transform the data into `UiState`.

```kotlin
flow
    .map {
        UiState.Success(it) as UiState
    }
    .onStart { 
        emit(UiState.Loading) 
    }
    .onEach { 
        println("received $it") 
    }
    .launchIn(scope)
```

## Terminal operator `asLiveData()`

Imagine we have an API call in every 5 seconds.

```kotlin
class NetworkDataSource(mockApi: Api): PriceDataSource {
    override val lastPrice: Flow<List<Stock>> = flow {
        val currentPrice = mockApi.getCurrentPrice()
        emit(currentPrice)
        delay(5_000)
    }
}


viewmodel
=========
val currentStockPriceAsLiveData: MutableLiveData<UiState> = MutableLiveData()

init {
    stockPriceDataSource.latestStockPrice
        .map {
            UiState.Success(it)
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onEach {
            currentStockPriceAsLiveData.value = it
        }
        .launchIn(viewModelScope)
}
```

This above code is a waste of API resource since it is still fetching the api even if the app is in the background. What we should do is to get the API calls while the app is foreground and it should stop when the app goes to background.

One way to solve it by assigning it as a `Job` and manually start or cancel it based on the lifecycle events, such as `onStart()` and `onStop`.

```kotlin

viewmodel
==========

var job: Job? = null

fun startFlowCollection() {
    job = stockPriceDataSource.latestStockPrice
            .map {
                UiState.Success(it)
            }
            .onStart {
                emit(UiState.Loading)
            }
            .onEach {
                currentStockPriceAsLiveData.value = it
            }
            .onCompletion {
                Timber.tag("myFlow").d("Flow has completed")
            }
            .launchIn(viewModelScope)
}

fun stopFlowCollection() {
    job?.cancel()
}


activity
========

override fun onStart() {
    super.onStart()
    viewModel.startFlowCollection()
}

override fun onStop() {
    super.onStop()
    viewModel.stopFlowCollection()
}
```

The above approach is not ideal since it is error prone and also require many steps to achieve it. One way that we could do is to make use of `asLiveData()`.

```kotlin
viewmodel
=========

val currentStockPriceAsLiveData: LiveData<UiState> = 
    stockPriceDataSource.latestStockPrice
        .map {
            UiState.Success(it)
        }
        .onStart {
            emit(UiState.Loading)
        }
        .onCompletion {
            Timber.tag("myFlow").d("Flow has completed")
        }
        .asLiveData()
```

The `asLiveData()` is a helper function from `androidx.lifecycle.livedate` that internally manages the `coroutineScope` with Android Lifecycle. One thing to take note is the `timeOutInMs`. The flow will complete after the timeout when the app goes to background. This is to help in case of configuration change that will not require to stop and restart the flow.

## Basic Intermediate Operators

There are a number of basic intermediate operators that could be complemented to the `Flow`. Some of them are quite familiar to us since it is the same operators in Collections.

> A good place to visualize is using [flowmarbles.com](flowmarbles.com) 

### `map` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .map { it * 2 }
    .collect {
        println(it) // 2, 4, 6, 8, 10
    }
```

### `filter` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .filter { it > 2 }
    .collect {
        println(it) // 3, 4, 5
    }
```

Similar `filter` opeators are `filterNot`, `filterNotNull` and `filterIsInstance`.

### `take` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .take { 3 }
    .collect {
        println(it) // 1, 2, 3
    }
```

Similarly, there is `takeWhile` operator as well. The difference between them and `filter` is that `filter` does not stop the flow. However, for `take` operators will stop once the predicate is false.

### `drop` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .drop { 3 }
    .collect {
        println(it) // 4, 5
    }
```

The `drop` or `dropWhile` will drop the first `n` or `predicate` emission.

### `transform` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .transform { 
        emit(it)
        emit(it * 10)
    }
    .collect {
        println(it) // 1, 10, 2, 20, 3, 30, 4, 40, 5, 50 
    }
```

Unlike `map` operator, `transform` operator could emit multiple values.

### `withIndex` operator

```kotlin
flowOf(1, 2, 3, 4, 5)
    .withIndex()
    .collect {
        println(it) // IndexedValue(0,1), IndexedValue(1,2),..
    }
```

### `distinctUntilChanged()` operator

```kotlin
flowOf(1, 1, 2, 2, 3)
    .distinctUntilChanged()
    .collect {
        println(it) // 1, 2, 3
    }
```

## Flow Exception Handling and Cancellation

### Flow Exception Handling

Flow exception could be detected at `onCompletion` flow lifecycle. In case of exception, there will be a `throwable` in that lifecycle.

```kotlin
private val stockFlow = flow {
    emit("Apple")
    emit("Microsoft")
}

stockFlow
    .onCompletion { cause ->
        if (cause ==  null)
            println("Flow completed successfully")
        else
            println("Flow completed with $cause exception")
    }
    .collect { stock ->
        println("collect $stock")
    }
```

For some reasons, the flow has an exception, the app will crash. To avoid app crash, we could use a normal `try-catch` block on the `Flow`.

```kotlin
private val stockFlow = flow {
    emit("Apple")
    emit("Microsoft")
    throw Exception("Network Exception")
}

try {
    stockFlow
        .onCompletion { cause ->
            if (cause ==  null)
                println("Flow completed successfully")
            else
                println("Flow completed with $cause exception")
        }
        .collect { stock ->
            println("collect $stock")
        }
} catch (e: Exception) {
    println("Caught exception $e")
}
```

We could also use the `catch` in the `Flow` api.

```kotlin
stockFlow
    .onCompletion { cause ->
        if (cause ==  null)
            println("Flow completed successfully")
        else
            println("Flow completed with $cause exception")
    }
    .catch { throwable ->
        println("Caught exception $throwable")
    }
    .collect { stock ->
        println("collect $stock")
    }
```

> !!! `catch` operator only catch those in the "upstream". However, the good thing is that we could use the operator to emit new value. For example, if we are fetching data from API and somehow it fails. Then we could use `catch` operator block to `emit` a default value.

### Exception Transparency

One of the important concepts in `Flow` is **Exception Transparency**. Let's take a look at the code below.

```kotlin
flow {
    try {
        emit(1)
    } catch (e: Exception) {
        println("Catch exception in flow builder")
    }
}.collect { emittedValue ->
    throw Exception("Exception in collect")
}
```

When the above code is run, we will see

```bash
Catch exception in flow builder
```

What happened is that each time `emit` is called, the `collect` block is executed. So on above example, the `collect` block throws an exception and it was caught in the `flow` block. It may be a little confusing for `Flow` user since the exception is handled in the upstream. What if we emit another value in `flow` block in the `catch`.

```kotlin
flow {
    try {
        emit(1)
    } catch (e: Exception) {
        println("Catch exception in flow builder")
        emit(2)
    }
}
```

The app will crash with the exception that will say something like this:

```bash
Exception in thread "main" java.lang.IllegalStateException:
  FlowException transparency is violated:
    Previous 'emit' call has thrown an exception
    ...
```

Therefore, **Exception Transparency** means

1. A downstream exception must always be propagated to the collector
2. Once an uncaught exception was thrown downstream, the Flow isn't allowed to emit additional value

The simplest way to ensure that we don't violate this Exception Transparency principle is by using the `catch` operator.

### The `retry()` operator

The `retry()` operator could be applied to either `emit` or `collect` of the `Flow`. For example,

```kotlin
flow {
    emit("a")
}.retry(retries = 3) { cause ->
    cause is NetworkException
}
```

This code will try emitting "a" for 3 times if the root cause of emit failure is due to `NetworkException`. For advanced usage, we could also apply `retryWhen` which gives us `attempt` number (starting from 0), so that we could write our predicate much better. For example, we could add `delay(1000 * attempt+1)` to exponential backing off when the network is unstable.

### Flow Cancellation

To cancel the flow, we could use the `cancel()` inside the `Flow` itself. If `cancel()` is cooperative Flow, it will cancel once it is done.

```kotlin
val numFlow = flow {
    emit(1)
    emit(2)
    emit(3)
}

numFlow
    .onCompletion { throwable ->
        if (throwable is CancellationException) {
            println("Flow got cancelled")
        }
    }
    .collect {
        println("Collect $it")
        if (it == 2) {
            cancel()
        }
    }
```

```bash
Collect 1
Collect 2
Flow got cancelled
```

However, it is not always cooperative for Flow if there is a heavy computation involved. In this case, we may want to use `ensureActive()` to check in between the heavy computation to avoid unnecessary operation.

```kotlin
private suspend fun factorialOf(num: Int): Flow<BigInteger> = coroutineScope {
    var factorial = BigInteger.ONE
    for (i in 1..num) {
        factorial = factorial.multiply()
        ensureActive()
    }
    factorial
}

val numFlow = flow {
    emit(1)
    emit(2)
    factorialOf(1_000) // flow will be cancelled with ensureActive()
}
```

Another handful operator is `cancellable()` to the `Flow`. By adding `cancellable()` to the `Flow` pipeline, it will help to ensure that the Flow is able to stop if it is being called to cancel.
