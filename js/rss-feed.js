// RSS Feed Parser for GST News
document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    
    if (newsContainer) {
        // Try to fetch news, but use fallback if it fails
        fetchGSTNews().catch(() => {
            displayFallbackNews();
        });
    }
});

// Function to fetch GST news from multiple sources
async function fetchGSTNews() {
    const newsContainer = document.getElementById('news-container');
    
    try {
        const sources = [
            {
                name: 'TaxGuru',
                url: 'https://api.rss2json.com/v1/api.json?rss_url=https://taxguru.in/category/goods-and-service-tax/feed/'
            },
            {
                name: 'GST Council',
                url: 'https://api.rss2json.com/v1/api.json?rss_url=https://gstcouncil.gov.in/rss.xml'
            },
            {
                name: 'CBIC',
                url: 'https://api.rss2json.com/v1/api.json?rss_url=https://cbic-gst.gov.in/rss-feeds.html'
            }
        ];
        
        // Clear loading message
        newsContainer.innerHTML = '';
        
        // Fetch news from each source
        for (const source of sources) {
            try {
                const response = await fetch(source.url);
                const data = await response.json();
                
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    // Display up to 3 news items from each source
                    const items = data.items.slice(0, 3);
                    
                    for (const item of items) {
                        const newsCard = createNewsCard(item, source.name);
                        newsContainer.appendChild(newsCard);
                    }
                }
            } catch (error) {
                console.error(`Error fetching from ${source.name}:`, error);
            }
        }
        
        // If no news was fetched, show a message
        if (newsContainer.children.length === 0) {
            newsContainer.innerHTML = '<div class="no-news">Unable to load GST news at the moment. Please try again later.</div>';
        }
    } catch (error) {
        console.error('Error fetching GST news:', error);
        // Use fallback news instead of just showing an error message
        displayFallbackNews();
        return Promise.reject(error); // Propagate the error to trigger the fallback in the event listener
    }
}

// Function to create a news card element
function createNewsCard(item, sourceName) {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    
    // Format the publication date
    const pubDate = new Date(item.pubDate);
    const formattedDate = pubDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create a short description (limit to 100 characters)
    let description = item.description || '';
    // Remove HTML tags
    description = description.replace(/<[^>]*>/g, '');
    // Limit to 100 characters
    if (description.length > 100) {
        description = description.substring(0, 100) + '...';
    }
    
    newsCard.innerHTML = `
        <div class="news-content">
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>${description}</p>
            <div class="news-meta">
                <span class="date">${formattedDate}</span>
                <span class="source">Source: ${sourceName}</span>
            </div>
        </div>
    `;
    
    return newsCard;
}

// Fallback function if RSS feeds are not accessible due to CORS
function displayFallbackNews() {
    const newsContainer = document.getElementById('news-container');
    
    if (newsContainer) {
        newsContainer.innerHTML = '';
        
        // Sample news items (to be replaced with actual RSS feed data)
        const fallbackNews = [
            {
                title: 'GST Council Meeting Scheduled for Next Month',
                description: 'The GST Council is set to meet next month to discuss rate rationalization and simplification of return filing process.',
                link: '#',
                date: 'May 15, 2025',
                source: 'GST Council'
            },
            {
                title: 'CBIC Issues Clarification on Input Tax Credit',
                description: 'The Central Board of Indirect Taxes and Customs has issued a circular clarifying the eligibility criteria for claiming input tax credit.',
                link: '#',
                date: 'May 10, 2025',
                source: 'CBIC'
            },
            {
                title: 'New GST Return Forms to be Implemented from July',
                description: 'The government has announced that the new simplified GST return forms will be implemented from July 2025.',
                link: '#',
                date: 'May 5, 2025',
                source: 'TaxGuru'
            },
            {
                title: 'GST Collections Hit Record High in April',
                description: 'GST collections for April 2025 have reached a record high of ₹1.5 lakh crore, indicating economic recovery.',
                link: '#',
                date: 'May 1, 2025',
                source: 'GST Council'
            },
            {
                title: 'E-invoicing Mandatory for Businesses with Turnover Above ₹5 Crore',
                description: 'The government has made e-invoicing mandatory for businesses with annual turnover exceeding ₹5 crore from October 2025.',
                link: '#',
                date: 'April 28, 2025',
                source: 'CBIC'
            },
            {
                title: 'GST Audit Guidelines Updated for FY 2024-25',
                description: 'The CBIC has released updated guidelines for GST audit for the financial year 2024-25.',
                link: '#',
                date: 'April 25, 2025',
                source: 'TaxGuru'
            }
        ];
        
        // Create news cards for fallback news
        fallbackNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            newsCard.innerHTML = `
                <div class="news-content">
                    <h3><a href="${news.link}">${news.title}</a></h3>
                    <p>${news.description}</p>
                    <div class="news-meta">
                        <span class="date">${news.date}</span>
                        <span class="source">Source: ${news.source}</span>
                    </div>
                </div>
            `;
            
            newsContainer.appendChild(newsCard);
        });
    }
}

// The fallback is now handled directly in the fetchGSTNews function
// No need for additional timeout checks