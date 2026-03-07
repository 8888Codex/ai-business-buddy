import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Clock, Zap } from "lucide-react";
import { useState } from "react";

interface TrialBannerProps {
  onUpgradeClick?: () => void;
}

export function TrialBanner({ onUpgradeClick }: TrialBannerProps) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || user?.plan !== "trial" || user?.trial_days_left === null) {
    return null;
  }

  const daysLeft = user.trial_days_left;
  const isUrgent = daysLeft <= 1;
  const isWarning = daysLeft <= 3;

  if (daysLeft <= 0) {
    return null;
  }

  const bgColor = isUrgent
    ? "bg-red-50 border-red-200"
    : isWarning
      ? "bg-orange-50 border-orange-200"
      : "bg-blue-50 border-blue-200";

  const textColor = isUrgent
    ? "text-red-800"
    : isWarning
      ? "text-orange-800"
      : "text-blue-800";

  const buttonColor = isUrgent
    ? "bg-red-600 hover:bg-red-700"
    : isWarning
      ? "bg-orange-600 hover:bg-orange-700"
      : "bg-blue-600 hover:bg-blue-700";

  const Icon = isUrgent ? AlertCircle : isWarning ? Clock : Zap;

  return (
    <div
      className={`border-l-4 p-4 mb-4 ${bgColor} ${textColor} rounded-r-lg flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-semibold">
            {isUrgent
              ? "⚠️ Trial expira hoje!"
              : `Trial expira em ${daysLeft} dia${daysLeft > 1 ? "s" : ""}`}
          </p>
          <p className="text-sm opacity-90">
            Faça upgrade agora para continuar usando a plataforma
          </p>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2 text-sm font-medium rounded hover:opacity-80 transition"
        >
          Descartar
        </button>
        <button
          onClick={onUpgradeClick}
          className={`px-4 py-2 text-sm font-medium text-white rounded transition ${buttonColor}`}
        >
          Fazer Upgrade
        </button>
      </div>
    </div>
  );
}
