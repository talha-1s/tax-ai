import { useState } from "react";

export function EditableCell({ value, onSave }: {
  value: number;
  onSave: (val: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    if (temp !== value) onSave(temp);
    setEditing(false);
  };

  return editing ? (
    <input
      type="number"
      value={temp}
      onChange={(e) => setTemp(Number(e.target.value))}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === "Enter" && handleSave()}
      className="w-full px-2 py-1 border rounded"
      autoFocus
    />
  ) : (
    <span onClick={() => setEditing(true)} className="cursor-pointer hover:underline">
      {value.toFixed(2)}
    </span>
  );
}
