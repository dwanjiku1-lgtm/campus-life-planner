const STORAGE_KEY = 'campus_planner_data';

//Load records from localstorage
export const loadRecords = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("failed to load records from localstorage:", error);
        return [];
    }

};

//save record to local storage
export const saveRecords = (records) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
        console.error("failed to save records to localStorage.", error);
    }
};

//Validate imported JSON structure
export const validateImportData = (data) => {
    if (!Array.isArray(data)) return false;

    //check if every time has the required core properties
    return data.every(item =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.dueDate === 'string' &&
        typeof item.duration === 'number' &&
        typeof item.tag === 'string' 
    );
};