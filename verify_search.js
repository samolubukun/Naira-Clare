const fetch = require('node-fetch');

async function testSearchApi() {
    const url = 'http://localhost:3000/api/search-products';
    const body = {
        productName: 'cleanser'
    };

    try {
        console.log('Testing Search API with payload:', JSON.stringify(body, null, 2));
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json();
        console.log('API Success!');
        console.log('Total Products Returned:', data.products.length);

        const sources = {};
        data.products.forEach(p => {
            sources[p.source] = (sources[p.source] || 0) + 1;
        });
        console.log('Source Breakdown:', sources);

        console.log('\nSample Products:');
        data.products.slice(0, 5).forEach(p => {
            console.log(`- [${p.source}] ${p.name}`);
            console.log(`  Link: ${p.url}`);
            console.log(`  Image: ${p.image || 'None'}`);
        });

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testSearchApi();
