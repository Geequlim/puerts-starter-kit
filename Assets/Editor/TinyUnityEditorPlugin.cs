using UnityEngine;
using UnityEditor;
using System.Collections;
using System;

#if UNITY_EDITOR
namespace tiny {

	public class JSFunctions {
		public Action initialize;
		public Action finalize;
		public Action<JSEditorWindow> onCreateWindow;
	}

	public class JSEditorWindowFunctions {
		public Action OnEnable;
		public Action OnFocus;
		public Action OnSelectionChange;
		public Action OnLostFocus;
		public Action OnInspectorUpdate;
		public Action OnHierarchyChange;
		public Action OnProjectChange;
		public Action OnGUI;
		public Action OnDisable;
		public Action OnDestroy;
	}

	public class JSEditorWindow : EditorWindow {

		public JSEditorWindowFunctions functions = new JSEditorWindowFunctions();

		public void OnEnable() {
			if (TinyUnityEditorPlugin.inst != null) {
				if (TinyUnityEditorPlugin.inst.functions.onCreateWindow != null) {
					TinyUnityEditorPlugin.inst.functions.onCreateWindow(this);
				}
				if (functions.OnEnable != null) functions.OnEnable();
			}
		}

		public void OnFocus() {
			if (functions.OnFocus != null) functions.OnFocus();
		}

		public void OnSelectionChange() {
			if (functions.OnSelectionChange != null) functions.OnSelectionChange();
		}

		public void OnLostFocus() {
			if (functions.OnLostFocus != null) functions.OnLostFocus();
		}

		public void OnInspectorUpdate() {
			if (functions.OnInspectorUpdate != null) functions.OnInspectorUpdate();
		}

		public void OnHierarchyChange() {
			if (functions.OnHierarchyChange != null) functions.OnHierarchyChange();
		}

		public void OnProjectChange() {
			if (functions.OnProjectChange != null) functions.OnProjectChange();
		}

		public void OnGUI() {
			if (functions.OnGUI != null) functions.OnGUI();
		}

		public void OnDisable() {
			if (functions.OnDisable != null) functions.OnDisable();
		}

		public void OnDestroy() {
			if (functions.OnDestroy != null) functions.OnDestroy();
		}
	}


	[InitializeOnLoad]
	public class TinyUnityEditorPlugin {
		public delegate void JavaScriptMain(TinyUnityEditorPlugin instance);
		public string makingWindow = String.Empty;
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

		[MenuItem("tiny/JS插件/Reload")]
		public static void Reload() {
			if (inst != null) inst.Dispose();
			inst = new TinyUnityEditorPlugin();
		}

		[MenuItem("tiny/JS插件/测试窗口")]
		public static void ShowJSWindow() {
			inst.makingWindow = "MyEditorWindow";
			EditorWindow.GetWindow(typeof(JSEditorWindow));
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
			vm.UsingAction<JSEditorWindow>();
			vm.UsingFunc<Vector3>();
			vm.UsingAction<UnityEngine.AsyncOperation>();
		}

		~TinyUnityEditorPlugin() {
			Dispose();
		}
	}

}
#endif
