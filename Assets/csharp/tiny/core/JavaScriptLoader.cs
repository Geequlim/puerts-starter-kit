using System.IO;
using System;
using UnityEngine;

namespace tiny
{

	public class JavaScriptLoader : Puerts.ILoader
	{
		public string debugRoot { get; private set; }
		public string localScriptFolder { get; private set; }

		public JavaScriptLoader(string localScriptFolder, string debugRoot)
		{
			this.debugRoot = debugRoot;
			this.localScriptFolder = localScriptFolder;
		}

		public bool FileExists(string filepath)
		{
			if (filepath.StartsWith("puerts/")) return true;
#if UNITY_EDITOR
			return System.IO.File.Exists(System.IO.Path.Combine(localScriptFolder, filepath));
#else
			return true;
#endif
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
			if (filepath.StartsWith("puerts/"))
			{
				var asset = UnityEngine.Resources.Load<UnityEngine.TextAsset>(filepath);
				return asset.text;
			}
			return File.ReadAllText(Path.Combine(localScriptFolder, filepath));
		}

		public void Close() { }
	}

}
