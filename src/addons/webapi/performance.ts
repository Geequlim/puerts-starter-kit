import { EventTarget } from "./event";

/** Encapsulates a single performance metric that is part of the performance timeline. A performance entry can be directly created by making a performance mark or measure (for example by calling the mark() method) at an explicit point in an application. Performance entries are also created in indirect ways such as loading a resource (such as an image). */
class PerformanceEntry {
	readonly duration: number;
	readonly entryType: string;
	readonly name: string;
	readonly startTime: number;

	constructor(name: string, startTime: number, entryType: string, duration = 0) {
		this.startTime = startTime;
		this.name = name;
		this.entryType = entryType;
		this.duration = duration;
	}

	toJSON() {
		return {
			duration: this.duration,
			entryType: this.entryType,
			name: this.name,
			startTime: this.startTime,
		};
	};
}

class PerformanceMark extends PerformanceEntry {}
class PerformanceMeasure extends PerformanceEntry {}
type PerformanceEntryList = PerformanceEntry[];

const MARK_TYPE = "mark";
const MEASURE_TYPE = "measure";

class Performance extends EventTarget {
	readonly timeOrigin: number;
	private _entries = new Map<string, PerformanceEntryList>();

	now() {
		return Date.now() - this.timeOrigin;
	}

	constructor() {
		super();
		this.timeOrigin = Date.now();
	}

	getEntries(): PerformanceEntryList {
		let ret: PerformanceEntryList = [];
		for (const [type, list] of this._entries) {
			ret = ret.concat(list);
		}
		return ret;
	}

	getEntriesByName(name: string, type?: string): PerformanceEntryList {
		let ret: PerformanceEntryList = [];
		for (const [entryType, list] of this._entries) {
			if (type && type != entryType) continue;
			list.map(e => {
				if (e.name == name) {
					ret.push(e);
				}
			});
		}
		return ret;
	}

	getEntriesByType(type: string): PerformanceEntryList {
		return this._entries.get(type);
	}

	mark(markName: string) {
		const mark = new PerformanceMark(markName, this.now(), MARK_TYPE);
		let marks: PerformanceEntryList = this._entries.get(MARK_TYPE);
		if (!marks) {
			marks = [ mark ];
			this._entries.set(MARK_TYPE, marks);
		} else {
			marks.push(mark);
		}
		return mark;
	}

	measure(measureName: string, startMark: string, endMark: string) {
		let starts = this.getEntriesByName(startMark, MARK_TYPE);
		if (starts.length == 0) throw new Error(`The mark '${startMark}' does not exist.`);
		let ends = this.getEntriesByName(endMark, MARK_TYPE);
		if (ends.length == 0) throw new Error(`The mark '${endMark}' does not exist.`);
		const start = starts[starts.length - 1];
		const end = ends[ends.length - 1];
		const measure = new PerformanceMeasure(measureName, start.startTime, MEASURE_TYPE, end.startTime - start.startTime);
		let measures: PerformanceEntryList = this._entries.get(MEASURE_TYPE);
		if (!measures) {
			measures = [ measure ];
			this._entries.set(MEASURE_TYPE, measures);
		} else {
			measures.push(measure);
		}
		return measure;
	}

	clearMarks(markName: string): void {
		let marks = this._entries.get(MARK_TYPE);
		if (marks) {
			marks = marks.filter( m => m.name === markName );
			this._entries.set(MARK_TYPE, marks);
		}
	}

	clearMeasures(measureName: string): void {
		let measures = this._entries.get(MARK_TYPE);
		if (measures) {
			measures = measures.filter( m => m.name === measureName );
			this._entries.set(MEASURE_TYPE, measures);
		}
	}

	toJSON() {
		return {
			timeOrigin: this.timeOrigin,
		}
	}

};

export default {
	exports: {
		Performance,
		PerformanceEntry,
		PerformanceMark,
		PerformanceMeasure,
		performance: new Performance()
	}
};
