const useTheme = () => {
    const theme = localStorage.getItem('theme') || '';

    return { theme };
}

export default useTheme