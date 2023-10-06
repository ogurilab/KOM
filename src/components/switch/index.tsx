import { Switch as TSwitch } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

type SwitchProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof TSwitch>,
  "onChange" | "checked"
>;

export function Switch({ enabled, setEnabled, label, ...props }: SwitchProps) {
  return (
    <TSwitch.Group as="div" className="flex items-center gap-x-3">
      <TSwitch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          enabled ? "bg-blue-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </TSwitch>
      {label && (
        <TSwitch.Label
          as="span"
          className={clsx("text-xs font-medium text-gray-900")}
        >
          <span>{label}</span>
        </TSwitch.Label>
      )}
    </TSwitch.Group>
  );
}
