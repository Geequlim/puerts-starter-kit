using System.IO;
using System;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEditor;

namespace tiny
{
	[Serializable]
	public class ScriptVersion
	{
		public readonly static string VERSION_FILE_NAME = "version.json";
		public long time;
		public string hash;
	}

	public interface IScriptLoader
	{
		ScriptVersion version { get; }
		bool FileExists(string filepath);
		string ReadFile(string filepath);
		string GetScriptDebugPath(string filepath);
		void Close();
	}

	public class JavaScriptLoader : Puerts.ILoader
	{
		public readonly string scriptPatchDirectory = Path.Combine(Application.persistentDataPath, "patches", "scripts");
		public string debugRoot { get; private set; }
		public List<IScriptLoader> loaders { get; private set; }

		public JavaScriptLoader(string debugRoot)
		{
			this.debugRoot = debugRoot;
			loaders = new List<IScriptLoader>() {
				new BuiltinScriptLoader(),
				new ScriptDirectoryLoader(Path.Combine(UnityEngine.Application.streamingAssetsPath, "scripts")),
				new ScriptDirectoryLoader(scriptPatchDirectory),
			};
		}

		public bool FileExists(string filepath)
		{
			return this.loaders.Find(loader => loader.FileExists(filepath)) != null;
		}

		public string GetScriptDebugPath(string filepath)
		{
			return filepath.Replace('\\', '/');
			// return System.IO.Path.Combine(debugRoot, filepath).Replace("\\", "/");
		}

		public string ReadFile(string filepath, out string debugpath)
		{
			debugpath = GetScriptDebugPath(filepath);
			IScriptLoader loader = null;
			for (int i = 0; i < loaders.Count; i++)
			{
				if (!loaders[i].FileExists(filepath)) continue;
				if (loader == null || loader.version.time < loaders[i].version.time)
				{
					loader = loaders[i];
				}
			}
			return loader.ReadFile(filepath);
		}

		public void Close()
		{
			for (int i = 0; i < loaders.Count; i++)
			{
				loaders[i].Close();
			}
		}
	}

	public class BuiltinScriptLoader : IScriptLoader {

		public ScriptVersion version { get; private set; }
		public static string[] Excludes = new string[] {
			"puerts/log.mjs",
		};

		protected Dictionary<string, Tuple<bool, TextAsset>> cache = new Dictionary<string, Tuple<bool, TextAsset>>();

		public BuiltinScriptLoader() {
			version = new ScriptVersion() { time = 0, hash = "" };
		}

		public bool FileExists(string filepath) {
			if (cache.TryGetValue(filepath, out var value)) {
				return value.Item1;
			} else {
				var ext = Path.GetExtension(filepath);
				var rid = filepath.Substring(0, filepath.Length - ext.Length);
				var asset = UnityEngine.Resources.Load<UnityEngine.TextAsset>(rid);
				var exists = asset != null;
				cache[filepath] = new Tuple<bool, TextAsset>(exists, asset);
				return exists;
			}
		}

		public string ReadFile(string filepath) {
			if (Excludes.Contains(filepath)) return "undefined;";
			if (cache.TryGetValue(filepath, out var value)) {
				return value.Item2.text;
			}
			return String.Empty;
		}

		public void Close() {
			foreach (var item in this.cache) {
				if (item.Value.Item1) {
					UnityEngine.Resources.UnloadAsset(item.Value.Item2);
				}
			}
			cache.Clear();
		}

		public string GetScriptDebugPath(string filepath) {
#if UNITY_EDITOR
			return AssetDatabase.GetAssetPath(cache[filepath].Item2);
#else
			return filepath;
#endif
		}
	}

	public class ScriptDirectoryLoader : IScriptLoader {
		public string directory { get; private set; }
		public ScriptVersion version { get; private set; }

		public ScriptDirectoryLoader(string directory)
		{
			this.directory = directory;
			Reload();
		}

		public bool FileExists(string filepath)
		{
			return System.IO.File.Exists(System.IO.Path.Combine(directory, filepath));
		}

		public string ReadFile(string filepath)
		{
			return System.IO.File.ReadAllText(System.IO.Path.Combine(directory, filepath));
		}

		public void Close() {

		}

		public void Reload() {
			var versionFile = System.IO.Path.Combine(directory, ScriptVersion.VERSION_FILE_NAME);
			if (System.IO.File.Exists(versionFile)) {
				version = JsonUtility.FromJson<ScriptVersion>(System.IO.File.ReadAllText(versionFile));
			}
		}

		public string GetScriptDebugPath(string filepath) {
			return System.IO.Path.Combine(directory, filepath).Replace("\\", "/");
		}
	}
}
