import { User } from 'lucide-react';
import { useNavigate } from 'react-router';

const Team = () => {

  const navigate = useNavigate();
  const staffMembers = [
    {
      _id : 1,
      name: "John Smith",
      role: "CEO",
      email: "john.smith@company.com",
      image : null
    },
    {
      _id : 2,
      name: "Sarah Johnson",
      role: "CTO",
      email: "sarah.j@company.com",
      image : null
    }
  ];

  return (
    <div className='p-4 space-y-6'>
          <h1 className="text-3xl font-semibold">Team</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {staffMembers.map((member, index) => (
        <div 
        onClick={() => {
          navigate(`/hr/team/${member._id}`)
          console.log(member._id);
          } }

        key={index} 
        className="bg-[url('/src/assets/profileBg.png')] py-6 rounded-lg p-4 text-center bg-[#3F3F3F]"
        >
          <div className="flex justify-center mb-3">
            {member?.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <h3 className="text-white text-xl font-medium mb-1">{member.name}</h3>
          <p className="text-gray-300 text-md mb-1">{member.role}</p>
          <p className="text-gray-300 text-sm">{member.email}</p>
        </div>
      ))}

    </div>
    </div>

  );
};

export default Team