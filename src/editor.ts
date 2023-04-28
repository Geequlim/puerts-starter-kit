import { UnityEditor, UnityEngine, tiny } from 'csharp';

class EditorWindow extends tiny.JSEditorWindow {

	get title(): string { return this.constructor.name; }

	onConstruct() {}
	onEnable() {}
	onFocus() {}
	onSelectionChange() {}
	onLostFocus() {}
	onInspectorUpdate() {}
	onHierarchyChange() {}
	onProjectChange() {}
	onGUI() {}
	onDisable() {}
	onDestroy() {}
}


class MyEditorWindow extends EditorWindow {

	get title(): string {
		return '我的窗口';
	}

	private myString: string;

	onConstruct(): void {
		this.myString = 'Hello World';
	}

	onGUI(): void {
		UnityEngine.GUILayout.Label("Base Settings", UnityEditor.EditorStyles.boldLabel);
		this.myString = UnityEditor.EditorGUILayout.TextField("Text Field", this.myString);
	}
}

class Editor {

	readonly registedWindowTypes: Record<string, new () => EditorWindow> = {
		MyEditorWindow,
	};
	readonly windows: EditorWindow[] = [];

	constructor(readonly plugin: tiny.TinyUnityEditorPlugin) {
		plugin.functions.initialize = this.initialize.bind(this);
		plugin.functions.finalize = this.finalize.bind(this);
		plugin.functions.onCreateWindow = this.onCreateWindow.bind(this);
	}

	initialize() {

	}

	finalize() {
		this.windows.forEach(w => w.Close());
	}

	onCreateWindow(native: tiny.JSEditorWindow) {
		const Type = this.registedWindowTypes[this.plugin.makingWindow];
		if (Type) {
			Object.setPrototypeOf(native, Type.prototype);
			let window = native as EditorWindow;
			window.onConstruct();
			native.functions.OnEnable = window.onEnable.bind(window);
			let everSetTitle = false;
			native.functions.OnFocus = () => {
				if (!everSetTitle) {
					window.titleContent.text = window.title;
					everSetTitle = true;
				}
				window.onFocus.bind(window);
			};
			native.functions.OnSelectionChange = window.onSelectionChange.bind(window);
			native.functions.OnLostFocus = window.onLostFocus.bind(window);
			native.functions.OnInspectorUpdate = window.onInspectorUpdate.bind(window);
			native.functions.OnHierarchyChange = window.onHierarchyChange.bind(window);
			native.functions.OnProjectChange = window.onProjectChange.bind(window);
			native.functions.OnGUI = window.onGUI.bind(window);
			native.functions.OnDisable = () => {
				const idx = this.windows.indexOf(window);
				if (idx >= 0) this.windows.splice(idx, 1);
				window.onDisable.bind(window);
			};
			native.functions.OnDestroy = window.onDestroy.bind(window);
			this.windows.push(window);
		}
	}
}

export default function main(lancher: tiny.TinyUnityEditorPlugin) {
	return new Editor(lancher);
}
