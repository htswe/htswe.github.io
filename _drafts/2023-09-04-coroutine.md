# Coroutine Builders 

1. `launch`
2. `async`
3. `runBlocking`


```kotlin
fun main() {
    GlobalScope.launch {
        delay(500)
        println("printed from within Coroutine")
    }
    println("main end")
}
```

This will just print out the "main end" without waiting for the other print statement inside Coroutine.

If we want the message to appear, one way is to add `Thread.sleep(>500)`.

```kotlin
fun main() {
    GlobalScope.launch {
        delay(500)
        println("printed from within Coroutine")
    }
    Thread.sleep(1000)
    println("main end")
}
```

> printed from within Coroutine\
main ends

The `Thread.sleep(ms)` is ugly, to avoid that, Coroutine has a builder for it called `runBlocking`. This will force the process to wait before it could end.

```kotlin
fun main() {
    runBlocking {
        launch {
            delay(500)
            println("printed from within Coroutine")
        }        
    }
}
```

This could be expressed as

```kotlin
fun main() = runBlocking {
    launch {
        delay(500)
        println("printed from within Coroutine")      
    }
}
```

This works okay if we do not plan to access the result from the coroutine inside `launch`. If we are expecting the result from coroutine, we could use the `Job` as Coroutine returns.

```kotlin
fun main() = runBlocking {
    launch {
        networkRequest()
        print("result received")
    }
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```
> end of runBlocking\
result received

When the above code runs, we noticed that `launch` is another coroutine and doesn't block the print statement for "end of runBlocking". If we want the `launch` coroutine print statement to appear first, then we may need to use `Job`.

```kotlin
fun main() = runBlocking {
    val job = launch {
        networkRequest()
        print("result received")
    }
    job.join()
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```

> result received\
end of runBlocking

Another way is to make the `launch` coroutine to `LAZY` type.

```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        networkRequest()
        print("result received")
    }
    // since it is LAZY, we could do other works
    delay(200)
    job.start()
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```

In this case, we could choose to `start` the `Job` anytime.

## Network Request Sequentially

```kotlin
fun performNetworkRequestsSequentially() {
    uiState.value = UiState.Loading

    viewModelScope.launch {
        try {
            val oreo = mockApi.getAndroid(27)
            val pie = mockApi.getAndroid(28)
            val a10 = mockApi.getAndroid(29)

            val result = listOf(oreo, pie, a10)
            uiState.value = UiState.Success(result)
        } catch(exception: Exception) {
            uiState.value = UiState.Error("Failed")
        }   
    }
}
```

## Network Request Concurrently

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


### Difference between `launch{}` and `async{}`
`launch{}` returns `Job`. `async{}` returns `Deferred` (`Job` with `Result`)

## Using `async{}`

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

We could also add optional parameter to `async(start = CoroutineStart.LAZY)` and change to `deferred1.start()`.

Let's try a little different using `async`.

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

## Sequential unknown network requests

Imagine if we do not know the exact number of network requests and we want to make them run in sequential.

```kotlin
fun performNetworkRequestsSequentially() {
    uiState.value = UiState.Loading

    viewModelScope.launch {
        try {
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

# Higher-Order Functions

## Implementing Timeout

```kotlin
fun usingTimeout(timeout: Long) {
    viewModelScope.launch {
        try {
            val recentAndroidVersion = withTimeout(timeout) {
                api.getRecentAndroidVersions()
            }
        } catch (timeoutCancellationException: TimeoutCancellationException) {
            uiState.value = UiState.Error("Network timeout")
        } catch (exception: Exception) {
            uiState.value = UiState.Error("Network request failed!")
        }
    }
}
```

## Implementing Retry

This will retry the api call 3 times.

```kotlin
fun usingRetry() {
    viewModelScope.launch {
        val numberOfRetries = 2

        try {
            retry(numberOfRetries) {
                api.getRecentAndroidVersions()
            }
        } catch (exception: Exception) {
            Timber.e(exception)
            uiState.value = UiState.Error("Network request failed!")
        }
    }
}

private suspend fun <T> retry(numberOfRetries: Int, block: suspend () -> T): T {
    repeat(numberOfRetries) {
        try {
            return block()
        } catch (exception: Exception) {
            Timber.e(exception)
        }
    }
    return block()
}
```

## Retry with exponential back-off

As a good client, let's try implement exponential back-off.

```kotlin
fun usingRetry() {
    viewModelScope.launch {
        val numberOfRetries = 2

        try {
            retry(numberOfRetries) {
                api.getRecentAndroidVersions()
            }
        } catch (exception: Exception) {
            Timber.e(exception)
            uiState.value = UiState.Error("Network request failed!")
        }
    }
}

// starts with 100ms -> 200ms -> 400ms -> 800ms (max is 1,000ms)
private suspend fun <T> retry(
    numberOfRetries: Int, 
    initialDelayMillis: Long = 100,
    maxDelayMillis: Long = 1000,
    delayFactor: Double = 2.0,
    block: suspend () -> T): T {

        var currentDelay = initialDelayMillis
        repeat(numberOfRetries) {
            try {
                return block()
            } catch (exception: Exception) {
                Timber.e(exception)
            }
            delay(currentDelay)
            currentDelay = (currentDelay * factor).toLong()
        }
        return block()
}
```

## Combining retries and timeout

Let's get two apis in parallel. Set number of retries to 2 and timeout to 1000L.
Combine withTimeout() and retry().

```kotlin
private suspend fun <T> retry(numberOfRetries: Int, block: suspend () -> T): T {
    repeat(numberOfRetries) {
        try {
            return block()
        } catch (exception: Exception) {
            Timber.e(exception)
        }
    }
    return block()
}

private suspend fun <T> retryWithTimeout(
    numberOfRetries: Int,
    timeout: Long,
    block: suspend () -> T
) = retry(numberOfRetries) {
    withTimeout(timeout) {
        block()
    }
}

fun callTwoApisInParallel() {
    val oreoDeferred = viewModelScope.async {
        mockApi.getAndroid(27)
    }

    val pieDeferred = viewModelScope.async {
        mockApi.getAndroid(28)
    }

    viewModelLaunchScope.launch {
        try {
            val versions = listOf(
                oreoDeferred,
                pieDeferred
            ).awaitAll()

            uiState.value = UiState.Success(versions)
        } catch (e: Exception) {
            Timber.e(e)
            uiState.value = UiState.Error(Network Request Failed)
        }
        
    }
}
```

# Using Room with Coroutines

Let's use Room as database while we also fetch data from api. Once we get the new data, we will update Room database.

```kotlin
@Dao
interface AndroidVersionDao {
    @Query("SELECT * FROM androids")
    suspend fun getAndroidVersions(): List<AndroidVersionEntity>

    @Insert(conflict = OnConflictStrategy.REPLACE)
    suspend fun insert(androidVersionEntity: AndroidVersionEntity)
)
}
```

```kotlin
@Entity(tableName="androids")
data class AndroidVersionEntity(
    @PrimaryKey val apiLevel: Int,
    val name: String
)

fun List<AndroidVersionEntity>.mapToUiModelList() = map {
    AndroidVersion(it.apiLevel, it.name)
}

fun AndroidVersion.mapToEntity() =
    AndroidVersionEntity(this.apiLevel, this.name)
