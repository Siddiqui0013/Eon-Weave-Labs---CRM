import { User } from 'lucide-react';
// import { useNavigate } from 'react-router';
import { useAllUsersQuery } from '@/services/userApi';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  _id: number;
  name: string;
  role: string;
  email: string;
  image: string;
}

const AllEmployees = () => {

  const { data, isLoading } = useAllUsersQuery({});

  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    if (data) {
      setUsers(data.data);
      console.log(data.data);
    }
  }, [data]);

  // const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-semibold">Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-6'>
          <h1 className="text-3xl font-semibold">All Employees</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {users.map((member, index) => (
        <div 
        // onClick={() => {
        //   navigate(`/admin/team/${member._id}`)
        //   console.log(member._id);
        //   } }

        key={index} 
        className="bg-[url('/src/assets/profileBg.png')] flex flex-col py-6 rounded-lg p-4 gap-2 justify-between text-center bg-[#3F3F3F]"
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
          <div className="text-gray-300 text-sm break-words">{member.email}</div>
        </div>
      ))}

    </div>
    </div>

  );
};

export default AllEmployees