import { useState } from "react";

export const Unit1CommandOption = {
  Komut1: 1,
  Komut2: 2,
  Komut3: 3,
} as const;

export type Unit1CommandOption =
  (typeof Unit1CommandOption)[keyof typeof Unit1CommandOption];

export type Unit1ForceValue = 0 | 1;

const unit1CommandOptions: Array<{
  value: Unit1CommandOption;
  label: string;
}> = [
  { value: Unit1CommandOption.Komut1, label: "Komut 1" },
  { value: Unit1CommandOption.Komut2, label: "Komut 2" },
  { value: Unit1CommandOption.Komut3, label: "Komut 3" },
];

type Unit1CommandFormProps = {
  onSubmit?: (command: Unit1CommandOption, force: Unit1ForceValue) => void;
};

export function Unit1CommandForm({ onSubmit }: Unit1CommandFormProps) {
  const [selectedCommand, setSelectedCommand] = useState<Unit1CommandOption>(
    unit1CommandOptions[0].value,
  );
  const [forceCommand, setForceCommand] = useState(false);

  return (
    <div className="unit-command-form" aria-label="UNITE-1 komut gonderimi">
      <label className="unit-command-form__field">
        <span>Komut</span>
        <select
          value={selectedCommand}
          onChange={(event) =>
            setSelectedCommand(Number(event.target.value) as Unit1CommandOption)
          }
        >
          {unit1CommandOptions.map((command) => (
            <option value={command.value} key={command.value}>
              {command.label}
            </option>
          ))}
        </select>
      </label>

      <label className="unit-command-form__force">
        <input
          type="checkbox"
          checked={forceCommand}
          onChange={(event) => setForceCommand(event.target.checked)}
        />
        <span>Zorla</span>
      </label>

      <button
        className="button unit-command-form__submit"
        type="button"
        onClick={() => onSubmit?.(selectedCommand, forceCommand ? 1 : 0)}
      >
        Gonder
      </button>
    </div>
  );
}
