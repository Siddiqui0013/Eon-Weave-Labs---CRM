interface CardProps {
    data: {
        icon: React.ReactNode;
        title: string;
        val: string;
    };
}

export default function Card( { data }: CardProps ) {
  return (
    <div className="bg-card p-4 min-w-48 rounded-lg flex items-center gap-4">
    <div className="text-3xl bg-white text-primary p-3 rounded-full">{data.icon}</div>
    <div className="flex flex-col gap-1">
      <p className="text-sm text-gray-300">{data.title}</p>
      <p className="text-lg font-semibold">{data.val}</p>
    </div>
  </div>
  )
}
