// Backend API base URL
const API_BASE_URL = 'http://localhost:3003/api';

// Fetch and update dashboard stats
async function updateDashboardStats() {
    try {
        const episodesRes = await fetch(`${API_BASE_URL}/episodes`);
        const episodes = await episodesRes.json();
        const seriesRes = await fetch(`${API_BASE_URL}/series`);
        const series = await seriesRes.json();

        const totalEpisodes = document.querySelector('.stat-card:nth-child(1) .text-3xl');
        if (totalEpisodes) {
            totalEpisodes.textContent = episodes.length;
        }

        const activeSeries = document.querySelector('.stat-card:nth-child(2) .text-3xl');
        if (activeSeries) {
            activeSeries.textContent = series.length;
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

// Fetch and update latest episodes table
async function updateLatestEpisodes() {
    try {
        const episodesRes = await fetch(`${API_BASE_URL}/episodes`);
        const episodes = await episodesRes.json();

        const tableBody = document.querySelector('.admin-table tbody');
        if (tableBody) {
            const sortedEpisodes = episodes.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            tableBody.innerHTML = sortedEpisodes.map(episode => {
                const addedDate = new Date(episode.date);
                const formattedDate = addedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <tr class="border-b border-gray-700" data-episode-id="${episode.id}">
                        <td class="py-3">
                            <div class="flex flex-col">
                                <span class="font-medium">${episode.title}</span>
                                <span class="text-xs text-gray-400">Added ${formattedDate}</span>
                            </div>
                        </td>
                        <td>${episode.episode}</td>
                        <td><span class="status-badge ${episode.status}">${episode.status}</span></td>
                        <td>
                            <button class="action-btn text-blue-400 hover:text-blue-300 mr-2" data-action="edit" data-tooltip="Edit episode">Edit</button>
                            <button class="action-btn text-red-400 hover:text-red-300" data-action="delete" data-tooltip="Delete episode">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');

            // Add event listeners for delete buttons
            document.querySelectorAll('[data-action="delete"]').forEach(button => {
                button.addEventListener('click', async function() {
                    const row = this.closest('tr');
                    const episodeId = parseInt(row.dataset.episodeId);
                    if (confirm('Are you sure you want to delete this episode?')) {
                        try {
                            await fetch(`${API_BASE_URL}/episodes/${episodeId}`, { method: 'DELETE' });
                            updateLatestEpisodes();
                            updateDashboardStats();
                        } catch (error) {
                            console.error('Error deleting episode:', error);
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error fetching latest episodes:', error);
    }
}

// Populate series dropdown in new episode form
async function populateSeriesDropdown() {
    const seriesSelect = document.getElementById('series');
    if (seriesSelect) {
        try {
            const seriesRes = await fetch(`${API_BASE_URL}/series`);
            const series = await seriesRes.json();
            const options = series.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
            seriesSelect.innerHTML = '<option value="">Select Series</option>' + options;
        } catch (error) {
            console.error('Error fetching series:', error);
        }
    }
}

// Handle new series form submission
if (document.getElementById('newSeriesForm')) {
    document.getElementById('newSeriesForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const genres = Array.from(this.querySelectorAll('input[name="genres[]"]:checked')).map(input => input.value);
        const newSeries = {
            title: this.title.value,
            status: this.status.value,
            episodes: 0,
            genres: genres,
            date: new Date().toISOString()
        };
        try {
            const res = await fetch(`${API_BASE_URL}/series`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSeries)
            });
            if (res.ok) {
                alert('Series added successfully!');
                window.location.href = '/admin/';
            } else {
                alert('Failed to add series.');
            }
        } catch (error) {
            console.error('Error adding series:', error);
        }
    });
}

// Handle new episode form submission
if (document.getElementById('newEpisodeForm')) {
    populateSeriesDropdown();
    document.getElementById('newEpisodeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newEpisode = {
            title: this.series.options[this.series.selectedIndex].text,
            episode: this.episodeNumber.value,
            episodeTitle: this.episodeTitle.value,
            status: this.status.value,
            date: new Date().toISOString()
        };
        try {
            const res = await fetch(`${API_BASE_URL}/episodes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEpisode)
            });
            if (res.ok) {
                alert('Episode added successfully!');
                window.location.href = '/admin/';
            } else {
                alert('Failed to add episode.');
            }
        } catch (error) {
            console.error('Error adding episode:', error);
        }
    });
}

// Initialize dashboard if we're on the admin page
if (window.location.pathname === '/admin/' || window.location.pathname === '/admin/index.html') {
    updateDashboardStats();
    updateLatestEpisodes();
}

// Initialize tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip bg-gray-900 text-white text-sm px-2 py-1 rounded absolute z-50';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        });
        element.addEventListener('mouseleave', () => {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(t => t.remove());
        });
    });
}
document.addEventListener('DOMContentLoaded', initializeTooltips);
