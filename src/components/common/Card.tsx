interface CardProps {
    data: {
        icon: React.ReactNode;
        title: string;
        val: number | string;
    };
}

export default function Card( { data }: CardProps ) {
  return (
    <div className="bg-card md:p-4 p-2 rounded-lg flex items-center gap-4">
    <div className="md:text-3xl text-2xl bg-white text-primary p-3 rounded-full">{data.icon}</div>
    <div className="flex flex-col gap-1">
      <p className="text-sm text-gray-300">{data.title}</p>
      <p className="text-lg font-semibold">{data.val}</p>
    </div>
  </div>
  )
}
