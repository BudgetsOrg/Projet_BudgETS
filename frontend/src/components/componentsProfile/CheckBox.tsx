import React from "react";

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };

  // source : https://flowbite.com/docs/forms/checkbox/
  return (
    <div className="flex items-center mb-4">
      <input
        id="default-checkbox"
        type="checkbox"
        checked={checked}
        className="w-4 h-4 border border-var(--color-delete) rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor="default-checkbox"
        className="select-none ms-2 text-sm font-medium text-heading"
      >
        Par la présente, je confirme avoir pris connaissance de la suppression
        définitive de mon compte.
      </label>
    </div>
  );
}