```


```kotlin
fun loadData() {
    uiState.value = UiState.Loading.LoadFromDb

    viewModelScope.launch {
        val localVersions = database.getAndroidVersions()
        if (localVersions.isEmpty()) {
            uiState.value = UiState.Error(DataSource.DATABASE, "Database empty!")
        } else {
            // usually this code is in Repository
            uiState.value = UiState.Success(DataSource.DATABASE, localVersions.mapToUiModelList())
        }

        uiState.value = UiState.Loading.LoadFromNetwork
        try {
            val recentVersions = api.getRecentAndroidVersions()
            for (version in recentVersions) {
                database.insert(version.mapToEntity())
            }
            uiState.value = UiState.Success(DataSource.NETWORK, recentVersions)
        } catch (exception: Exception) {
            uiState.value = UiState.Error(DataSource.NETWORK, "Something went wrong!")
        }
    }
}
```

If we need to observe the data state from Room, one option is to use `LiveData` or another choice is to use `Flow`.


# Background Processing

## CPU intensive computation

Factorial  of "n": 5! = 5 x 4 x 3 x 2 x 1
show the time taken for computation and convert to `String` processing


```kotlin
fun performCalculation(factorialOf: Int) {
    viewModelScope.launch {
        var result: BigInteger = BigInteger.ONE
        val computationDuration = measureTimeMillis {
           result = calculateFactorialOf(factorialOf)
        }

        var resultString = ""
         val stringConversionDuration = measureTimeMillis {
            resultString = result.toString()
         }
    }
}

private fun calculateFactorialOf(number: Int): BigInteger {
    var factorial = BigInteger.ONE
    for (i in 1 .. number) {
        factorial = factorial.multiply(BigInteger.valueOf(i.toLong()))
    }
    return factorial
}
```

This looks fine, but noticed that we didn't specify where the coroutine should be running. By default, it is running on the main thread.

Let's learn about Coroutine Context.

### Coroutine Context

Coroutine context is the core of every coroutine. Every coroutine we start is tied to a specific coroutine context. For example, the code above is running on `viewModelScope`. So when we go into the implementation of `viewModelScope`, it is implementing the `CoroutineScope` interface. if we open `CoroutineScope` interface, we will see the `CoroutineContext`. So what is Coroutine Context. In the documentation of `CoroutineContext` interface, it said that it is an indexed set of `Element` instances. So a coroutine context consists of several context elements, most important elements are the `dispatcher`, `job`, `error handler` and coroutine `name`.

- Coroutine Scope
    - Coroutine Context
        - Coroutine Elements
            - Dispatcher
            - Job
            - Error Handler
            - Name

Based on our android example,

- viewModelScope
    - Coroutine Context
        - Coroutine Elements
            - Dispatchers.Main
            - SupervisorJob
            - Error Handler
            - Name

### Coroutine Dispatchers

1. Dispatchers.Main

This dispatcher is only available in application with user interface. When we use this dispatcher, the coroutine is executed in a special thread (eg. Android Main Thread) that can perform UI operation. The main dispatcher is defined as dispatcher for `viewModelScope`. Android main dispatcher uses `Handler` for main looper internally. When using main dispatcher on Android, code blocks in our coroutines are then sent as `Runnable` to the `MessageQueue` of the Android main thread.


2. Dispatchers.IO

It is intended to use for coding that perform IO related operations, like reading from network or the disk. The dispatcher internally uses a shared pool of threads in which threads are created and shut down on demand. This thread pool is limited to 64 threads, but can be configured in a way to use even more.

3. Dispatchers.Default

It is used by all the standard coroutine builders such as `launch` and `async`. If no other dispatcher is specified in the context, this dispatcher is optimized to perform CPU intensive work outside the main thread. Examples for CPU intensive operations are heavy computation, sorting big lists or parsing big JSON file. This default dispatcher implementation is also backed by a shared pool of threads. 

> Maximum number of threads is equal of the number of CPU cores on the device. Since it is computation heavy, it doesn't make sense to split more threads than the CPU that the device has.

The main difference between `IO` and `Default` is the number of Threads. The `IO` threads are idle and just wait for a certain IO operation to complete. The default threads, on the other hand, performs a very CPU intensive operation.

4. Dispatchers.Unconfined

This dispatcher is not confined to any thread. Coroutine that started with the dispatcher is initially running in the thread. It might switch thread if there is some context switch in any of the `suspend` function that Coroutine is calling. The official documentation of this dispatcher says that `Unconfined` dispatcher shouldn't normally be used in the code.


5. Custom dispatchers

Coroutine also provides some helper functions so that we could also use our own custom dispatcher. For example, we could use `newSingleThreadContext` that runs on a single thread. Or we could also use `newFixedPoolContext` that internally uses a thread pool of a specified size. We could also create own custom executor and use dispatcher function to convert to coroutine dispatcher (`java.util.concurrent.Executor => asCoroutineDispatcher`).

Now, we apply our knowledge to our sample above. Since we calculate factorial for the number, it is CPU intensive operation and it will be suited with `Dispatchers.Default`.


```kotlin
fun performCalculation(factorialOf: Int) {
    viewModelScope.launch(context = Dispatchers.Default) {
        var result: BigInteger = BigInteger.ONE
        val computationDuration = measureTimeMillis {
           result = calculateFactorialOf(factorialOf)
        }

        var resultString = ""
         val stringConversionDuration = measureTimeMillis {
            resultString = withContext(Dispatchers.Default + Dispatchers.IO) {
                result.toString()
            }
         }
    }
}

private suspend fun calculateFactorialOf(number: Int): withContext(Dispatchers.Default) {
    var factorial = BigInteger.ONE
    for (i in 1 .. number) {
        factorial = factorial.multiply(BigInteger.valueOf(i.toLong()))
    }
    return factorial
}
```

## Coroutine Scope vs Coroutine Context

This is one of the most confusing for most people about the differences. The Coroutine Scope has a single property and this property is Coroutine Context.

Every coroutine needs to run in a specific coroutine scope, and several coroutines can be started in the same scope. If we start the coroutine and some child coroutines in a certain scope, then their job objects will form a parent and child hierarchy.

Each of coroutines in the hierarchy run in the same scope, by default, each core coroutine inherits the context of the scope. But each individual coroutine, it could run in a different coroutine context. It is because every coroutine could modify its context if necessary.

For instance, while we would most likely run all our coroutines in Android ViewModel, we want to run some of them in different contexts.

With all those knowledge, let's try to improve the code above. So far, the factorial computation is done by a single coroutine. But we could improve by splitting into sub ranges.

For example, 6! = 1 x 2 x 3 x 4 x 5 x 6
Instead of the computation from multiplying 1 to 6, we could split 
coroutine#1 => 1 x 2
coroutine#2 => 3 x 4
coroutine#3 => 5 x 6

These 3 coroutines could run in parallel to improve the speed. Then the final coroutine will then multiply all the results.

```kotlin
private val factorialCalculator: FactorialCalculator = FactorialCalculator()

fun performCalculation(factorialOf: Int, numberOfCoroutine: Int) {
    viewModelScope.launch {
        var result = BigInteger.ZERO
        val computationDuration = measureTimeMillis {
            factorialCalculator.calculate(
                factorialOf,
                numberOfCoroutine
            )
        }

        var resultString = ""
        val stringConversionDuration = measureTimeMillis {
            resultString = convertToString(result)
        }
    }
}

