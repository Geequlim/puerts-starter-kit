using System;
using System.Collections.Generic;

namespace tiny {

	public class ScriptInstance {
		private Dictionary<string, Action> methods = new Dictionary<string, Action>();

		public static ScriptInstance Instance(Action<ScriptInstance> initializer) {
			var obj = new ScriptInstance();
			if (initializer != null) {
				initializer(obj);
			}
			return obj;
		}

		public void AddMethod(string method, Action callback) {
			methods[method] = callback;
		}

		public bool Call(string method) {
			Action callback;
			if (methods.TryGetValue(method, out callback)) {
				if (callback != null) {
					callback();
					return true;
				}
			}
			return false;
		}
	}

}