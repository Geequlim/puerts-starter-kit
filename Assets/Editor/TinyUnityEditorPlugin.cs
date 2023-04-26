using UnityEngine;
using UnityEditor;
using System.Collections;
using System;

#if UNITY_EDITOR
namespace tiny {

	public class JSFunctions {
		public Action initialize;
		public Action finalize;
	}

	[InitializeOnLoad]
	public class TinyUnityEditorPlugin {
		public delegate void JavaScriptMain(TinyUnityEditorPlugin instance);
		public Puerts.JsEnv vm = null;
		public static TinyUnityEditorPlugin inst = null;
		protected string[] Polyfills = new string[] {
			"polyfills/puerts.tiny.mjs",
			"polyfills/console.mjs",
			"polyfills/webapi.mjs",
			"polyfills/source-map-support.mjs",
		};
		protected string Bootstrap = "scripts/editor.mjs";
		public JSFunctions functions = new JSFunctions();

		static TinyUnityEditorPlugin() {
			if (inst != null)
			{
				inst.Dispose();
				inst = null;
			}
			inst = new TinyUnityEditorPlugin();
		}

		protected TinyUnityEditorPlugin() {
			var debugRoot = System.IO.Path.Combine(Application.dataPath, "Scripts/Resources").Replace("\\", "/");
			vm = new Puerts.JsEnv(new tiny.JavaScriptLoader(debugRoot), 5558);
			this.RegisterClasses(vm);
			foreach (var polyfill in this.Polyfills) {
				vm.ExecuteModule(polyfill);
			}
			var javascript_main = vm.ExecuteModule<JavaScriptMain>(Bootstrap, "default");
			javascript_main(this);
			if (functions.initialize != null) functions.initialize();
		}

		protected void Dispose() {
			if (vm != null) {
				if (functions.finalize != null) functions.finalize();
				vm.Dispose();
				vm = null;
				Debug.Log("Dispose JS VM");
			}
		}

		protected void RegisterClasses(Puerts.JsEnv vm) {
			vm.UsingAction<int>();
			vm.UsingAction<float>();
			vm.UsingAction<string>();
			vm.UsingAction<bool>();
			vm.UsingFunc<int>();
			vm.UsingFunc<float>();
			vm.UsingFunc<string>();
			vm.UsingFunc<bool>();
			vm.UsingAction<string, string>();
			vm.UsingAction<Vector3>();
			vm.UsingFunc<Vector3>();
			vm.UsingAction<UnityEngine.AsyncOperation>();
		}

		~TinyUnityEditorPlugin() {
			Dispose();
		}
	}

}
#endif
