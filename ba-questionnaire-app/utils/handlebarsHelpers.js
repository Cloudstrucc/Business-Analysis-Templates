// utils/handlebarsHelpers.js
// Register these helpers in your app.js after setting up Handlebars

module.exports = function(hbs) {
    // Equality check
    hbs.registerHelper('eq', function(a, b) {
        return a === b;
    });
    
    // Not equal
    hbs.registerHelper('neq', function(a, b) {
        return a !== b;
    });
    
    // Greater than
    hbs.registerHelper('gt', function(a, b) {
        return a > b;
    });
    
    // Greater than or equal
    hbs.registerHelper('gte', function(a, b) {
        return a >= b;
    });
    
    // Less than
    hbs.registerHelper('lt', function(a, b) {
        return a < b;
    });
    
    // Less than or equal
    hbs.registerHelper('lte', function(a, b) {
        return a <= b;
    });
    
    // Logical AND
    hbs.registerHelper('and', function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.every(Boolean);
    });
    
    // Logical OR
    hbs.registerHelper('or', function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.some(Boolean);
    });
    
    // Math operations
    hbs.registerHelper('math', function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let result = parseFloat(args[0]) || 0;
        
        for (let i = 1; i < args.length; i += 2) {
            const operator = args[i];
            const operand = parseFloat(args[i + 1]) || 0;
            
            switch (operator) {
                case '+': result += operand; break;
                case '-': result -= operand; break;
                case '*': result *= operand; break;
                case '/': result = operand !== 0 ? result / operand : 0; break;
                case '%': result = operand !== 0 ? result % operand : 0; break;
            }
        }
        
        return result;
    });
    
    // Generate a range of numbers
    hbs.registerHelper('range', function(start, end, options) {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    });
    
    // Slugify a string (for IDs)
    hbs.registerHelper('slugify', function(str) {
        if (!str) return '';
        return str.toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    });
    
    // Truncate text
    hbs.registerHelper('truncate', function(str, length) {
        if (!str) return '';
        str = str.toString();
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });
    
    // JSON stringify for embedding in JS
    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context || {});
    });
    
    // If in array
    hbs.registerHelper('includes', function(array, value) {
        if (!Array.isArray(array)) return false;
        return array.includes(value);
    });
    
    // Default value
    hbs.registerHelper('default', function(value, defaultValue) {
        return value != null ? value : defaultValue;
    });
    
    // Format number with commas
    hbs.registerHelper('formatNumber', function(num) {
        if (num == null) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    
    // Percentage calculation
    hbs.registerHelper('percentage', function(value, total) {
        if (!total) return 0;
        return Math.round((value / total) * 100);
    });
};
