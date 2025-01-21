interface ButtonProps {
  title: string
  className?: string
  icon?: React.ReactNode
  onClick?: (e : React.MouseEvent<HTMLButtonElement>) => void
  type ?: "button" | "submit"
  disabled ?: boolean
}

export default function Button({ title, icon, onClick, className, disabled = false, type }: ButtonProps) {
  return (
    <button className={`bg-primary px-4 py-2 flex gap-2 items-center rounded-lg ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...(disabled && { style: { cursor: 'not-allowed' } })}
    >
      {icon && <span className="text-white">{icon}</span>}
      <span className="text-white">{title}</span>

    </button>
  )
}