private suspend fun convertToString(number: BigInteger): String = withContext(Dispatchers.Default) {
    number.toString()
}
```

```kotlin
class FactorialCalculator(
    private val defaultDispatcher: CoroutineDispatcher = Dispatchers.Default
) {
    fun suspend calculate(factorialOf: Int, numberOfCoroutine: Int) {
        return withContext(Dispatchers.Default) {
            val subRanges = createSubRangeList(factorialOf, numberOfCoroutine)
            subRanges.map { subRange ->
                async {
                    calculateFactorialOfSubRange(subRange)
                }
            }.awaitAll()
            .fold(BigInteger.ONE, {acc, element -> 
                acc.multiply(element)
            })
        }
        
    }

    fun calculateFactorialOfSubRange(subRange: SubRange): BigInteger {
        var factorial = BigInteger.ONE
        for (i in subRange.start .. subRange.end) {
            factorial = factorial.multiply(BigInteger.valueOf(i.toLong()))
        }
        return factorial
    }
}
```

# Structured Concurrency and Coroutine Scope

So far, we discuss about the happy path, what happens what the app is destroyed? what will happen to the coroutine?

## Structured concurrency

> **With structured concurrency, every coroutine needs to be started in a logical scope with a limited life-time.**

This could be, for instance, a scope that has the **same lifetime** as a certain UI object, such as an activity. Once the lifetime of a scope ends, all coroutines in that scope will be cancelled. With this, we could avoid forgetting cancelling the coroutines that we started.

This is different from `RxJava` where we have to manually manage the `Disposable`. No compiler will warn us if we forget to collect or cancel them.

```kotlin
fun performCalculation() {
    viewModelScope.launch {
        // start coroutine
    }
}
```

In our code above, we start our coroutines from `viewModelScope` that is provided by AndroidX library. This scope is related to the lifecycle of `viewModel`, therefore, when `viewModel` is destroyed, all the coroutines that run in that scope will be cancelled automatically. No resources will be wasted and potential crashes get prevented.

Let's take a look at another example.

```kotlin
val scope = CoroutineScope(Dispatchers.Default)

fun main() = runBlocking {
    val job = scope.launch {
        delay(100)
        println("Coroutine completed")
    }

    job.invokeOnCompletion { throwable -> 
        if (throwable is CancellationException) {
            println("Coroutine was cancelled!")
        }
    }

    delay(50)
    onDestroy()
}

fun onDestroy() {
    println("life-time of scope ends)
    scope.cancel()
}
```
```bash
life-time of scope ends
Coroutine was cancelled!
```

> **Coroutines started in the same scope form a hierarchy.**

Coroutines within the same scope are not launched independently from each other, but instead they build parent child relationships between each other and so they form a hierarchy of coroutines. More precisely, not the coroutines themselves, but their job object of their context and the job in the context of the coroutine scope.

```kotlin
fun main() {
    val scopeJob = Job()
    // If no `Job` is passed, CoroutineScope will create a default job
    val scope = CoroutineScope(Dispatchers.Default + scopeJob)

    var childCoroutineJob: Job? = null
    val coroutineJob = scope.launch {
        childCoroutineJob = launch {
            println("Starting child coroutine")
            delay(1000)
        }
        println("Starting coroutine")
        delay(1000)
    }

    Thread.sleep(1000)

    // the result will be true
    println("Is childCoroutine a child of coroutineJob? => ${coroutineJob.children.contains(childCoroutineJob)}")

    // the result is true since children in same scope copies everything, but create own job
    println("Is coroutineJob a child of scopeJob? => $(scopeJob.children.contains(coroutineJob))")
}
```
```bash
Starting coroutine
Starting child coroutine
Is childCoroutine a child of coroutineJob? => true
Is coroutineJob a child of scopeJob? => true
```

Beware of passing new `Job` into `scope.launch()`. We will create a completely new top hierarchy which we will have to manage ourselves. 

> **A parent job won't complete, until all of its children have completed.**

Since the coroutines (jobs) are depending on the nested children job(s), it could not complete until all the children coroutines (jobs) are done.

```kotlin
fun main() = runBlocking<Unit> {
    val scope = CoroutineScope(Dispatchers.Default)

    val parentCoroutine = scope.launch {
        launch {
            delay(1000)
            println("Child coroutine 1 is completed")
        }
        launch {
            delay(1000)
            println("Child coroutine 2 is completed")
        }
    }

    // join suspends the coroutine until this job is complete.
    parentCoroutine.join()

    println("Parent coroutine has completed")
}
```
```bash
Child coroutine 2 is completed
Child coroutine 1 is completed 
Parent coroutine has completed
```

> **Cancelling a parent will cancel all children. Cancelling a child won't cancel the parent nor the siblings.**

The cancellation of a parent job will also cancel all children recursively. It includes the children of the children. On the other hand, if a child is cancelled, it won't cancel the parent or the siblings.

```kotlin
fun main() = runBlocking {
    val scope = CoroutineScope(Dispatchers.Default)

    val child1ScopeJob = scope.launch {
        delay(1000)
        print("Child coroutine 1 is completed ")
    }.invokeOnCompletion { throwable ->
        if (throwable is CancellationException) {
            print("Child coroutine 1 is cancelled!")
        }
    }

    scope.launch {
        delay(1000)
        print("Child coroutine 2 is completed ")
    }.invokeOnCompletion { throwable ->
        if (throwable is CancellationException) {
            print("Child coroutine 2 is cancelled!")
        }
    }

    // this will cancel all children immediately without waiting anything
    // nothing will print out even children has exception handled
    scope.cancel()

    // If we want to wait for child cancellation handling, then we could use
    // cancelAndJoin(). This will cancel parent as well as using join to wait
    // handling by children. We could now remove `scope.cancel()`.
    scope.coroutineContext[Job!!.cancelAndJoin()]

    // This will cancel child 1 job, however, no effect on parent nor siblings
    child1ScopeJob.cancelAndJoin()
}
```

> **If a child coroutine fails, the exception is propagated upwards and depending on the job type, either all siblings are cancelled.**

If a child coroutines fails, the exception will flow upwards. Each job could either be an **ordinary** job or a **supervisor** job. If the parent of the failed job is an ordinary job, all the other children get cancelled and the exception will be propagated further upwards. If the parent is a supervisor job, then the exception of a failed child won't be propagated upwards and none of the siblings will be cancelled.

```kotlin

fun main() {
    val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        println("Caught exception $throwable")
    }

    val scope = CoroutineScope(Job() + exceptionalHandler)

    scope.launch {
        println("Coroutine 1 starts")
        delay(50)
        println("Coroutine 1 fails")
        throw RuntimeException()
    }

    scope.launch {
        println("Coroutine 2 starts")
        delay(500)
        println("Coroutine 2 completed")
    }.invokeOnCompletion { throwable ->
        if (throwable is CancellationException) {
            println("Coroutine 2 got cancelled!")
        }
    }

    Thread.sleep(1000)
    println("Scope got cancelled: ${!scope.isActive}")
}
```
```bash
Coroutine 1 starts
Coroutine 2 starts
Coroutine 1 fails
Coroutine 2 got cancelled!
Caught exception java.lang.RuntimeException
Scope got cancelled: true
```

In above example, we are using a regular `Job()`, hence when the job is cancelled due to exception, it will cause the parent to get cancelled as well as its siblings.

If we change the scope to -
`val scope = CoroutineScope(SupervisorJob() + exceptionHandler)`
the result will be
```bash
Coroutine 1 starts
Coroutine 2 starts
Coroutine 1 fails
Caught exception java.lang.RuntimeException
Coroutine 2 completed
Scope got cancelled: false
```

## Structured vs Unstructured concurrency

The difference between structured and unstructured concurrency:
* In structured concurrency, every coroutine needs to be started in a **logical scope** within a **limited life-time**. In unstructured concurrency, Threads, for instance, are started globally and it is developer's responsibility to keep track of their life-time.
* In structured concurrency, coroutines started in a scope form a **hierarchy**. In unstructured, there is no hierarchy. Threads run in **isolation** without any relationship between each other.
* In structured concurrency, a parent job won't complete until all its children have completed. In unstructured, all threads run completely independent from each other. They have no parent-child relationship.
* Cancelling a parent will cancel all children in structured concurrency. There is no automatic cancellation mechanism in unstructured concurrency.
* In structured, if a child coroutine fails, the exception is propagated upwards and depending on job type (normal/supervisor), either all siblings are cancelled or not. In unstructured, no automatic exception handling and cancellation mechanism. 


## GlobalScope
If we really want to go with **unstructured concurrency**, we could try with `GlobalScope`. It runs on the whole application lifetime and are not cancelled prematurely.

```kotlin
fun main() {
    print("Job of GlobalScope: ${GlobalScope.coroutineContext[Job]}")
    GlobalScope.launch {
        ...
    }
}
```
They will work with `Thread` since there is no `Job` and no parent-child relationship.

## ViewModelScope

The `ViewModelScope` will be associated with `viewModel`. The scope will cancelled when ViewModel will be cleared, ie [`ViewModel.onCleared`] is called.

If we look into the documentation, we see that it is using `Dispatchers.Main.Immediate` with `SupervisorJob`. It is also using an inner class of `ClosableCoroutineScope`. With `Immediate`, the coroutine is executed immediately. If we do not use `Immediate`, the coroutine execution starts at a later point in time because it dispatches as a Runnable. The `ViewModelScope` uses `Immediate` in order to optimize the performance because it avoids some unnecessary dispatches.

The `ViewModelScope` is an extension property on the `ViewModel` and returns a `CoroutineScope`. If the the scope already got initialized and is stored in a map that is internal to the `ViewModel`. In this case, the scope is simply returned. Otherwise, a new scope is initialized.

`ClosableCoroutineScope` implements on `Closeable` interface and `CoroutineScope`. In there, it calls `coroutineContext.cancel()` that cancels all started coroutines. The scope is stored in the `ViewModel` objects, therefore, this is the mechanism that cancels our coroutines.

## LifecycleScope

This is the scope provided by AndroidX lifecycle library. It is developed by Google and the scope could be used in lifecycle objects like `Activity` and `Fragment`. This `LifecycleScope` will be tied to the lifecycle of those objects. In case of device rotation, the activity will be destroyed and recreated. Therefore, we usually start coroutine in `ViewModelScope` to survive for device rotation.

There are some other options of `launch` such as `launchWhenCreated`, `launchWhenStarted` or `launchWhenResumed`. This means that the coroutine that was started with one of those options will be suspended until the lifecycle is at least one of these states.


## ScopingFunctions

We are going to look into two scoping functions - `coroutineScope{}` and `supervisorScope{}`. Scoping functions are used for **parallel** decomposition. This means that with scoping functions, we are able to decompose a task into several **concurrent** subtasks.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        launch {
            println("Task 1")
            delay(100)
            println("Task 1 completed")
        }
        launch {
            println("Task 2")
            delay(100)
            println("Task 2 completed")
        }
        launch {
            println("Task 3")
            delay(100)
            println("Task 3 completed")
        }
    }
}
```
```bash
Task 1
Task 2
Task 3
Task 1 completed
Task 2 completed
Task 3 completed
```
When we run the above code, we will see all 3 tasks run in parallel and each completed statement is called after some delays. But what if we only want task 1 and task 2 in parallel? 

