 interface user {
    id: number; 
    name: string;
    email: string;
    role: string;
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
