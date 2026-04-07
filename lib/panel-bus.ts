/**
 * Panel Event Bus — AI sends commands, panel components listen and execute.
 *
 * Usage from AI (in CoworkLayout):
 *   panelBus.emit("partner", "filter", { caseType: "Profitability", level: "beginner" })
 *   panelBus.emit("jobs", "filter", { region: "UK" })
 *   panelBus.emit("drill", "start", { category: "chart" })
 *   panelBus.emit("casebook", "filter", { type: "Profitability", difficulty: "Easy" })
 *
 * Usage in panel component:
 *   useEffect(() => panelBus.on("partner", handler), [])
 */

type PanelCommand = {
  action: string;
  params: Record<string, any>;
};

type Listener = (cmd: PanelCommand) => void;

class PanelBus {
  private listeners: Record<string, Listener[]> = {};

  on(panel: string, listener: Listener): () => void {
    if (!this.listeners[panel]) this.listeners[panel] = [];
    this.listeners[panel].push(listener);
    return () => {
      this.listeners[panel] = this.listeners[panel].filter((l) => l !== listener);
    };
  }

  emit(panel: string, action: string, params: Record<string, any> = {}) {
    const listeners = this.listeners[panel] || [];
    for (const listener of listeners) {
      listener({ action, params });
    }
  }
}

export const panelBus = new PanelBus();