One way is to use `join()` on the task 1 and task 2.

```kotlin
scope.launch {
    val job1 = launch {
        println("Task 1")
        delay(100)
        println("Task 1 completed")
    }
    
    val job2 = launch {
        println("Task 2")
        delay(100)
        println("Task 2 completed")
    }

    job1.join()
    job2.join()

    launch {
        println("Task 3")
        delay(100)
        println("Task 3 completed")
    }
}
```

The alternative is to create a parent coroutine by wrapping them inside `launch` block and call `join()`.

```kotlin
scope.launch {
    launch {
        launch {
            println("Task 1")
            delay(100)
            println("Task 1 completed")
        }
        
        launch {
            println("Task 2")
            delay(100)
            println("Task 2 completed")
        }
    }.join()

    launch {
        println("Task 3")
        delay(100)
        println("Task 3 completed")
    }
}
```

The most elegant and idiomatic way is to use `coroutineScope` scoping function. CoroutineScope also only returns once all of its child coroutines have completed.

```kotlin
scope.launch {
    coroutineScope {
        launch {
            println("Task 1")
            delay(100)
            println("Task 1 completed")
        }
        
        launch {
            println("Task 2")
            delay(100)
            println("Task 2 completed")
        }
    }

    launch {
        println("Task 3")
        delay(100)
        println("Task 3 completed")
    }
}
```
```bash
Task 1
Task 2
Task 1 completed
Task 2 completed
Task 3
Task 3 completed
```

As we could see `coroutineScope` becomes the parent for task 1 and task 2, it will done only after all children are done. In case there is an exception, it will be propagated to `scope` above. This will also cancelled the task 3 scope.

If we change `coroutineScope` to `supervisorScope` the code, the exception will not be propagated and there will be no effect on task 3 and the parent scope.


## Continue coroutine execution when the user leaves the screen

We have seen that `ViewModelScope` will cancel all coroutines when the ViewModel is destroyed. For most cases, it makes sense because when the UI is gone, there is no need to continue execution of coroutines that are providing the data for UI.

However, there could be use cases where we don't want to cancel the coroutine when the user leaves the screen. For example, we are fetching data from API and updating our `Room` database as caching. Let's see what happen when data is fetching in progress and we press back to navigation. The coroutine will be cancelled.

One way to overcome this is to create `applicationScope` with `SupervisorJob`.

```kotlin
class MyApplication: Application() {
    private val applicationScope = CoroutineScope(SupervisorJob())

    val getVersionsRepository by lazy {
        val database = AndroidVersionDatabase.getInstance(applicationContext).versionDao()
        AndroidVersionRepository(
            database,
            applicationScope
        )
    }
}
```
```kotlin
class GetVersionsRepository(
    private var database: AndroidVersionDao,
    private val scope: CoroutineScope,
    private val api: MockApi = MockApi()
) {
    suspend fun loadAndStore: List<AndroidVersion> {
        return scope.async {
            val recentVersion = api.getRecentAndroid()
            recentVersion
        }.await()
    }
}
```

# Coroutines Cancellation

## Cancelling Coroutines
We take a closer look at how the cancellation works in Coroutines.

```kotlin
fun main() = runBlocking {
    val job = launch {
        repeat(10) { index ->
            println("index: $index")
            try {
                delay(100)
            } catch (exception: CancellationException) {
                println("CancellationException!")
                throw CancellationException() // we need this so the parent job will know.
            }
        }
    }

    delay(250)
    println("Cancel now")
    job.cancel()
}
```
```bash
index: 0
index: 1
index: 2
Cancel now
CancellationException!
```
we need to rethrow the `CancellationException` so that the coroutine will complete. Otherwise, the coroutine would continue to run as CancellationException would have been caught.

## Cooperative Cancellation

