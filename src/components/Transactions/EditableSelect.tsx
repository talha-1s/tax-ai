import React, { useState } from "react";

export function EditableSelect({ value, options, onSave }: {
  value: string;
  options: string[];
  onSave: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <select
      value={value}
      onChange={(e) => {
        onSave(e.target.value);
        setEditing(false);
      }}
      onBlur={() => setEditing(false)}
      className="px-2 py-1 border rounded"
      autoFocus
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  ) : (
    <span onClick={() => setEditing(true)} className="cursor-pointer hover:underline">
      {value}
    </span>
  );
}
