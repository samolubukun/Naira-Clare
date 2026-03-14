const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateStatement() {
    console.log("📄 Generating realistic Bank Statement PDF...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlContent = `
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #008751; padding-bottom: 10px; margin-bottom: 20px; }
            .bank-name { font-size: 24px; font-weight: bold; color: #008751; }
            .account-info { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px; background: #f9f9f9; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            .amount { text-align: right; }
            .credit { color: green; }
            .debit { color: red; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="bank-name">Zenith Bank PLC</div>
            <div>Nigeria's Premier Financial Institution</div>
        </div>
        <div class="account-info">
            <p><strong>Account Holder:</strong> Samuel Olubukun</p>
            <p><strong>Account Number:</strong> 1029384756</p>
            <p><strong>Statement Period:</strong> 01-Mar-2026 to 14-Mar-2026</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th class="amount">Amount (₦)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01-Mar-2026</td>
                    <td>FIVERR/REVENUE/WEB-DEV</td>
                    <td class="credit">CR</td>
                    <td class="amount">450,000.00</td>
                </tr>
                <tr>
                    <td>03-Mar-2026</td>
                    <td>IKEJA ELECTRIC - BILL PAYMENT</td>
                    <td class="debit">DR</td>
                    <td class="amount">15,000.00</td>
                </tr>
                <tr>
                    <td>05-Mar-2026</td>
                    <td>MTN DATA TOP-UP</td>
                    <td class="debit">DR</td>
                    <td class="amount">5,000.00</td>
                </tr>
                <tr>
                    <td>08-Mar-2026</td>
                    <td>UPWORK/ESCROW/UI-DESIGN</td>
                    <td class="credit">CR</td>
                    <td class="amount">820,000.00</td>
                </tr>
                <tr>
                    <td>10-Mar-2026</td>
                    <td>CHOWDECK/LUNCH</td>
                    <td class="debit">DR</td>
                    <td class="amount">8,500.00</td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `;

    await page.setContent(htmlContent);
    const pdfPath = path.resolve(__dirname, 'test_statement.pdf');
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();
    console.log(`✅ PDF Generated at: ${pdfPath}`);
}

generateStatement().catch(console.error);
