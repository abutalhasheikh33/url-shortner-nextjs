import { JSX } from "react";

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Input({
  placeholder,
  value,
  onChange,
}: InputProps): JSX.Element {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border p-2"
    />
  );
}
