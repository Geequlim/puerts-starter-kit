//@ts-ignore
declare module globalThis {

	type PerformanceEntryList = PerformanceEntry[];

	/** Provides access to performance-related information for the current page. It's part of the High Resolution Time API, but is enhanced by the Performance Timeline API, the Navigation Timing API, the User Timing API, and the Resource Timing API. */
	class Performance {
		readonly timeOrigin: number;
		/** Removes the given mark from the performance entry buffer. */
		clearMarks(markName: string): void;
		/** Removes the given measure from the performance entry buffer. */
		clearMeasures(measureName: string): void;
		/** Returns a list of `PerformanceEntry` objects based on the given filter. */
		getEntries(): PerformanceEntryList;
		/** Returns a list of `PerformanceEntry` objects based on the given name and entry type. */
		getEntriesByName(name: string, type?: string): PerformanceEntryList;
		/** Returns a list of `PerformanceEntry` objects of the given entry type. */
		getEntriesByType(type: string): PerformanceEntryList;
		/** Creates a timestamp in the performance entry buffer with the given name. */
		mark(markName: string): PerformanceMark;
		/** Creates a named timestamp in the performance entry buffer between two specified marks (known as the start mark and end mark, respectively). */
		measure(measureName: string, startMark: string, endMark: string): PerformanceMeasure;
		/** Returns a DOMHighResTimeStamp representing the number of milliseconds elapsed since a reference instant. */
		now(): number;
		/** Is a jsonizer returning a json object representing the Performance object. */
		toJSON(): { timeOrigin : number };
	}

	/** Encapsulates a single performance metric that is part of the performance timeline. A performance entry can be directly created by making a performance mark or measure (for example by calling the mark() method) at an explicit point in an application. Performance entries are also created in indirect ways such as loading a resource (such as an image). */
	class PerformanceEntry {
		readonly duration: number;
		readonly entryType: string;
		readonly name: string;
		readonly startTime: number;
		toJSON(): { duration: number; entryType: string; name: string; startTime: number; };
	}

	/** PerformanceMark is an abstract interface for PerformanceEntry objects with an entryType of "mark". Entries of this type are created by calling performance.mark() to add a named DOMHighResTimeStamp (the mark) to the browser's performance timeline. */
	class PerformanceMark extends PerformanceEntry {}

	/** PerformanceMeasure is an abstract interface for PerformanceEntry objects with an entryType of "measure". Entries of this type are created by calling performance.measure() to add a named DOMHighResTimeStamp (the measure) between two marks to the browser's performance timeline. */
	class PerformanceMeasure extends PerformanceEntry {}
	
	const performance: Performance;
}
