const fetch = require('node-fetch'); // You might need to install node-fetch or use native fetch if on Node 18+

async function testApi() {
    const url = 'http://localhost:3000/api/get-product-recommendations';
    const body = {
        analysis: {
            skinType: 'oily',
            conditions: [
                { name: 'acne' }
            ],
            recommendations: [
                'Use a salicylic acid cleanser'
            ]
        }
    };

    try {
        console.log('Testing API with payload:', JSON.stringify(body, null, 2));
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
        console.log('Total Products Found:', data.totalFound);
        console.log('Source Breakdown:', data.sourceBreakdown);

        console.log('\nSample Products:');
        data.products.slice(0, 3).forEach(p => {
            console.log(`- [${p.source}] ${p.name} (${p.price || 'No Price'})`);
        });

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testApi();
