

import { compileRegex, highlight } from './search.js';


export function renderRecords(records, container, filterQuery, caseInsensitive, unitPref) {
  container.innerHTML = '';

  if (records.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">No tasks or events found.</td></tr>`;
    return;
  }

  const regex = compileRegex(filterQuery, caseInsensitive ? 'i' : '');

  records.forEach(record => {
    const tr = document.createElement('tr');

   
    let durationDisplay = `${record.duration} mins`;
    if (unitPref === 'hours') {
      const hours = (record.duration / 60).toFixed(1);
      durationDisplay = `${hours} hrs`;
    }


    const highlightedTitle = highlight(record.title, regex);
    const highlightedTag = highlight(record.tag, regex);

    tr.innerHTML = `
      <td>${highlightedTitle}</td>
      <td>${record.dueDate}</td>
      <td>${durationDisplay}</td>
      <td><span class="badge">${highlightedTag}</span></td>
      <td>
        <button class="btn-action edit-btn" data-id="${record.id}" aria-label="Edit ${record.title}">Edit</button>
        <button class="btn-action delete-btn" data-id="${record.id}" aria-label="Delete ${record.title}">Delete</button>
      </td>
    `;
    container.appendChild(tr);
  });
}

// Update dashboard metrics and charts
export function updateDashboard(records, unitPref, weeklyCapHours) {
  const totalTasks = records.length;
  
  // Total duration calculation
  const totalMinutes = records.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalDisplay = unitPref === 'hours' ? `${(totalMinutes / 60).toFixed(1)} hrs` : `${totalMinutes} mins`;

  // Top Tag calculation
  const tagCounts = records.reduce((acc, curr) => {
    acc[curr.tag] = (acc[curr.tag] || 0) + 1;
    return acc;
  }, {});
  
  let topTag = 'None';
  let maxCount = 0;
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topTag = tag;
    }
  }

  // Update DOM elements
  document.getElementById('stat-total').textContent = totalTasks;
  document.getElementById('stat-duration').textContent = totalDisplay;
  document.getElementById('stat-top-tag').textContent = topTag;

  // Cap / Target Logic & ARIA Live updates
  const totalHours = totalMinutes / 60;
  const remainingOrOverage = weeklyCapHours - totalHours;
  const capStatusEl = document.getElementById('cap-status-message');
  const announcerEl = document.getElementById('sr-announcer');

  let statusMessage = '';
  let ariaPoliteness = 'polite';

  if (totalHours <= weeklyCapHours) {
    statusMessage = `Under weekly cap by ${remainingOrOverage.toFixed(1)} hours. (${totalHours.toFixed(1)} / ${weeklyCapHours} hrs used)`;
    capStatusEl.style.color = 'var(--success)';
  } else {
    statusMessage = `Warning: Weekly cap exceeded by ${Math.abs(remainingOrOverage).toFixed(1)} hours!`;
    capStatusEl.style.color = 'var(--danger)';
    ariaPoliteness = 'assertive';
  }

  capStatusEl.textContent = statusMessage;
  announcerEl.setAttribute('aria-live', ariaPoliteness);
  announcerEl.textContent = statusMessage;

  // Simple 7-day trend calculation & display
  renderTrendChart(records);
}

// Render a lightweight 7-day trend bar representation
function renderTrendChart(records) {
  const chartContainer = document.getElementById('trend-chart');
  chartContainer.innerHTML = '';

  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7Days.push({ date: dateStr, count: 0 });
  }

  records.forEach(record => {
    const dayEntry = last7Days.find(d => d.date === record.dueDate);
    if (dayEntry) {
      dayEntry.count++;
    }
  });

  last7Days.forEach(day => {
    const barWrapper = document.createElement('div');
    barWrapper.className = 'chart-bar-wrapper';
    
    const heightPercent = Math.min(day.count * 25, 100); // Scale bar height
    barWrapper.innerHTML = `
      <div class="chart-bar" style="height: ${Math.max(heightPercent, 10)}%;">
        <span class="tooltip">${day.count} tasks</span>
      </div>
      <span class="chart-label">${day.date.slice(5)}</span>
    `;
    chartContainer.appendChild(barWrapper);
  });
}