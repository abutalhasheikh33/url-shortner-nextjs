import { JSX } from "react";

// Reusable input component with optional read-only mode
type InputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  isReadOnly?: boolean;
};

export default function Input({
  placeholder,
  value,
  onChange,
  isReadOnly,
}: InputProps): JSX.Element {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={!!isReadOnly}
      className="flex-1 border p-2"
    />
  );
}
