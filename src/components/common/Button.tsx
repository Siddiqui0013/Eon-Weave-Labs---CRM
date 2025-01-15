interface ButtonProps {
  title: string
  className?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export default function Button({ title, icon, onClick, className }: ButtonProps) {
  return (
    <div className={`bg-primary px-4 py-2 flex gap-2 items-center rounded-lg ${className}`}
      onClick={onClick}
    >
      {icon && <span className="text-white">{icon}</span>}
      <span className="text-white">{title}</span>

    </div>
  )
}
