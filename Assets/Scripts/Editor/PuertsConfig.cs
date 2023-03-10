using System.IO;
using System.Reflection;
using System.Collections.Generic;
using Puerts;
using System;
using UnityEngine;

[Configure]
public class ExamplesCfg
{

	// 生成静态绑定的命名空间
	static HashSet<string> StaticBindingNamespaces = new HashSet<string>()
	{
		"tiny",
		"tiny.utils",
		"FairyGUI",
		"FairyGUI.Utils",
		"StarkSDKSpace",
	};

	// 不对 TypeScript 进行暴露的类
	static Dictionary<string, HashSet<string>> IgnoredClasses = new Dictionary<string, HashSet<string>>()
	{
		{
			"FairyGUI", new HashSet<string>(){
				"TreeNode",
				"TreeView",
			}
		},
		{
			"tiny", new HashSet<string>() {
				"LightmapedPrefab",
			}
		},
	};

	// 生成静态绑定的类
	static HashSet<Type> StaticBindingClasses = new HashSet<Type>()
	{
		typeof(Array),
		typeof(List<string>),
		typeof(Puerts.ArrayBuffer),

		typeof(UnityEngine.Vector2),
		typeof(UnityEngine.Vector3),
		typeof(UnityEngine.Vector4),
		typeof(UnityEngine.Quaternion),
		typeof(UnityEngine.Color),
		typeof(UnityEngine.Rect),
		typeof(UnityEngine.Bounds),
		typeof(UnityEngine.Ray),
		typeof(UnityEngine.RaycastHit),
		typeof(UnityEngine.Matrix4x4),

		typeof(UnityEngine.Time),
		typeof(UnityEngine.Debug),
		typeof(UnityEngine.Transform),
		typeof(UnityEngine.Object),
		typeof(UnityEngine.GameObject),
		typeof(UnityEngine.Component),
		typeof(UnityEngine.Behaviour),
		typeof(UnityEngine.MonoBehaviour),
		typeof(UnityEngine.AudioClip),
		typeof(UnityEngine.ParticleSystem.MainModule),
		typeof(UnityEngine.AnimationClip),
		typeof(UnityEngine.Animator),
		typeof(UnityEngine.AnimationCurve),
		typeof(UnityEngine.Collider),
		typeof(UnityEngine.Collision),
		typeof(UnityEngine.Rigidbody),
		typeof(UnityEngine.Screen),
		typeof(UnityEngine.Texture),
		typeof(UnityEngine.TextAsset),
		typeof(UnityEngine.SystemInfo),
		typeof(UnityEngine.Input),
		typeof(UnityEngine.Mathf),
		typeof(UnityEngine.Camera),
		typeof(UnityEngine.ParticleSystem),
		typeof(UnityEngine.AudioSource),
		typeof(UnityEngine.AudioListener),
		typeof(UnityEngine.Physics),
		typeof(UnityEngine.Application),
		typeof(UnityEngine.SceneManagement.Scene),
		typeof(UnityEngine.Networking.UnityWebRequest),
	};

	// 通过反射向TypeScript暴露的类型
	static HashSet<Type> ReflectionTypings = new HashSet<Type>()
	{
		typeof(IEnumerable<string>),
		typeof(Dictionary<string, string>),
		typeof(KeyValuePair<string, string>),
		typeof(System.Collections.IEnumerator),
		typeof(Dictionary<string, string>.Enumerator),
		typeof(IReadOnlyDictionary<string, string>),
	};

