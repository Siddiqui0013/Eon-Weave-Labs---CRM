 interface user {
    _id: string; 
    name: string;
    email: string;
    role: string;
    profileImage: string;
    phone: string;
    address: string;
    cnic: string;
    jobTitle: string;
    createdAt: string;
 }

const useAuth = (): {
    user: user | null;
    accessToken: string | null;
    isAuthenticated: boolean;
} => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') as user;
    const accessToken = localStorage.getItem('accessToken') || null;

    return { user, accessToken, isAuthenticated: !!user };
};

export default useAuth;
