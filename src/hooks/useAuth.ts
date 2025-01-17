const useAuth = (): {
    user: any;
    accessToken: string | null;
    isAuthenticated: boolean;
} => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') as any;
    const accessToken = localStorage.getItem('accessToken') || null;

    return { user, accessToken, isAuthenticated: !!user };
};

export default useAuth;
