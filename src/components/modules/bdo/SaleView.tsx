const SaleView = () => {

    const projectData = [
        {
            key: 'Client Name',
            value: 'John Doe'
        },
        {
            key: 'Project Name',
            value: 'Project A'
        },
        {
            key: 'Client Email',
            value: 'john.doe@example.com'
        },
        {
            key: 'Total Amount',
            value: '$100,000'
        },
        {
            key: 'Status',
            value: 'Active'
        },
        {
            key: 'Start Date',
            value: '2023-01-01'
        },
        {
            key: 'End Date',
            value: '2023-12-31'
        }
    ]

    interface Milestone {
        nor: number;
        milestone: string;
        status: string;
        activePayment: number;
        pendingPayment: number;
        startDate: string;
        endDate: string;
    }

    const milestones: Milestone[] = [
        {
            nor: 1,
            milestone: "Milestone",
            status: "Active",
            activePayment: 500,
            pendingPayment: 600,
            startDate: "1-1-2025",
            endDate: "1-1-2026",
        },
        {
            nor: 2,
            milestone: "Milestone",
            status: "Active",
            activePayment: 500,
            pendingPayment: 600,
            startDate: "1-1-2025",
            endDate: "1-1-2026",
        },
        {
            nor: 3,
            milestone: "Milestone",
            status: "Active",
            activePayment: 500,
            pendingPayment: 600,
            startDate: "1-1-2025",
            endDate: "1-1-2026",
        },
        {
            nor: 4,
            milestone: "Milestone",
            status: "Active",
            activePayment: 500,
            pendingPayment: 600,
            startDate: "1-1-2025",
            endDate: "1-1-2026",
        },
    ];

    return (
        <div className="lg:p-4 sm:p-3 p-2.5 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Project Name</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {projectData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.key}:</p>
                        <p className="text-sm">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <h3 className="text-base font-semibold mb-2">Project Description</h3>
                <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestias eum hic adipisci voluptate consectetur doloremque porro ad ducimus atque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis sint voluptas nostrum quod in explicabo, itaque repellendus eligendi quia voluptatum earum ratione magni ipsam dicta, enim veniam laudantium, ab tempora?</p>
            </div>
            <h3 className="text-lg font-semibold mt-6">Milestones</h3>
            <table className="w-full mt-3 overflow-auto">
                <thead>
                    <tr className="text-gray-300 border-y border-gray-200">
                        <th className="py-3 px-4 text-left">Nor</th>
                        <th className="py-3 px-4 text-left">Milestone</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Active Payment</th>
                        <th className="py-3 px-4 text-left">Pending Payment</th>
                        <th className="py-3 px-4 text-left">Start date</th>
                        <th className="py-3 px-4 text-left">End date</th>
                    </tr>
                </thead>
                <tbody>
                    {milestones.map((milestone) => (
                        <tr
                            key={milestone.nor}
                            className="border-b border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            <td className="py-3 px-4">{milestone.nor}</td>
                            <td className="py-3 px-4">{milestone.milestone}</td>
                            <td className="py-3 px-4">
                                <span className="px-2 py-1 text-sm rounded-full bg-green-900 text-green-300">
                                    {milestone.status}
                                </span>
                            </td>
                            <td className="py-3 px-4">${milestone.activePayment}</td>
                            <td className="py-3 px-4">${milestone.pendingPayment}</td>
                            <td className="py-3 px-4">{milestone.startDate}</td>
                            <td className="py-3 px-4">{milestone.endDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SaleView