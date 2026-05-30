import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Section, Toggle } from "./SettingsPrimitives";
import {
  useNotifSettings,
  useUpdateNotifSettings,
} from "@/hooks/queries/useSettings";
import type { NotifSettings } from "@/api/settings.api";

type PrefKey = keyof NotifSettings;

const NOTIF_ITEMS: { key: PrefKey; label: string; desc: string }[] = [
  {
    key: "newMember",
    label: "New member registration",
    desc: "When a new member registers",
  },
  {
    key: "pendingShepherd",
    label: "Shepherd awaiting approval",
    desc: "When a shepherd registration needs review",
  },
  {
    key: "lowAttendance",
    label: "Low attendance alert",
    desc: "When a shepherd's rate drops below 60%",
  },
  {
    key: "eventReminder",
    label: "Event reminders",
    desc: "24 hours before an event",
  },
  {
    key: "weeklyDigest",
    label: "Weekly summary digest",
    desc: "Every Monday morning overview",
  },
];

const CHANNEL_ITEMS: { key: PrefKey; label: string; desc: string }[] = [
  {
    key: "emailNotifs",
    label: "Email notifications",
    desc: "Send to your registered email address",
  },
  {
    key: "inAppNotifs",
    label: "In-app notifications",
    desc: "Bell icon in the dashboard header",
  },
];

const DEFAULT: NotifSettings = {
  newMember: true,
  pendingShepherd: true,
  lowAttendance: true,
  eventReminder: false,
  weeklyDigest: true,
  emailNotifs: true,
  inAppNotifs: true,
};

export const NotifTab: React.FC = () => {
  const { data, isLoading } = useNotifSettings();
  const update = useUpdateNotifSettings();
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<NotifSettings>(DEFAULT);

  useEffect(() => {
    if (data) setPrefs(data);
  }, [data]);

  const toggle = (k: PrefKey) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const save = async () => {
    setSaving(true);
    try {
      await update.mutateAsync(prefs);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <Section
        title="Notification Preferences"
        desc="Choose what you want to be notified about"
        onSave={save}
        saving={saving}
      >
        <div className="space-y-1">
          {NOTIF_ITEMS.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-50 last:border-0"
            >
              <div>
                <p className="text-[13px] font-medium text-slate-900">
                  {label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={prefs[key] as boolean}
                onChange={() => toggle(key)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Delivery Channels" onSave={save} saving={saving}>
        {CHANNEL_ITEMS.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-2"
          >
            <div>
              <p className="text-[13px] font-medium text-slate-900">{label}</p>
              <p className="text-[11px] text-slate-400">{desc}</p>
            </div>
            <Toggle
              checked={prefs[key] as boolean}
              onChange={() => toggle(key)}
            />
          </div>
        ))}
      </Section>
    </div>
  );
};

export default NotifTab;
