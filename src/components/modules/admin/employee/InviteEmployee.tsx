import { X } from 'lucide-react';
import {InviteForm} from './InviteForm';

interface InviteEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteEmployee = ({ isOpen, onClose }: InviteEmployeeProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 rounded-3xl z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute right-4 top-8 text-gray-400 hover:text-white z-10"
        >
          <X size={24} />
        </button>
        <InviteForm />
      </div>
    </div>
  );
};

export default InviteEmployee;