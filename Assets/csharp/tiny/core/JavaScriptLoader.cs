using System.IO;
using System;
using System.Collections.Generic;
using UnityEngine;


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
				new PuertsBuiltinScriptLoader(),
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
			if (filepath.StartsWith("puerts/"))
			{
				return Path.Combine(Application.dataPath, "csharp/Libraries/Puerts/Src/Resources", filepath).Replace("\\", "/") + ".txt";
			}
			return System.IO.Path.Combine(debugRoot, filepath).Replace("\\", "/");
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

	public class PuertsBuiltinScriptLoader : IScriptLoader
	{
		static HashSet<string> DiabledBuitinScripts = new HashSet<string> {
			"puerts/log.js",
		};

		public ScriptVersion version { get; private set; }

		public PuertsBuiltinScriptLoader()
		{
			version = new ScriptVersion() { time = System.DateTime.Now.ToFileTime(), hash = "" };
		}

		public bool FileExists(string filepath)
		{
			return filepath.StartsWith("puerts/");
		}

		public string ReadFile(string filepath)
		{
			if (DiabledBuitinScripts.Contains(filepath)) return "";
			var asset = UnityEngine.Resources.Load<UnityEngine.TextAsset>(filepath);
			return asset.text;
		}

		public void Close()
		{

		}
	}

	public class ScriptDirectoryLoader : IScriptLoader
	{
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

		public void Close()
		{
		}

		public void Reload()
		{
			var versionFile = System.IO.Path.Combine(directory, ScriptVersion.VERSION_FILE_NAME);
			if (System.IO.File.Exists(versionFile))
			{
				version = JsonUtility.FromJson<ScriptVersion>(System.IO.File.ReadAllText(versionFile));
			}
		}
	}
}
