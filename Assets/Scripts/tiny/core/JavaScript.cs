using System.IO;
using System;
using UnityEngine;

namespace tiny
{



	public class JavaScriptLauncher : MonoBehaviour
	{
		public delegate void JavaScriptMain(JavaScriptLauncher instance);
		public bool WaitForDebugger = false;
		public int DebuggerPort = 5556;
		protected string[] Polyfills = new string[] {
			"polyfills/puerts.tiny.mjs",
#if !UNITY_WEBGL || UNITY_EDITOR
			"polyfills/console.mjs",
			"polyfills/webapi.mjs",
#endif
			"polyfills/source-map-support.mjs",
		};
		protected string Bootstrap = "scripts/bootstrap.mjs";

		public string DebuggerRoot = String.Empty;
#if UNITY_EDITOR
		public static string getDefaultDebuggerRoot()
		{
			return System.IO.Path.Combine(Application.dataPath, "Scripts/Resources").Replace("\\", "/");
		}
#endif

		public Puerts.JsEnv vm;
		public Action<float> JS_update;
		public Action<float> JS_fixedUpdate;
		public Action<float> JS_lateUpdate;
		public Action JS_finalize;
		public JavaScriptLoader loader { get; private set; }

		public static JavaScriptLauncher inst { get; private set; }

		protected virtual async System.Threading.Tasks.Task StartJavaScript()
		{
			DontDestroyOnLoad(gameObject);
			inst = this;
			loader = new JavaScriptLoader(DebuggerRoot);
#if UNITY_WEBGL && !UNITY_EDITOR
			vm = Puerts.WebGL.GetBrowserEnv();
#else
			vm = new Puerts.JsEnv(loader);
#endif
			this.RegisterClasses(vm);
			if (WaitForDebugger)
			{
				await vm.WaitDebuggerAsync();
			}
			// vm.Eval(String.Format(@"
			// 	Object.defineProperty(globalThis, '__tiny_DebuggerRoot', { value: '{0}', enumerable: true, configurable: false, writable: false });
			// ", DebuggerRoot));
			// 加载启动JS脚本, 执行脚本 main 函数
			foreach (var polyfill in this.Polyfills) {
				vm.ExecuteModule(polyfill);
			}
			var javascript_main = vm.ExecuteModule<JavaScriptMain>(Bootstrap, "default");
			javascript_main(this);
		}

		protected virtual void RegisterClasses(Puerts.JsEnv vm)
		{
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
			vm.UsingAction<UnityEngine.SceneManagement.Scene, UnityEngine.SceneManagement.LoadSceneMode>();
			vm.UsingAction<UnityEngine.SceneManagement.Scene, UnityEngine.SceneManagement.Scene>();
			vm.UsingAction<UnityEngine.AsyncOperation>();
		}

		protected void FixedUpdate()
		{
			if (JS_fixedUpdate != null) JS_fixedUpdate(Time.fixedUnscaledDeltaTime);
		}

		protected void Update()
		{
			if (vm != null) vm.Tick();
			if (JS_update != null) JS_update(Time.unscaledDeltaTime);
		}

		protected void LateUpdate()
		{
			if (JS_lateUpdate != null) JS_lateUpdate(Time.unscaledDeltaTime);
		}

		protected void OnDestroy()
		{
			if (JS_finalize != null) JS_finalize();
			if (loader != null)
			{
				loader.Close();
			}
			if (vm != null)
			{
				vm.Dispose();
			}
		}
	}
}
