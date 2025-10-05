interface ButtonProps {
  label: any;
  onClick?: any;
  variant?: "primary" | "secondary";
  disabled?: any;
}

const Button = ({
  label,
  onClick,
  variant = "primary",
  disabled,
}: ButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full py-3 rounded-md font-semibold ${
      variant === "primary"
        ? "bg-[#F9CA44] hover:bg-yellow-500 text-white text-lg"
        : "text-gray-600 text-lg outline outline-1 outline-[#F9CA44]"
    }`}
  >
    {label}
  </button>
);

export default Button;
