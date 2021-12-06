//@ts-ignore
declare module globalThis {
	type TimerHandler = Function;
	type TimerID = number;

	/**
	 * Sets a timer which executes a function once the timer expires.
	 * @param handler A function to be executed after the timer expires.
	 * @param timeout The time, in milliseconds (thousandths of a second), the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
	 * @param arguments Additional arguments which are passed through to the function specified by function
	 * @returns The returned `timeoutID` is a positive integer value; this value can be passed to `clearTimeout()` to cancel the timeout.
	 */
	function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): TimerID;
	
	/**
	 * Cancels a timeout previously established by calling `setTimeout()`
	 * @param timeoutID The identifier of the timeout you want to cancel. This ID was returned by the corresponding call to `setTimeout()`.
	 */
	function clearTimeout(timeoutID: TimerID): void;

	/**
	 * Repeatedly calls a function with a fixed time delay between each call.
	 * @param handler A function to be executed every delay milliseconds.
	 * @param timeout The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. 
	 * @param arguments Additional arguments which are passed through to the function specified by func once the timer expires.
	 * @returns The returned `intervalID` is a numeric, non-zero value which identifies the timer created by the call to `setInterval()`; this value can be passed to `clearInterval()` to cancel the timeout.
	 */
	function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): TimerID;

	/**
	 * Cancels a timed, repeating action which was previously established by a call to setInterval()
	 * @param intervalID The identifier of the repeated action you want to cancel. This ID was returned by the corresponding call to `setInterval()`. 
	 */
	function clearInterval(intervalID: TimerID): void;
}