We have seen that the coroutines are cooperative when we are using suspend functions of Coroutine library such as `delay` or `withContext`. However, if we create our own suspend functions, we have to make sure that they support cancellation and therefore are cooperative regarding cancellation. 

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        repeat(10) { index ->
            println("index: $index")
            Thread.sleep(100)
        }
    }

    delay(250)
    println("Cancel now")
    job.cancel()
}
```
```bash
index: 0
index: 1
index: 2
Cancel now
index: 3
index: 4
index: 5
index: 6
index: 7
index: 8
index: 9
```

We are using `Thread` in above code and we could see the `job.cancel()` do not match. This behavior is called uncooperative. There are a few ways that we could fix it with using `Thread`.

1. Use `ensureActive` or `yield`
```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        repeat(10) { index ->
            ensureActive() //yield()
            println("index: $index")
            Thread.sleep(100)
        }
    }

    delay(250)
    println("Cancel now")
    job.cancel()
}
```
```bash
index: 0
index: 1
index: 2
Cancel now
```

2. Use `isActive`
```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        repeat(5) { index ->
            if (isActive) {
                println("index: $index")
                Thread.sleep(100)
            } else {
                println("Cleaning up")
                throw CancellationException
            }
        }
    }

    delay(250)
    println("Cancel now")
    job.cancel()
}
```
```bash
index: 0
index: 1
index: 2
Cancel now
```

## NonCancellable Code

We could make our coroutine cooperative by periodically checking the active property. If it is no longer active, we could perform some cleanup terminates.

As the coroutine is canceled and the `isActive` property become `false`, it is not possible to call suspend functions. In order to be able to call suspend functions in canceled coroutine, we will have to use `withContext(NonCancellable)`.

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        repeat(5) { index ->
            if (isActive) {
                println("index: $index")
                Thread.sleep(100)
            } else {
                withContext(NonCancellable) {
                    delay(100)
                    println("Cleaning up")
                    throw CancellationException
                }
            }
        }
    }

    delay(250)
    println("Cancel now")
    job.cancel()
}
```
```bash
index: 0
index: 1
index: 2
Cancel now
Cleaning up
```

# Coroutines Exception Handling

It is one of the trickiest topic. In structured concurrency, we know that if a child coroutine fails, the exception is propagated to the parent job. Depending on the job type of the parent, siblings are cancelled if it is ordinary job. Only supervisor job won't affect and therefore it won't cancel its siblings.

One reason why exception handling with Coroutines is very hard is because there are two mechanisms - `try catch` and coroutine exception handler.

## Using try-catch

Similar to normal code, we could use `try` and `catch` block to handle the exception in coroutines. If a child coroutine fails, the exception is propagated upwards in the job hierarchy. 

Let's see an example.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        try {
            throw RuntimeException
        } catch (e: exception) {
            println("exception caught: $e")
        }
    }
}
```

## Using coroutine exception handler

When the coroutine does not handle an exception by itself, it fails. When it happens, the exception is propagated to parent job. If the parent job is an ordinary job, it will also fail. If no parent job is handling the exception, the app will crash.

We could use `CoroutineExceptionHandler` for that.

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
        println("Caught $throwable in CoroutineExceptionHandler") 
    }

    val scope = CoroutineScope(Job() + exceptionHandler)
    scope.launch {
        throw RuntimeException
    }
}
```

The above example is the code where we add the `exceptionHandler` into the scope. Similarly, we could also add the coroutine builder `launch`, i.e. `scope.launch(exceptionHandler) { ... }`.

There are, however, some common pitfalls with coroutine exception handler. It should be placed in the context of coroutine scope or in a top level coroutine. A top level coroutine is a coroutine that gets started directly from a scope or a direct child of a supervisor job.

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
        println("Caught $throwable in CoroutineExceptionHandler") 
    }

    val scope = CoroutineScope(Job() + exceptionHandler)
    scope.launch {
        launch { // exceptionHandler won't work!!!
            throw RuntimeException
        }
    }
}
```

It is also worth mentioning that `CancellationException` which is the result from cancelling a coroutine, also won't get handled by a coroutine exception handler.


## Compare `try-catch` and `CoroutineExceptionHandler`

In the documentation, `CoroutineExceptionHandler` is a last resort mechanism for globally catch all behavior. There is no **recovery** from the exception. It is generally used to log the exception show some error message, terminate and/or restart the application.

The `try-catch`, on the other hand, should be used in situations when we want to recover from the exception. For instance, when we want to retry a certain operation. Another important aspect of `try-catch` is that by using it without re-throwing the exception, the exception isn't propagated upwards and it would invalidate some mechanism of structured concurrency.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        launch { 
            println("Coroutine 1")
            delay(100)
            try {
                throw RuntimeException
            } catch (e: Exception) {
                println("Caught exception $e")
            }
        }
        launch { 
            println("Coroutine 2")
            delay(2000)
            println("Coroutine 2 finish")
        }
    }
}
```

The above code will run coroutine 2 to finish since the parent job is unaware of the exception in coroutine 1. Let's try `CoroutineExceptionHandler` at top level coroutine.

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
        println("Caught $throwable in CoroutineExceptionHandler") 
    }
    val scope = CoroutineScope(Job() + exceptionHandler)
    scope.launch(exceptionHandler) {
        launch { 
            println("Coroutine 1")
            delay(100)
            throw RuntimeException
        }
        launch { 
            println("Coroutine 2")
            delay(2000)
            println("Coroutine 2 finish")
        }
    }
}
```

This will stop both coroutine 1 and coroutine 2.


## Exception Handling for `launch{}` and `async{}`

Let's see how it differs exception handling for `launch` and `async`. Both of them are coroutine builders.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        throw RuntimeException
    }
}
```

The app will crash immediately since we are running on ordinary job and there is no handling for exception. Let's change it to `async`.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.async {
        throw RuntimeException
    }
}
```

The app will not crash. As we know, `async` returns `Deferred` and as long as `await()` is not called, the exception is propagated up in the top hierarchy.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    val deferred = scope.async {
        throw RuntimeException
    }

    scope.launch {
        deferred.await()
    }
}
```