	[Typing]
	static IEnumerable<Type> Typings
	{
		get
		{
			var types = new HashSet<Type>(ReflectionTypings);
			var namespaces = new HashSet<string>() {
				// 在此添加通过反射对 TypeScript 暴露的命名空间
				"System",
				"System.IO",
				"System.Net",
				"System.Text",
				"System.Reflection",
				"UnityEngine",
				"UnityEngine.Networking",
				"UnityEngine.ParticleSystem",
				"UnityEngine.SceneManagement",
				"UnityEditor",
				"ICSharpCode.SharpZipLib",
				"ICSharpCode.SharpZipLib.Zip",
				"Tayx.Graphy",
			};
			namespaces.UnionWith(StaticBindingNamespaces);

			Dictionary<string, HashSet<string>> ignored = new Dictionary<string, HashSet<string>>()
			{
				// 添加不生成 Typeing 的类
			};
			foreach (var pair in IgnoredClasses)
			{
				HashSet<string> classes = null;
				ignored.TryGetValue(pair.Key, out classes);
				if (classes == null) classes = new HashSet<string>();
				classes.UnionWith(pair.Value);
				ignored[pair.Key] = classes;
			}

			Dictionary<string, HashSet<string>> registered = new Dictionary<string, HashSet<string>>();
			foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
			{
				var name = assembly.GetName().Name;
				foreach (var type in assembly.GetTypes())
				{
					if (!type.IsPublic) continue;
					if (type.Name.Contains("<") || type.Name.Contains("*")) continue; // 忽略泛型，指针类型
					if (type.Namespace == null || type.Name == null) continue; // 这是啥玩意？
					if (registered.ContainsKey(type.Namespace) && registered[type.Namespace].Contains(type.Name)) continue; // 忽略重复的类
					bool accept = namespaces.Contains(type.Namespace);
					if (accept && ignored.ContainsKey(type.Namespace) && ignored[type.Namespace].Contains(type.Name)) continue;
					if (accept)
					{
						types.Add(type);
						if (!registered.ContainsKey(type.Namespace))
						{
							var classes = new HashSet<string>();
							classes.Add(type.Name);
							registered.Add(type.Namespace, classes);
						}
						else
						{
							registered[type.Namespace].Add((type.Name));
						}
					}
				}
			}
			return types;
		}
	}

	[Binding]
	static IEnumerable<Type> Bindings
	{
		get
		{
			var types = new List<Type>(StaticBindingClasses);
			var namespaces = new HashSet<string>(StaticBindingNamespaces);

			Dictionary<string, HashSet<string>> ignored = new Dictionary<string, HashSet<string>>()
			{
				// 添加不生成 binding 的类
				{
					"FairyGUI", new HashSet<string>(){
						"UIPackage",
					}
				}
			};
			foreach (var pair in IgnoredClasses)
			{
				HashSet<string> classes = null;
				ignored.TryGetValue(pair.Key, out classes);
				if (classes == null) classes = new HashSet<string>();
				classes.UnionWith(pair.Value);
				ignored[pair.Key] = classes;
			}

			var ignored_assemblys = new HashSet<string>() {
				"UnityEditor",
				"Assembly-CSharp-Editor"
			};

			Dictionary<string, HashSet<string>> registered = new Dictionary<string, HashSet<string>>();
			foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
			{
				var name = assembly.GetName().Name;
				if (ignored_assemblys.Contains(name)) continue;
				foreach (var type in assembly.GetTypes())
				{
					if (!type.IsPublic) continue;
					if (type.Name.Contains("<") || type.Name.Contains("*")) continue; // 忽略泛型，指针类型
					if (type.Namespace == null || type.Name == null) continue; // 这是啥玩意？
					bool accept = namespaces.Contains(type.Namespace);
					if (accept && ignored.ContainsKey(type.Namespace) && ignored[type.Namespace].Contains(type.Name)) continue;
					if (accept)
					{
						types.Add(type);
						if (!registered.ContainsKey(type.Namespace))
						{
							var classes = new HashSet<string>();
							classes.Add(type.Name);
							registered.Add(type.Namespace, classes);
						}
						else
						{
							registered[type.Namespace].Add((type.Name));
						}
					}
				}
			}
			return types;
		}
	}

	[Filter]
	static bool Filter(MemberInfo memberInfo)
	{
		string sig = memberInfo.ToString();
		if (sig.Contains("*")) return true;

		string name = memberInfo.Name;
		string className = memberInfo.ReflectedType.FullName;
		var skips = new Dictionary<string, HashSet<string>>(){
			{ "UnityEngine.MonoBehaviour", new HashSet<string>() { "runInEditMode" } },
			{ "UnityEngine.Input", new HashSet<string>() { "IsJoystickPreconfigured" } },
			{ "UnityEngine.Texture", new HashSet<string>() { "imageContentsHash" } },
			{ "tiny.Utils", new HashSet<string>() { "GetAssetDependencies" }},
		};
		if (skips.ContainsKey(className) && skips[className].Contains(name)) return true;

		return false;
	}

	[BlittableCopy]
	static IEnumerable<Type> Blittables
	{
		get
		{
			return new List<Type>() {
				//打开这个可以优化Vector3的GC，但需要开启unsafe编译
				typeof(Vector2),
				typeof(Vector3),
				typeof(Vector4),
				typeof(Quaternion),
				typeof(Color),
				typeof(Rect),
				typeof(Bounds),
				typeof(Ray),
				typeof(RaycastHit),
				typeof(Matrix4x4),
			};
		}
	}

	[CodeOutputDirectory]
	static string GenerateDirectory
	{
		get
		{
			return Path.Combine(Application.dataPath, "Scripts", "gen", "puerts") + "/";
		}
	}
}
