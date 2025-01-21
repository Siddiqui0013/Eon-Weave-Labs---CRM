export const formatDate = (date: Date | string | number, format: string = 'dd/mm/yyyy'): string => {
    if (!date) return '';

    try {
        const dateObject = new Date(date);

        if (isNaN(dateObject.getTime())) {
            return '';
        }

        const day = dateObject.getDate().toString().padStart(2, '0');
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObject.getFullYear();

        const separator = format.includes('/') ? '/' : '-';

        return `${day}${separator}${month}${separator}${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const formatDateWithTime = (date: Date | string | number, includeTime: boolean = false): string => {
    if (!date) return '';

    try {
        const dateObject = new Date(date);

        if (isNaN(dateObject.getTime())) {
            return '';
        }

        const day = dateObject.getDate().toString().padStart(2, '0');
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObject.getFullYear();

        if (!includeTime) {
            return `${day}/${month}/${year}`;
        }

        const hours = dateObject.getHours().toString().padStart(2, '0');
        const minutes = dateObject.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const getRelativeTime = (date: Date | string | number): string => {
    if (!date) return '';

    try {
        const dateObject = new Date(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);

        // Array of time intervals in seconds and their corresponding units
        const intervals = [
            { seconds: 31536000, unit: 'year' },
            { seconds: 2592000, unit: 'month' },
            { seconds: 86400, unit: 'day' },
            { seconds: 3600, unit: 'hour' },
            { seconds: 60, unit: 'minute' },
            { seconds: 1, unit: 'second' }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const count = Math.floor(diffInSeconds / interval.seconds);

            if (count >= 1) {
                return `${count} ${interval.unit}${count > 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    } catch (error) {
        console.error('Error calculating relative time:', error);
        return '';
    }
};
