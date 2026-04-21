export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_EN    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getMonday = (date = new Date()) => {
    const d = new Date(date);
    const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const formatDateShort = (d) => {
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth() + 1}`;
};

export const formatDateFull = (d) => {
    const date = new Date(d);
    return `${DAY_FULL[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const formatDateLabel = (date) => {
    return `${DAY_EN[date.getDay()]} - ${date.getDate()}/${date.getMonth() + 1}`;
};
