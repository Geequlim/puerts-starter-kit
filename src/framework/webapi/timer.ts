type TimerHandler = Function;

interface Timer {
	handler: TimerHandler;
	timeout: number;
	next_time?: number;
	args?: any[];
	oneshot?: boolean;
}
let global_timer_id = 0;

const pending_timers = new Map<number, Timer>();
const processing_timers = new Map<number, Timer>();
const removing_timers = new Set<number>();

function timer_loop() {
	const now = WebAPI.getHighResTimeStamp();

	for (const [id, timer] of pending_timers) {
		processing_timers.set(id, timer);
	}
	pending_timers.clear();

	for (const id of removing_timers) {
		processing_timers.delete(id);
	}
	removing_timers.clear();

	for (const [id, timer] of processing_timers) {
		if (timer.next_time <= now) {
			try {
				if (timer.handler) timer.handler.apply(null, timer.args);
			} catch (error) {
				console.error(`Error in timer handler: ${error.message}\n${error.stack}`);
			}
			if (timer.oneshot) {
				removing_timers.add(id);
			} else {
				timer.next_time = now + timer.timeout;
			}
		}
	}
	timer_loop_id = requestAnimationFrame(timer_loop);
}

function make_timer(handler: TimerHandler, timeout?: number, ...args: any[]): Timer {
	return {
		handler,
		timeout,
		next_time: WebAPI.getHighResTimeStamp() + (timeout || 0),
		args
	};
}

function pend_timer(timer: Timer): number {
	pending_timers.set(++global_timer_id, timer);
	return global_timer_id;
}

function setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number {
	const timer = make_timer(handler, timeout, ...args);
	timer.oneshot = true;
	return pend_timer(timer);
}

function clearTimeout(handle?: number): void {
	removing_timers.add(handle);
}

function setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number {
	return pend_timer(make_timer(handler, timeout, ...args));
}

function clearInterval(handle?: number): void {
	removing_timers.add(handle);
}

let timer_loop_id = 0;

export default {
	initialize() {
		timer_loop_id = requestAnimationFrame(timer_loop);
	},
	uninitialize() {
		cancelAnimationFrame(timer_loop_id);
	},
	exports: {
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
	}
};
