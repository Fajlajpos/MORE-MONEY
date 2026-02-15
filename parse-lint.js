const fs = require('fs');
try {
    const report = JSON.parse(fs.readFileSync('lint-report.json', 'utf8'));
    report.forEach(f => {
        const errors = f.messages.filter(m => m.severity === 2);
        if (errors.length > 0) {
            const path = require('path');
            errors.forEach(m => {
                console.log(`${path.basename(path.dirname(f.filePath))}/${path.basename(f.filePath)}:${m.line}:${m.column} ${m.message} (${m.ruleId})`);
            });
        }
    });
} catch (e) {
    console.error('Error parsing report:', e);
}
