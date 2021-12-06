using System.IO;
using System.Reflection;
using System.Collections.Generic;
using Puerts;
using System;
using UnityEngine;

[Configure]
public class ExamplesCfg
{

	[Typing]
	static IEnumerable<Type> Typings
	{
		get
		{

			var types = new List<Type>();

			var namespaces = new HashSet<string>();
			namespaces.Add("tiny");

			namespaces.Add("System");
			namespaces.Add("UnityEngine");
			namespaces.Add("UnityEngine.Networking");
			namespaces.Add("UnityEngine.ParticleSystem");
			namespaces.Add("UnityEngine.SceneManagement");
			namespaces.Add("UnityEditor");
			namespaces.Add("System.IO");
			namespaces.Add("System.Net");
			namespaces.Add("System.Reflection");
			Dictionary<string, HashSet<string>> ignored = new Dictionary<string, HashSet<string>>();
			var ignored_classes = new HashSet<string>();
			ignored_classes.Add("ContextMenuItemAttribute");
			ignored_classes.Add("HashUnsafeUtilities");
			ignored_classes.Add("SpookyHash");
			ignored_classes.Add("ContextMenuItemAttribute");
			ignored_classes.Add("U");
			ignored.Add("UnityEngine", ignored_classes);
			ignored_classes = new HashSet<string>();
			ignored_classes.Add("ContextMenuItemAttribute");
			ignored.Add("UnityEditor", ignored_classes);

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
			types.Add(typeof(System.Convert));
			types.Add(typeof(System.Text.Encoding));
			types.Add(typeof(Dictionary<string, string>));
			types.Add(typeof(KeyValuePair<string, string>));
			types.Add(typeof(Dictionary<string, string>.Enumerator));

			return types;
		}
	}

	[Binding]
	static IEnumerable<Type> Bindings
	{
		get
		{
			var types = new List<Type>();
			var namespaces = new HashSet<string>();
			namespaces.Add("tiny");

			Dictionary<string, HashSet<string>> ignored = new Dictionary<string, HashSet<string>>();
			var ignored_classes = new HashSet<string>();
			ignored.Add("game", ignored_classes);

			ignored_classes = new HashSet<string>();
			ignored.Add("tiny", ignored_classes);

			Dictionary<string, HashSet<string>> registered = new Dictionary<string, HashSet<string>>();
			foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
			{
				var name = assembly.GetName().Name;
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

			types.Add(typeof(Array));

			types.Add(typeof(UnityEngine.Vector2));
			types.Add(typeof(UnityEngine.Vector3));
			types.Add(typeof(UnityEngine.Vector4));
			types.Add(typeof(UnityEngine.Quaternion));
			types.Add(typeof(UnityEngine.Color));
			types.Add(typeof(UnityEngine.Rect));
			types.Add(typeof(UnityEngine.Bounds));
			types.Add(typeof(UnityEngine.Ray));
			types.Add(typeof(UnityEngine.RaycastHit));
			types.Add(typeof(UnityEngine.Matrix4x4));

			types.Add(typeof(UnityEngine.Debug));
			types.Add(typeof(UnityEngine.Time));
			types.Add(typeof(UnityEngine.Transform));
			types.Add(typeof(UnityEngine.Object));
			types.Add(typeof(UnityEngine.GameObject));
			types.Add(typeof(UnityEngine.Component));
			types.Add(typeof(UnityEngine.Behaviour));
			types.Add(typeof(UnityEngine.MonoBehaviour));
			types.Add(typeof(UnityEngine.AudioClip));
			types.Add(typeof(UnityEngine.ParticleSystem.MainModule));
			types.Add(typeof(UnityEngine.AnimationClip));
			types.Add(typeof(UnityEngine.Animator));
			types.Add(typeof(UnityEngine.AnimationCurve));
			types.Add(typeof(UnityEngine.AndroidJNI));
			types.Add(typeof(UnityEngine.AndroidJNIHelper));
			types.Add(typeof(UnityEngine.Collider));
			types.Add(typeof(UnityEngine.Collision));
			types.Add(typeof(UnityEngine.Rigidbody));
			types.Add(typeof(UnityEngine.Screen));
			types.Add(typeof(UnityEngine.Texture));
			types.Add(typeof(UnityEngine.TextAsset));
			types.Add(typeof(UnityEngine.SystemInfo));
			types.Add(typeof(UnityEngine.Input));
			types.Add(typeof(UnityEngine.Mathf));

			types.Add(typeof(UnityEngine.Camera));
			types.Add(typeof(UnityEngine.ParticleSystem));
			types.Add(typeof(UnityEngine.AudioSource));
			types.Add(typeof(UnityEngine.AudioListener));
			types.Add(typeof(UnityEngine.Physics));
			types.Add(typeof(UnityEngine.Application));
			types.Add(typeof(UnityEngine.SceneManagement.Scene));
			types.Add(typeof(UnityEngine.Networking.UnityWebRequest));

			return types;
		}
	}

	[Filter]
	static bool Filter(MemberInfo memberInfo)
	{
		string sig = memberInfo.ToString();
		string name = memberInfo.Name;
		string className = memberInfo.ReflectedType.FullName;
		if (className == "UnityEngine.MonoBehaviour" && name == "runInEditMode") return true;
		if (className == "UnityEngine.Input" && name == "IsJoystickPreconfigured") return true;
		if (className == "UnityEngine.Texture" && name == "imageContentsHash") return true;
		if (sig.Contains("*"))
		{
			return true;
		}
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
			return Path.Combine(Application.dataPath, "csharp", "gen") + "/";
		}
	}
}
