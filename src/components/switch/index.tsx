import { Switch as TSwitch } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

export function Switch({
  enabled,
  setEnabled,
  label,
}: {
  enabled: boolean;
  setEnabled: (e: boolean) => void;
  label: string;
}) {
  return (
    <TSwitch.Group as="div" className="flex items-center">
      <TSwitch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          enabled ? "bg-blue-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </TSwitch>
      <TSwitch.Label as="span" className="ml-3 text-xs">
        <span className="font-medium text-gray-900">{label}</span>
      </TSwitch.Label>
    </TSwitch.Group>
  );
}
