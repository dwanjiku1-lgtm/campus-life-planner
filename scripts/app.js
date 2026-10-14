import { state } from './state.js';
import { renderRecords, updateDashboard } from './ui.js';
import { validateImportData } from './storage.js';
import {
    validateTitle,
    validateDuration,
    validateDate,
    validateTag,
    validateNoDuplicateWords
}from './validators.js';

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const recordsTbody = document.getElementById('records-tbody');
  const searchInput = document.getElementById('search-input');
  const toggleCaseBtn = document.getElementById('toggle-case');
  const sortSelect = document.getElementById('sort-select');
  const taskForm = document.getElementById('task-form');
  const formHeading = document.getElementById('form-heading');
  const taskIdInput = document.getElementById('task-id');
  const titleInput = document.getElementById('title');
  const dueDateInput = document.getElementById('dueDate');
  const durationInput = document.getElementById('duration');
  const tagInput = document.getElementById('tag');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const unitPrefSelect = document.getElementById('unit-preference');
  const weeklyCapInput = document.getElementById('weekly-cap');
  const exportBtn = document.getElementById('export-btn');
  const importFile = document.getElementById('import-file');


  //if local storage is empty on first laod, fetch seed.json
  if (state.records.length === 0) {
    try {
        const response = await fetch('seed.json');
        if (response.ok) {
            const seedData = await response.json();
            state.setRecords(seedData);
        }
    } catch (error) {
        console.warn("could not load seed.json automatically:", error);
    }
  }


  function updateView(currentState) {
    let processedRecords = [...currentState.records];


    if (currentState.filterQuery) {
        try {
            const flags = currentState.caseInsensitive ? 'i' : '';
            const re = new RegExp(currentState.filterQuery, flags);
            processedRecords = processedRecords.filter(r =>
                re.test(r.title) || re.test(r.tag) || re.test(r.dueData)
            );
        } catch (err) {

        }
    }

    processedRecords.sort((a, b) => {
      if (currentState.sortBy === 'date-asc') return new Date(a.dueDate) - new Date(b.dueDate);
      if (currentState.sortBy === 'date-desc') return new Date(b.dueDate) - new Date(a.dueDate);
      if (currentState.sortBy === 'title-az') return a.title.localeCompare(b.title);
      if (currentState.sortBy === 'duration-desc') return b.duration - a.duration;
      if (currentState.sortBy === 'duration-asc') return a.duration - b.duration;
      return 0;  
    });


    renderRecords(
        processedRecords,
        recordsTbody,
        currentState.filterQuery,
        currentState.caseInsensitive,
        currentState.unitPreference
    );
    updateDashboard(currentState.records, currentState.unitPreference, currentState.weeklyCapHours);

  }

  state.subscribe(updateView);


  updateView(state);


  searchInput.addEventListener('input', (e) => {
    state.setFilterQuery(e.target.value, state.caseInsensitive);
  });

  toggleCaseBtn.addEventListener('click', () => {
    state.caseInsensitive = !state.caseInsensitive;
    toggleCaseBtn.setAttribute('aria-pressed', !state.caseInsensitive);
    toggleCaseBtn.style.backgroundColor = state.caseInsensitive ? '#e5e7eb' : '#bfdbfe';
    state.setFilterQuery(searchInput.value, state.caseInsensitive);
  });

  sortSelect.addEventListener('change', (e) => {
    state.setSortBy(e.target.value);
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value.trim();
    const duration = durationInput.value.trim();
    const tag = tagInput.value.trim();

    // Run Validation Checks
    let isValid = true;

    // Title validation
    const titleError = document.getElementById('title-error');
    if (!validateTitle(title) || !validateNoDuplicateWords(title)) {
      titleError.textContent = "Invalid title: forbid leading/trailing spaces and duplicate words.";
      isValid = false;
    } else {
      titleError.textContent = "";
    }

    // Date validation
    const dateError = document.getElementById('date-error');
    if (!validateDate(dueDate)) {
      dateError.textContent = "Invalid date format (Use YYYY-MM-DD).";
      isValid = false;
    } else {
      dateError.textContent = "";
    }

    // Duration validation
    const durationError = document.getElementById('duration-error');
    if (!validateDuration(duration)) {
      durationError.textContent = "Invalid duration (must be a positive number).";
      isValid = false;
    } else {
      durationError.textContent = "";
    }

    // Tag validation
    const tagError = document.getElementById('tag-error');
    if (!validateTag(tag)) {
      tagError.textContent = "Invalid tag (letters, numbers, spaces, and hyphens only).";
      isValid = false;
    } else {
      tagError.textContent = "";
    }

    if (!isValid) return;

    const recordPayload = {
      title,
      dueDate,
      duration: parseFloat(duration),
      tag
    };

    const editingId = taskIdInput.value;
    if (editingId) {
      state.updateRecord(editingId, recordPayload);
      formHeading.textContent = "Add New Task / Event";
      submitBtn.textContent = "Save Task";
      cancelBtn.style.display = "none";
    } else {
      state.addRecord(recordPayload);
    }

    taskForm.reset();
    taskIdInput.value = "";

  });
   cancelBtn.addEventListener('click', () => {
    taskForm.reset();
    taskIdInput.value = "";
    formHeading.textContent = "Add New Task / Event";
    submitBtn.textContent = "Save Task";
    cancelBtn.style.display = "none";
  });

  // --- Event Listeners: Table Actions (Edit & Delete Delegation) ---
  recordsTbody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('delete-btn')) {
      if (confirm("Are you sure you want to delete this record?")) {
        state.deleteRecord(id);
      }
    } else if (target.classList.contains('edit-btn')) {
      const record = state.records.find(r => r.id === id);
      if (record) {
        taskIdInput.value = record.id;
        titleInput.value = record.title;
        dueDateInput.value = record.dueDate;
        durationInput.value = record.duration;
        tagInput.value = record.tag;

        formHeading.textContent = "Edit Task / Event";
        submitBtn.textContent = "Update Task";
        cancelBtn.style.display = "inline-block";

        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
        titleInput.focus();
      }
    }
  });

  //  Event Listeners: 
  unitPrefSelect.addEventListener('change', (e) => {
    state.setUnitPreference(e.target.value);
  });

  weeklyCapInput.addEventListener('input', (e) => {
    state.setWeeklyCap(e.target.value);
  });

  // --- Event Listeners: JSON Export & Import ---
  exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `campus_planner_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (validateImportData(importedData)) {
          state.setRecords(importedData);
          alert("Data successfully imported!");
        } else {
          alert("Error: Imported JSON structure is invalid.");
        }
      } catch (err) {
        alert("Error parsing JSON file.");
      }
      importFile.value = "";
    };
    reader.readAsText(file);
  });
});




