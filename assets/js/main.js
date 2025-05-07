// DOM Elements
const mobileMenuButton = document.querySelector('button.md\\:hidden');
const mobileMenu = document.querySelector('.fixed.inset-0.z-40');
const popularTabs = document.querySelectorAll('.flex.space-x-4 button');

// Mobile Menu Toggle
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Popular Donghua Tabs
popularTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active state from all tabs
        popularTabs.forEach(t => {
            t.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400');
            t.classList.add('text-gray-400');
        });
        
        // Add active state to clicked tab
        tab.classList.remove('text-gray-400');
        tab.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
        
        // Load the corresponding content
        loadPopularContent(tab.textContent.toLowerCase());
    });
});

// Function to load popular content based on selected tab
function loadPopularContent(period) {
    const popularContent = document.querySelector('.space-y-4');
    
    // Show loading state
    popularContent.innerHTML = '<div class="loading text-center py-8">Loading...</div>';
    
    // Simulate content loading (replace with actual API call if needed)
    setTimeout(() => {
        let content = '';
        
        // Sample data - replace with actual data from your backend
        const episodes = [
            {
                title: 'Martial Master',
                episode: '544',
                rating: '7.16',
                genres: ['Action', 'Adventure', 'Fantasy']
            },
            {
                title: 'Spirit Sword Sovereign',
                episode: '493',
                rating: '7.99',
                genres: ['Action', 'Fantasy', 'Martial Arts']
            },
            {
                title: 'Tales of Herding Gods',
                episode: '29',
                rating: '8.2',
                genres: ['Action', 'Adventure', 'Fantasy']
            }
        ];
        
        episodes.forEach(ep => {
            content += `
                <div class="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                    <div class="flex-shrink-0 w-16 h-24 bg-gray-600 rounded overflow-hidden">
                        <div class="w-full h-full bg-gray-500"></div>
                    </div>
                    <div class="flex-grow">
                        <h3 class="font-semibold">${ep.title}</h3>
                        <p class="text-sm text-gray-400">Episode ${ep.episode}</p>
                        <p class="text-sm text-gray-400">${ep.genres.join(', ')}</p>
                        <div class="mt-1">
                            <span class="text-yellow-400">★</span>
                            <span class="text-sm">${ep.rating}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        popularContent.innerHTML = content;
    }, 500);
}

// Load initial content
document.addEventListener('DOMContentLoaded', () => {
    loadPopularContent('weekly');
});

// Image error handling
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.src = 'assets/images/fallback.jpg';
    }
}, true);