What if we have code like this? We start a new coroutine with `launch` and within it, we have a child coroutine in `async`.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        async {
            throw RuntimeException
        }
    }
}
```

In this case, the app will crash as well even though the `await()` is NOT invoked. The exception is propagated to the top hierarchy and since the top job is the `launch`, the exception will be thrown.


## Exception Handling for `coroutineScope` and `supervisorScope`

Let's see how it will behave when we work with `scope` in coroutine.

```kotlin
fun main() = runBlocking {
    try {
        launch {
            throw RuntimeException()
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```

We already knew that using `try-catch` mechanism, the exception will not re-throw the exception to the parent. So in the above code, `try-catch` is not effective. 

### Throwing exception using `coroutineScope`

Let's add `coroutineScope`.

```kotlin
fun main() = runBlocking {
    try {
        coroutineScope {
            launch {
                throw RuntimeException()
            }
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```

When we run the code with `coroutineScope`, we could see that the exception is now caught. So if the coroutine in our `coroutineScope` function fails, the scoping function re-throws the exception and we are able to handle with `try-catch` clause.

### Usecase for `coroutineScope`

This main usecase for for the scoping function caught in the scope is to use it in `suspend` function with outer `try-catch`.

```kotlin
fun main() = runBlocking {
    try {
       doSomething()
    } catch (e: Exception) {
        println("Caught $e")
    }
}

private suspend fun doSomething() {
    coroutineScope {
        launch {
            throw RuntimeException()
        }
    }
}
```

### `supervisorScope` is independent

Let's take the code from `coroutineScope` and replace it with `supervisorScope`.

```kotlin
fun main() = runBlocking {
    try {
        supervisorScope {
            launch {
                throw RuntimeException()
            }
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```

The app crash without catching the exception. It is because `supervisorScope` is a new independent sub-scope in our hierarchy. Because it is independent, no one will handle it and the supervisor scope won't re-throw the exception. Therefore, `supervisorScope` uses a supervisor job in its context and exception won't be propagated above the supervisor jobs. We have to add `try-catch` or `CoroutineExceptionHandler` inside this independent `supervisorScope`.

There is one exception thought.

```kotlin
fun main() = runBlocking {
    try {
        supervisorScope {
            throw RuntimeException()
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```

If we throw exception within the `supervisorScope` directly (without the coroutine), this exception will be caught. It is also worth mentioning that when a `supervisorScope` fails like that, all the started coroutines will be cancelled. It is different to a failure of a child coroutine which won't affect its other siblings.

Let's try with `async`.

```kotlin
fun main() = runBlocking {
    try {
        supervisorScope {
            async {
                throw RuntimeException()
            }
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```
We could see that nothing is printed out because the exception is encapsulated in the deferred object of `async` coroutine and it will only be thrown when we call `await` on th deferred object.

Let's call `await`.

```kotlin
fun main() = runBlocking {
    try {
        supervisorScope {
            async {
                throw RuntimeException()
            }.await()
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```

When we run the app, unlike `launch`, we could see `await` will re-throw the exception and because we are calling it directly in `supervisorScope`, the `supervisorScope` will also re-throw the exception and we could catch the exception. :joy:

If we store the deferred object in its own variable and call `await` in a coroutine with `launch`,

```kotlin
fun main() = runBlocking {
    try {
        supervisorScope {
            val deferred = async {
                throw RuntimeException()
            }
            launch {
                deferred.await()
            }
        }
    } catch (e: Exception) {
        println("Caught $e")
    }
}
```
The `supervisorScope` won't rethrow because it is a failed coroutine, but instead the exception will be propagated higher to job hierarchy. Since there is no `CoroutineExceptionHandler`, the app will crash.

Let's try without `runBlocking` and run on the new scope.

```kotlin
fun main() {
    val scope = CoroutineScope(Job())
    scope.launch {
        try {
            supervisorScope {
                launch {
                    throw RuntimeException()
                }
            }
        } catch (e: Exception) {
            println("Caught $e")
        }   
    }
    
}
```
The app will crash since there is no `CoroutineExceptionHandler` installed. Let's create one and add into the `supervisorScope`.

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
        println("Caught $throwable in CoroutineExceptionHandler")
    }
    val scope = CoroutineScope(Job())
    scope.launch {
        try {
            supervisorScope {
                launch(exceptionHandler) {
                    throw RuntimeException()
                }
            }
        } catch (e: Exception) {
            println("Caught $e")
        }   
    }
    
}
```

When we run the code, as expected, the exception is caught in the `CoroutineExceptionHandler`. Now, let's remove the exception handler from top level coroutine in the `supervisorScope`. Install from top level scope instead.

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
        println("Caught $throwable in CoroutineExceptionHandler")
    }
    val scope = CoroutineScope(Job() + exceptionHandler)
    scope.launch {
        try {
            supervisorScope {
                launch {
                    throw RuntimeException()
                }
            }
        } catch (e: Exception) {
            println("Caught $e")
        }   
    }
}
```

We knew that using `supervisorScope` will need us to manually handle the exception since it is independent. The exception will not propagate to the outer scope. Since exception handler is on outside scope and the `CoroutineExceptionHandler` is only available in outside scope, it seems that the app will crash.

However, when we run it, the exception is caught in the `CoroutineExceptionHandler`. Why? In `coroutineContext`, we learned that the `coroutineContext` is inherited when launching new coroutine and the exception handler is also a `context` element. If we look at the documentation for `supervisorScope`, it says that the scope inherits its `coroutineContext` from outer scope, but overrides context's `Job` with `supervisorJob`. Therefore, the exception handler is inherited down to the coroutine.

### Applying knowledge into real usecase

Let's say we have 3 apis that is called in parallel. And one of them returns the error response, but we don't want to crash the app. Instead, we are okay to proceed with the other successful apis.

```kotlin
fun showResultsEvenSomeFails() {
    uiState.value = UiState.Loading
    viewModelScope.launch {
        supervisorScope {
            val api1Deferred = async {
                api.getData(one)
            }

            val api2Deferred = async {
                api.getData(two)
            }

            val api3Deferred = async {
                api.getData(three)
            }

            val responses = listOf(
                api1Deferred, 
                api2Deferred, 
                api3Deferred
            ).mapNotNull {
                try {
                    it.await()
                } catch (e: Exception) {
                    // try-catch cannot work for CancellationException
                    if (e is CancellationException) {
                        throw e
                    }

                    println("error $e")
                    null
                }
            }

            UiState.value = UiState.Success(responses)
        }
    }
}
```

# Unit Testing

Writing unit tests, in my opinion, can provide huge value to every codebase. The biggest advantage of unit tests are that they run really fast. They prevent bugs and regressions. They allow us to debug issues faster and are one of the best documentations about the codebase. Last, but not least, a good set of unit tests provide us a lot of confidence that our code is doing what it is supposed to do and that potential issues will be identified very quickly by failing unit tests.

Unfortunately, unit testing is not so easy on Android.
Luckily, coroutine provides a good unit testing support for us using `kotlinx-coroutine-test` library.

One thing to note about the test library is that even thought it is currently on 1.7.1, many part of the API is experimental and it may change.

## Unit Testing Approach

A unit test should only test only a single unit of functionality. 

When running the app on an emulator, the functions in our `viewModel` are called by `activity`. Whenever the user clicks on a certain button, the `viewModel` usually requests data from the network or database, and then transmits UI state changes to the `activity`. The `activity` observes and renders these changes.

However, in unit tests  that are running directly on the JVM, we cannot start the `activity` because the code contains Android framework. Therefore, we have to call the functions of `viewModel` in unit tests by ourselves.

Since we are only interested to verify the behavior of a single unit, the `viewModel` is not requesting the real network or real database. Instead we will use a fake or mock implementation.

With that approach in mind, we usually prepare our `viewModel` constructor. For example, 

```kotlin

class ourViewModel(
    ourApi: NetworkApi,
    ourDb: Database
) {
    ...
}
```

With the constructor, in unit tests, we are able to pass the fake implementations to `viewModel` in order to test the logic in isolation. After calling the function in `viewModel`, we then observe the UI state of `viewModel`.

We assert if the changes that received are as expected. Usually, this is how we like to setup our test format.

```kotlin

@Test
fun `should return yyy when xxx is successful` {
    // Arrange
    // Act
    // Assert
}

```

## Our sample implementation

Let's learn our first test. Firstly, this is our implementation.

```kotlin
class PerformNetworkRequestViewModel(
    private val mockApi: MockApi = mockApi()
) : BaseViewModel<UiState>() {

    fun performNetworkRequest() {
        uiState.value = UiState.Loading
        viewModelScope.launch {
            try {
                val result = mockApi.getData()
                uiState.value = UiState.Success(result)
            } catch (exception: Exception) {
                uiState.value = UiState.Error("Network failed")
            }
        }
    }
}
```

## Testing happy path
Here is our first test for happy path.

```kotlin
class EndPointNotSupportedException : throwable


class FakeSuccessApi : MockApi {
    override suspend fun getData(): ResponseData {
        return fakeSuccessData
    }

    // if we do not want the test to use it
    override suspend fun getDataByParam(param: Param): ResponseData {
        return EndPointNotSupportedException()
    }
}

// testInstantTaskExecutorRule is used to prevent mainLooper RuntimeException
@get:Rule
val testInstantTaskExecutorRule: TestRule = InstantTaskExecutorRule()

private val receivedUiState = mutableListOf<UiState>()

@Test
fun `should return Success when network request is successful` {
    // Arrange
    val testDispatcher = TestCoroutineDispatcher()
    Dispatchers.setMain(testDispatcher)

    val fakeApi = FakeSuccessApi()
    val viewModel = PerformNetworkRequestViewModel(fakeApi)
    viewModel.uiState().observeForever { uiState ->
        if (uiState != null) {
            receivedUiState.add(uiState)
        }
    }

    // Act
    viewModel.performNetworkRequest()

    // Assert
    Assert.assertEquals(
        listOf(
            UiState.Loading, 
            UiState.Success(fakeSuccessData)
        ),
        receivedUiState
    )

    // Clean up the coroutine dispatchers and potential coroutine leaks
    Dispatchers.resetMain()
    testDispatcher.cleanupTestCoroutines()
}

```

> if you are getting the error `Method getMainLooper in android.os.Looper not mocked`, add `testImplementation("androidx.arch.core:core-testing:<version>)` into `build.gradle.kts` file. Then add the `InstantTaskExecutorRule()` rule annotation. This rule defines an executor that is used instead of Android main looper. This rule also configures `LiveData` to execute each task synchronously instead of asynchronously.
> The biggest challenge in testing asynchronous code is that asynchronous events often happen after the test assertion. To avoid this, we have to make our asynchronous implementations to run synchronously in tests.


## Testing unhappy path

Since we already setup for happy path, the unhappy path will be much easier to write.

```kotlin
class EndPointNotSupportedException : throwable


class FakeFailureApi : MockApi {
    override suspend fun getData(): ResponseData {
        throw HttpException(
            Response.error<ResponseData>(
                code: 500,
                body: ResponseBody.create(MediaType.pase("application/json"), "")
            )
        ) 
    }

    // if we do not want the test to use it
    override suspend fun getDataByParam(param: Param): ResponseData {
        return EndPointNotSupportedException()
    }
}

// testInstantTaskExecutorRule is used to prevent mainLooper RuntimeException
@get:Rule
val testInstantTaskExecutorRule: TestRule = InstantTaskExecutorRule()

private val receivedUiState = mutableListOf<UiState>()

@Test
fun `should return Error when network request is unsuccessful` {
    // Arrange
    val testDispatcher = TestCoroutineDispatcher()
    Dispatchers.setMain(testDispatcher)

    val fakeApi = FakeFailureApi()
    val viewModel = PerformNetworkRequestViewModel(fakeApi)
    viewModel.uiState().observeForever { uiState ->
        if (uiState != null) {
            receivedUiState.add(uiState)
        }
    }

    // Act
    viewModel.performNetworkRequest()

    // Assert
    Assert.assertEquals(
        listOf(
            UiState.Loading, 
            UiState.Error("Network failed")
        ),
        receivedUiState
    )

    // Clean up the coroutine dispatchers and potential coroutine leaks
    Dispatchers.resetMain()
    testDispatcher.cleanupTestCoroutines()
}

```

## Code refactor

We have made two tests - happy and unhappy path. There are some duplicate codes that we could refactor using `@Before` and `@After`.

```kotlin

class PerformNetworkRequestViewModelTest {
    val testDispatcher = TestCoroutineDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    } 

    @After
    fun tearDown() {
        // Clean up the coroutine dispatchers and potential coroutine leaks
         Dispatchers.resetMain()
        testDispatcher.cleanupTestCoroutines()
    }

    // testInstantTaskExecutorRule is used to prevent mainLooper RuntimeException
    @get:Rule
    val testInstantTaskExecutorRule: TestRule = InstantTaskExecutorRule()

    private val receivedUiState = mutableListOf<UiState>()

    private fun observeViewModel(viewModel: PerformNetworkRequestViewModel) {
        viewModel.uiState().observeForever { uiState ->
            if (uiState != null) {
                receivedUiState.add(uiState)
            }
        }
    }

    @Test
    fun `should return Success when network request is successful` {
        // Arrange
        val fakeApi = FakeSuccessApi()
        val viewModel = PerformNetworkRequestViewModel(fakeApi)
        observeViewModel(viewModel)

        // Act
        viewModel.performNetworkRequest()

        // Assert
        Assert.assertEquals(
            listOf(
                UiState.Loading, 
                UiState.Success(fakeSuccessData)
            ),
            receivedUiState
        )
    }

    @Test
    fun `should return Error when network request is unsuccessful` {
        val fakeApi = FakeFailureApi()
        val viewModel = PerformNetworkRequestViewModel(fakeApi)
        viewModel.uiState().observeForever { uiState ->
            if (uiState != null) {
                receivedUiState.add(uiState)
            }
        }

        // Act
        viewModel.performNetworkRequest()

        // Assert
        Assert.assertEquals(
            listOf(
                UiState.Loading, 
                UiState.Error("Network failed")
            ),
            receivedUiState
        )
    }
}
```

## Scope Rule

After refactoring, it is much better. We can reduce number of boilerplate codes by moving them into `setUp()` and `tearDown()`. However, we need to repeat this in many other unit test files. There is one way that we could improve it, by using Junit `TestWatcher`.

```kotlin
class MainCoroutineScopeRule(
    val testDispatcher: TestCoroutineDispatcher = TestCoroutineDispatcher()
): TestWatcher(), TestCoroutineScope by TestCoroutineScope(testDispatcher) {

    override fun starting(description: Description?) {
        super.starting(description)
        Dispatchers.setMain(testDispatcher)
    }

    override fun finished(description: Description?) {
        super.finished(description)
        cleanupTestCoroutines()
        Dispatchers.resetMain()
    }
}
```

Now, we can add with `@Rule` annotation in our test file.

```kotlin
class PerformNetworkRequestViewModelTest {

    // using TestWatcher to replace @Before and @After
    @get:Rule
    val mainCoroutineScopeRule = MainCoroutineScopeRule()


    // testInstantTaskExecutorRule is used to prevent mainLooper RuntimeException
    @get:Rule
    val testInstantTaskExecutorRule: TestRule = InstantTaskExecutorRule()

    private val receivedUiState = mutableListOf<UiState>()

    private fun observeViewModel(viewModel: PerformNetworkRequestViewModel) {
        viewModel.uiState().observeForever { uiState ->
            if (uiState != null) {
                receivedUiState.add(uiState)
            }
        }
    }

    @Test
    fun `should return Success when network request is successful` {...}

    @Test
    fun `should return Error when network request is unsuccessful` {...}
}
```

## `runBlockingTest{}` and Virtual Time

> There is a new API for `runTest{}` that replaces `runBlockingTest{}`. Read more at [Migrating to the new coroutines 1.6 test APIs](https://medium.com/androiddevelopers/migrating-to-the-new-coroutines-1-6-test-apis-b99f7fc47774)

Before we move into more tests, let's see how the coroutine test handles for `delay` or time.

```kotlin
class MySystem {
    suspend fun functionWithDelay(): Int {
        delay(1000)
        return 50
    }
}

class MySystemTest {
    @Test
    fun `functionWithDelay should return 50` () = runBlockingTest {
        val mySystem = MySystem()
        val actual = mySystem.functionWithDelay()
        Assert.assertEquals(50, actual)
    }
}
```

When we run the test with `runBlockingTest`, we will see that the test is completed in less than `1000ms` that we set in the `delay`. It is because `runBlockingTest` works with the different kind of time (not real time) and we call it "virtual time". With the virtual time, we could basically set how far we want to travel during the test.

For example, if we use `advanceTimeBy(500)`, when the statement is executed, the virtual time will be advanced by 500 ms.


## Testing Sequential and Concurrent network calls

So far, all the tests above only focus on the UI event such as `UiState.Loading` followed by `UiState.Success` or `UiState.Error`. This does not indicate if the network requests are indeed run in sequential or parallel.

We will use the time concept that we have learnt. We will modify our `FakeSuccessApi` class with responseDelay as constructor parameter.

```kotlin
class FakeSuccessApi(
    private val responseDelay: Long = 0L,
) : MockApi {
    override suspend fun getData(): ResponseData {
        delay(responseDelay) // add delay
        return fakeSuccessData
    }
}

@Test
fun `performNetworkRequestSequentially() should load data sequentially` = mainCoroutineScopeRule.runBlockingTest {
    // Arrange
    val responseDelay = 1000L
    val fakeApi = FakeSuccessApi(responseDelay)
    val viewModel = PerformNetworkRequestViewModel(fakeApi)
    observeViewModel(viewModel)
    // Act
    viewModel.performNetworkRequestSequentially()
    // advance over all delays and returns the amount of time it advanced
    val forwardedTime = advanceUntilIdle() 
    // Assert
    Assert.assertEquals(
        listOf(
            UiState.Loading, 
            UiState.Success(fakeSuccessData)
        ),
        receivedUiState
    )
    // assumes that performNetworkRequestSequentially makes two network calls sequentially with `responseDelay`
    // Since two network requests, then we expect to be 2x1000L
    Assert.assertEquals(2000, forwardedTime)
}

@Test
fun `performNetworkRequestConcurrently() should load data sequentially` {
    // Arrange
    val responseDelay = 1000L
    val fakeApi = FakeSuccessApi(responseDelay)
    val viewModel = PerformNetworkRequestViewModel(fakeApi)
    observeViewModel(viewModel)
    // Act
    viewModel.performNetworkRequestConcurrently()
    // advance over all delays and returns the amount of time it advanced
    val forwardedTime = advanceUntilIdle() 
    // Assert
    Assert.assertEquals(
        listOf(
            UiState.Loading, 
            UiState.Success(fakeSuccessData)
        ),
        receivedUiState
    )
    // Since two network requests in parallel, then we expect to be 1000L
    Assert.assertEquals(1000, forwardedTime)
}
```

## Timeout and Retries

Coroutine also support the timeout feature (`withTimeout` & `withTimeoutOrNull`).

```kotlin
private fun usingWithTimeout(timeout: Long) {
    viewModelScope.launch {
        try {
            val result = withTimeout(timeout) {
                api.getData()
            }
            uiState.value = UiState.Success(result)
        } catch (timeoutCancellationException: TimeoutCancellationException) {
            uiState.value = UiState.Error("Network Request timed out!")
        } catch (exception: Exception) {
            uiState.value = UiState.Error("Network Request failed!")
        }
    }
}

private fun usingWithTimeoutOrNull(timeout: Long) {
    viewModelScope.launch {
        try {
            val result = withTimeoutOrNull(timeout) {
                api.getData()
            }
            if (recentVersions != null) {
                uiState.value = UiState.Success(result)
            } else {
                uiState.value = UiState.Error("Network Request timed out!")
            }
        } catch (exception: Exception) {
            uiState.value = UiState.Error("Network Request failed!")
        }
    }
}
```

Likewise, there is also `retry` coroutine mechanism.

```kotlin
fun performNetworkRequest() {
    uiState.value = UiState.Loading
    viewModelScope.launch {
        val numberOfRetries = 2
        try {
            retry(times = numberOfRetries) {
                val recentVersions = api.getRecentAndroidVersions()
                uiState.value = UiState.Success(recentVersions)
            }
        } catch (e: Exception) {
            uiState.value = UiState.Error("Network Request failed")
        }
    }
}
```

During retry, it is also important that we should also optimize on the duration of each retry using "exponential back-off".

```kotlin
// retry with exponential backoff
// inspired by https://stackoverflow.com/questions/46872242/how-to-exponential-backoff-retry-on-kotlin-coroutines
private suspend fun <T> retry(
    times: Int,
    initialDelayMillis: Long = 100,
    maxDelayMillis: Long = 1000,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelayMillis
    repeat(times) {
        try {
            return block()
        } catch (exception: Exception) {
            Timber.e(exception)
        }
        delay(currentDelay)
        currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelayMillis)
    }
    return block() // last attempt
}
```

## Testing implementation with multiple dispatchers

Let's see this example here. `viewModelScope.launch` will start a new coroutine on `viewModelScope` and it is executed on the `Dispatchers.Main`. We have a function `convertToString()` which is CPU intensive and hence, we change it to `Dispatchers.Default`.

As we are injecting `CoroutineDispatcher` from constructor, it is easy for unit test as we could have initialize the `CalculatorViewModel(testDispatcher)`. 

```kotlin

class CalculatorViewModel(
    private val defaultDispatcher: CoroutineDispatcher = Dispatchers.Default,
) {
    fun performCalculation(factorialOf: Int, numberOfCoroutine: Int) {
        viewModelScope.launch {
            var result = BigInteger.ZERO
            val computationDuration = measureTimeMillis {
                factorialCalculator.calculate(
                    factorialOf,
                    numberOfCoroutine
                )
            }

            var resultString = ""
            val stringConversionDuration = measureTimeMillis {
                resultString = convertToString(result)
            }
        }
    }

    private suspend fun convertToString(number: BigInteger): String = withContext(defaultDispatcher) {
        number.toString()
    }
}
```

In summary, we should not hardcode these dispatchers, but instead make them injectable from outside. In this way, we could test those implementation with synchronous and sequential.


## Using `TestCoroutineScope`

Let's say we want to implement a "load and save". We will make a network request and save it into our database. The special thing about this function is that it should continue to run even if the scope which calls this suspend function gets cancelled.

```kotlin
class MyDataRepository(
    private val api: MockApi = mockApi()
    private val database: MyDatabase,
    private val scope: CoroutineScope,
) {

    suspend fun loadAndStoreData(): Data {
        return scope.async {
            val data = api.getData()
            database.insert(data.mapToEntity())
            data
        }.await()
    }
}
```

And here is our test.

```kotlin
class FakeDatabase : MyDao {
    var insertedIntoDb = false
    ...
    override suspend fun insert(dataEntity: DataEntity) {
        ...
        insertedIntoDb = true
    }
}

class FakeApi : MockApi {
    override suspend fun getData(): Response {
        delay(1)
        return mockSuccessResult
    }
    ...
}

class MyDataRepositoryTest {

    @get: Rule
    val mainCoroutineScopeRule: MainCoroutineScopeRule = MainCoroutineScopeRule()

    @Test
    fun `loadAndStoreData() should continue to load and store data even when the calling scope gets cancelled` () =
        mainCoroutineScopeRule.runBlockingTest {
            // Arrange
            val fakeDatabase = FakeDatabase()
            val fakeApi = FakeApi()

            val repository = MyDataRepository(fakeApi, fakeDatabase, mainCoroutineScopeRule)

            // Act
            // this function in real world will be called from other scope such as viewModelScope
            // let's mimic.
            val testViewModelScope = TestCoroutineScope(SupervisorJob())
            testViewModelScope.launch {
                repository.loadAndStoreData()
                // we purposely let unit test failed
                // but the fail statement should never be executed
                // as it should be cancelled
                fail("Scope should be cancelled before data loaded")
            }
            // we want to test for cancellation case
            // we put a delay in fakeApi for 1ms
            testViewModelScope.cancel()
            advanceUntilIdle()
            
            // Assert
            assertEquals(true, fakeDatabase.insertedIntoDb)
        }
}
```