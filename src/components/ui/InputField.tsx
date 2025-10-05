import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";

interface InputFieldProps {
  label?: string;
  type: string;
  placeholder: string;
  value?: any;
  onChange?: any;
  name?: string;
  disabled?: boolean;
}

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="relative flex flex-col space-y-1">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        disabled={disabled}
        required
      />

      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 pb-2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
        >
          {showPassword ? (<EyeClosed/>) : <EyeIcon/>}
        </button>
      )}
    </div>
  );
};

export default InputField;
