interface Milestone {
    _id: string;
    name: string;
    amount: string; 
    startDate: string;
    endDate: string;
    description: string;
    status: string;
  }
  
  interface SaleViewProps {
    sale: {
      _id: string;
      projectName: string;
      clientName: string;
      clientEmail: string;
      description: string;
      startDate: string;
      endDate: string;
      totalAmount: string;
      status: string;
      milestones: Milestone[];
    };
  }
  
  const SaleView = ({ sale }: SaleViewProps) => {
    const projectData = [
      {
        key: 'Client Name',
        value: sale.clientName
      },
      {
        key: 'Project Name',
        value: sale.projectName
      },
      {
        key: 'Client Email',
        value: sale.clientEmail
      },
      {
        key: 'Total Amount',
        value: `$${sale.totalAmount}`
      },
      {
        key: 'Status',
        value: sale.status
      },
      {
        key: 'Start Date',
        value: new Date(sale.startDate).toLocaleDateString()
      },
      {
        key: 'End Date',
        value: new Date(sale.endDate).toLocaleDateString()
      }
    ];
  
    return (
      <div className="lg:p-4 sm:p-3 p-2.5 bg-card rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{sale.projectName}</h3>
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
          <p className="text-sm">{sale.description}</p>
        </div>
        <h3 className="text-lg font-semibold mt-6">Milestones</h3>
        <table className="w-full mt-3 overflow-auto">
          <thead>
            <tr className="text-gray-300 border-y border-gray-200">
              <th className="py-3 px-4 text-left">Milestone</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Start date</th>
              <th className="py-3 px-4 text-left">End date</th>
            </tr>
          </thead>
          <tbody>
            {sale.milestones.map((milestone) => (
              <tr
                key={milestone._id}
                className="border-b border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <td className="py-3 px-4">{milestone.name}</td>
                <td className="py-3 px-4">
                  <span className= {`p-2 text-sm rounded-full ${milestone.status === 'Completed' ? 'bg-green-900 text-green-300' : 'bg-gray-900 text-gray-200'}`} >
                    {milestone.status}
                  </span>
                </td>
                <td className="py-3 px-4">${milestone.amount}</td>
                <td className="py-3 px-4">{new Date(milestone.startDate).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(milestone.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SaleView;










// const SaleView = () => {

//     const projectData = [
//         {
//             key: 'Client Name',
//             value: 'John Doe'
//         },
//         {
//             key: 'Project Name',
//             value: 'Project A'
//         },
//         {
//             key: 'Client Email',
//             value: 'john.doe@example.com'
//         },
//         {
//             key: 'Total Amount',
//             value: '$100,000'
//         },
//         {
//             key: 'Status',
//             value: 'Active'
//         },
//         {
//             key: 'Start Date',
//             value: '2023-01-01'
//         },
//         {
//             key: 'End Date',
//             value: '2023-12-31'
//         }
//     ]

//     const milestones: Milestone[] = [
//         {
//             milestone: "Milestone",
//             status: "Active",
//             Payment: 500,
//             startDate: "1-1-2025",
//             endDate: "1-1-2026",
//         },
//         {
//             milestone: "Milestone",
//             status: "Active",
//             Payment: 500,
//             startDate: "1-1-2025",
//             endDate: "1-1-2026",
//         },
//         {
//             milestone: "Milestone",
//             status: "Active",
//             Payment: 500,
//             startDate: "1-1-2025",
//             endDate: "1-1-2026",
//         },
//         {
//             milestone: "Milestone",
//             status: "Active",
//             Payment: 500,
//             startDate: "1-1-2025",
//             endDate: "1-1-2026",
//         },
//     ];

//     return (
//         <div className="lg:p-4 sm:p-3 p-2.5 bg-card rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Project Name</h3>
//             <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
//                 {projectData.map((item, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <p className="text-sm font-medium">{item.key}:</p>
//                         <p className="text-sm">{item.value}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className="mt-6">
//                 <h3 className="text-base font-semibold mb-2">Project Description</h3>
//                 <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestias eum hic adipisci voluptate consectetur doloremque porro ad ducimus atque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis sint voluptas nostrum quod in explicabo, itaque repellendus eligendi quia voluptatum earum ratione magni ipsam dicta, enim veniam laudantium, ab tempora?</p>
//             </div>
//             <h3 className="text-lg font-semibold mt-6">Milestones</h3>
//             <table className="w-full mt-3 overflow-auto">
//                 <thead>
//                     <tr className="text-gray-300 border-y border-gray-200">
//                         <th className="py-3 px-4 text-left">Milestone</th>
//                         <th className="py-3 px-4 text-left">Status</th>
//                         <th className="py-3 px-4 text-left">Payment</th>
//                         <th className="py-3 px-4 text-left">Start date</th>
//                         <th className="py-3 px-4 text-left">End date</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {milestones.map((milestone, index) => (
//                         <tr
//                             key={index}
//                             className="border-b border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
//                         >
//                             <td className="py-3 px-4">{milestone.milestone}</td>
//                             <td className="py-3 px-4">
//                                 <span className="px-2 py-1 text-sm rounded-full bg-green-900 text-green-300">
//                                     {milestone.status}
//                                 </span>
//                             </td>
//                             <td className="py-3 px-4">{milestone.Payment}</td>
//                             <td className="py-3 px-4">{milestone.startDate}</td>
//                             <td className="py-3 px-4">{milestone.endDate}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

// export default SaleView