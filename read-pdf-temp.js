const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
    const dataBuffer = fs.readFileSync('C:\\Users\\Francisco\\Downloads\\Relatório de Lotes.pdf');
    const uint8 = new Uint8Array(dataBuffer);
    const parser = new PDFParse(uint8);
    const result = await parser.getText();
    // Write the full text to a file for analysis
    fs.writeFileSync('C:\\tmp\\pdf-output.txt', result.text, 'utf-8');
    console.log('Written to C:\\tmp\\pdf-output.txt');
    console.log('Pages:', result.total);
}

main().catch(console.error);
