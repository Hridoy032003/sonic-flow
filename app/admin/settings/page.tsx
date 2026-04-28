"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Settings, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: settingsData, mutate } = useApi<{ settings: any }>("/api/admin/settings");
  const [askSubscription, setAskSubscription] = useState(true);
  const [defaultTheme, setDefaultTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (settingsData?.settings) {
      setAskSubscription(settingsData.settings.askSubscription);
      setDefaultTheme(settingsData.settings.defaultTheme);
    }
  }, [settingsData]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ askSubscription, defaultTheme }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      await mutate();
      setMessage("Settings saved successfully!");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Settings className="text-indigo-600" />
          Global Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage application-wide preferences and defaults.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl">
        <div className="space-y-6">

          {/* Subscription Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ask Subscription</h3>
              <p className="text-sm text-slate-500">Enable or disable the subscription prompt on the frontend.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={askSubscription}
                onChange={(e) => setAskSubscription(e.target.checked)}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between py-4 border-b border-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Default Theme</h3>
              <p className="text-sm text-slate-500">Set the default application theme.</p>
            </div>
            <select
              value={defaultTheme}
              onChange={(e) => setDefaultTheme(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <AlertCircle size={18} />
            {message}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
