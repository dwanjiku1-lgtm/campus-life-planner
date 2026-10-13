import { loadRecords, saveRecords } from './storage.js';

class AppState {
    constructor() {
        this.records = loadRecords();
        this.filterQuery = '';
        this.caseInsensitive = true;
        this.sortBy = 'date-asc';
        this.unitPreference = 'mins';
        this.weeklyCapHours = 20;
        this.editingId = null;
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback(this));
    }

    setRecords(newRecords) {
        this.records = newRecords;
        saveRecords(this.records);
        this.notify();
    }

    addRecord(recordData) {
        const newRecords = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            ...recordData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.records.unshift(newRecords);
        saveRecords(this.records);
        this.notify();
    }


    updateRecord(id, updatedData) {
        this.records = this.records.map(record => {
            if (record.id === id) {
                return {
                    ...record,
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                };
            }
            return record;
        });

        saveRecords(this.records);
        this.notify();
    }

    deleteRecord(id) {
        this.records = this.records.filter(record => record.id !== id);
        saveRecords(this.records);
        this.notify();
    }

    setFilterQuery(query, caseInsensitive) {
        this.filterQuery = query;
        this.caseInsensitive = caseInsensitive;
        this.notify();
    }

    setSortBy(sortCriteria) {
        this.sortBy = sortCriteria;
        this.notify();
    }

    setUnitPreference(pref) {
        this.unitPreference = pref;
        this.notify();
    }

    setWeeklyCap(cap) {
        this.weeklyCapHours = parseFloat(cap) || 0;
        this.notify();
    }

}

export const state = new AppState();