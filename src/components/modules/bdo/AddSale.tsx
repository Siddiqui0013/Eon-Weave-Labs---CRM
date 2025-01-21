import { useState } from 'react';
import Button from '@/components/common/Button';
import { useAddSaleMutation } from '@/services/salesApi'
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router';

interface FormData {
  clientName: string;
  clientEmail: string;
  description: string;
  projectName: string;
  startDate: string;
  endDate: string;
  projectAmount: string;
  numberOfMilestones: string;
}
type Milestone = {
  name: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
}

export default function AddSaleForm() {
  const { toast } = useToast();
  const [addSale] = useAddSaleMutation();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    description: '',
    projectName: '',
    startDate: '',
    endDate: '',
    projectAmount: '',
    numberOfMilestones: '1',
  });

  const [milestones, setMilestones] = useState<Milestone[]>([{
    description: '',
    name : '',
    amount: '',
    startDate: '',
    endDate: ''
  }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'numberOfMilestones') {
      const newCount = parseInt(value);
      setMilestones(prev => {
        const newMilestones = [...prev];
        while (newMilestones.length < newCount) {
          newMilestones.push({
            name: '',
            description: '',
            amount: '',
            startDate: '',
            endDate: ''
          });
        }
        while (newMilestones.length > newCount) {
          newMilestones.pop();
        }
        return newMilestones;
      });
    }
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    setMilestones(prev => {
      const newMilestones = [...prev];
      newMilestones[index] = {
        ...newMilestones[index],
        [field]: value
      };
      return newMilestones;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        projectName: formData.projectName,
        description: formData.description,
        startDate: formData.startDate, 
        endDate: formData.endDate,
        totalAmount: Number(formData.projectAmount),
        milestones: milestones.map(milestone => ({
          name: milestone.name,
          description: milestone.description,
          startDate: milestone.startDate, 
          endDate: milestone.endDate, 
          amount: Number(milestone.amount) 
        }))
      };
      console.log("Formatted Data:", formattedData);
      const response = await addSale(formattedData).unwrap();
      console.log("Response:", response);
      setFormData({
        clientName: '',
        clientEmail: '',
        description: '',
        projectName: '',
        startDate: '',
        endDate: '',
        projectAmount: '',
        numberOfMilestones: '1',
      });
      setMilestones([{
        description: '',
        name : '',
        amount: '',
        startDate: '',
        endDate: ''
      }])
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Sale added successfully', 
        duration: 1500
      })
      nav('/bdo/sales-report');
    } catch (error) {
      console.error('Error adding sale:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
        duration: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 md:m-0">
    <form onSubmit={handleSubmit} className="md:w-[90%] w-[98%] bg-card rounded-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Sale</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Customer name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Customer email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full h-32 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Project name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Project amount</label>
              <input
                type="number"
                name="projectAmount"
                value={formData.projectAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">No of milestones</label>
              <select 
                name="numberOfMilestones"
                value={formData.numberOfMilestones}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {[1, 2, 3, 4, 5,6,7,8,9].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Milestone Details</h3>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg">
              <h4 className="text-lg font-medium mb-3">Milestone {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
                    />
                  </div>
                <div>
                    <label className="block text-sm mb-1">Amount</label>
                    <input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
                    />
                  </div>
                </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Start Date</label>
                      <input
                        type="date"
                        value={milestone.startDate}
                        onChange={(e) => handleMilestoneChange(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">End Date</label>
                      <input
                        type="date"
                        value={milestone.endDate}
                        onChange={(e) => handleMilestoneChange(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    className="w-full h-32 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
      <Button
  title="Cancel"
  onClick={(e) => {
    e.preventDefault();
    nav('/bdo/sales-report');
  }}
  type="button"
/>
        <Button title={loading ? 'Saving...' : 'Save'} type="submit" />        
      </div>
    </form>
    </div>
  );
}




// import { useState } from 'react';
// import Button from '@/components/common/Button';

// export default function AddSaleForm() {

//   const [formData, setFormData] = useState({
//     customerName: '',
//     customerEmail: '',
//     description: '',
//     projectName: '',
//     date: '',
//     projectTimeline: '',
//     projectAmount: '',
//     numberOfMilestones: '1',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-4xl bg-card rounded-xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6">Add Sale</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">Customer name</label>
//             <input
//               type="text"
//               name="customerName"
//               value={formData.customerName}
//               onChange={handleInputChange}
//               className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Customer email</label>
//             <input
//               type="email"
//               name="customerEmail"
//               value={formData.customerEmail}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Project name</label>
//             <input
//               type="text"
//               name="projectName"
//               value={formData.projectName}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black  focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="w-full h-32 px-3 py-2 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//             />
//           </div>
//         </div>

//         <div className="space-y-4">

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black  focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="projectTimeline"
//                 value={formData.projectTimeline}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black  focus:ring-primary"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm mb-1">Project amount</label>
//               <input
//                 type="number"
//                 name="projectAmount"
//                 value={formData.projectAmount}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black  focus:ring-primary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm mb-1">No of milestones</label>
//               <select 
//                 name="numberOfMilestones"
//                 value={formData.numberOfMilestones}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
//               >
//                 {[1, 2, 3, 4, 5].map(num => (
//                   <option key={num} value={num}>{num}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <Button title="Save" />        
//       </div>
//     </form>
//   );
// }