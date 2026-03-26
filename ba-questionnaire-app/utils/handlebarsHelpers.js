// utils/handlebarsHelpers.js
// Custom Handlebars helpers for BA Forms app

module.exports = function(hbs) {
    
    // =====================================================
    // COMPARISON HELPERS
    // =====================================================
    
    // Equal
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
    
    // =====================================================
    // LOGICAL HELPERS
    // =====================================================
    
    // AND - returns true if all arguments are truthy
    hbs.registerHelper('and', function(...args) {
        args.pop();
        return args.every(Boolean);
    });
    
    // OR - returns true if any argument is truthy
    hbs.registerHelper('or', function(...args) {
        args.pop();
        return args.some(Boolean);
    });
    
    // NOT
    hbs.registerHelper('not', function(value) {
        return !value;
    });
    
    // =====================================================
    // MATH HELPERS
    // =====================================================
    
    // Math operations: {{math a '+' b}}
    hbs.registerHelper('math', function(a, operator, b) {
        a = parseFloat(a) || 0;
        b = parseFloat(b) || 0;
        
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 0;
            case '%': return a % b;
            default: return a;
        }
    });
    
    // Increment
    hbs.registerHelper('inc', function(value) {
        return parseInt(value) + 1;
    });
    
    // Decrement
    hbs.registerHelper('dec', function(value) {
        return parseInt(value) - 1;
    });
    
    // =====================================================
    // ARRAY/RANGE HELPERS
    // =====================================================
    
    // Generate a range of numbers
    hbs.registerHelper('range', function(start, end) {
        const result = [];
        start = parseInt(start) || 0;
        end = parseInt(end) || 0;
        
        if (start <= end) {
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
        } else {
            for (let i = start; i >= end; i--) {
                result.push(i);
            }
        }
        return result;
    });
    
    // Check if array includes a value
    hbs.registerHelper('includes', function(array, value) {
        if (!Array.isArray(array)) return false;
        return array.includes(value);
    });
    
    // Get array length
    hbs.registerHelper('length', function(array) {
        if (!array) return 0;
        return array.length || 0;
    });
    
    // =====================================================
    // STRING HELPERS
    // =====================================================
    
    // Slugify
    hbs.registerHelper('slugify', function(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    });
    
    // Truncate text
    hbs.registerHelper('truncate', function(str, length) {
        if (!str) return '';
        str = String(str);
        length = parseInt(length) || 50;
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });
    
    // Lowercase
    hbs.registerHelper('lowercase', function(str) {
        if (!str) return '';
        return String(str).toLowerCase();
    });
    
    // Uppercase
    hbs.registerHelper('uppercase', function(str) {
        if (!str) return '';
        return String(str).toUpperCase();
    });
    
    // Capitalize
    hbs.registerHelper('capitalize', function(str) {
        if (!str) return '';
        str = String(str);
        return str.charAt(0).toUpperCase() + str.slice(1);
    });
    
    // =====================================================
    // JSON HELPERS
    // =====================================================
    
    hbs.registerHelper('json', function(obj) {
        return JSON.stringify(obj || {});
    });
    
    hbs.registerHelper('jsonPretty', function(obj) {
        return JSON.stringify(obj || {}, null, 2);
    });
    
    // =====================================================
    // NUMBER FORMATTING HELPERS
    // =====================================================
    
    hbs.registerHelper('formatNumber', function(num) {
        if (num === null || num === undefined) return '0';
        return Number(num).toLocaleString();
    });
    
    hbs.registerHelper('percentage', function(value, total) {
        value = parseFloat(value) || 0;
        total = parseFloat(total) || 0;
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    });
    
    // =====================================================
    // DEFAULT/FALLBACK HELPERS
    // =====================================================
    
    hbs.registerHelper('default', function(value, defaultValue) {
        return value || defaultValue;
    });
    
    hbs.registerHelper('coalesce', function(...args) {
        args.pop();
        for (const arg of args) {
            if (arg) return arg;
        }
        return '';
    });
    
    // =====================================================
    // CONDITIONAL BLOCK HELPERS
    // =====================================================
    
    hbs.registerHelper('ifEq', function(a, b, options) {
        if (a === b) return options.fn(this);
        return options.inverse(this);
    });
    
    hbs.registerHelper('ifNeq', function(a, b, options) {
        if (a !== b) return options.fn(this);
        return options.inverse(this);
    });
    
    hbs.registerHelper('ifGt', function(a, b, options) {
        if (a > b) return options.fn(this);
        return options.inverse(this);
    });
    
    hbs.registerHelper('ifLt', function(a, b, options) {
        if (a < b) return options.fn(this);
        return options.inverse(this);
    });
    
    hbs.registerHelper('unlessEq', function(a, b, options) {
        if (a !== b) return options.fn(this);
        return options.inverse(this);
    });
    
    // =====================================================
    // DATE HELPERS
    // =====================================================
    
    hbs.registerHelper('formatDate', function(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    });
    
    hbs.registerHelper('timeAgo', function(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const seconds = Math.floor((new Date() - d) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    });
    
    // =====================================================
    // STATUS/BADGE HELPERS
    // =====================================================
    
    hbs.registerHelper('statusClass', function(status) {
        const classes = {
            'met': 'bg-success',
            'not-met': 'bg-danger',
            'pending': 'bg-secondary',
            'yes': 'bg-success',
            'no': 'bg-danger',
            'completed': 'bg-success',
            'in_progress': 'bg-warning',
            'draft': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    });
    
    hbs.registerHelper('statusIcon', function(status) {
        const icons = {
            'met': 'bi-check-circle-fill',
            'not-met': 'bi-x-circle-fill',
            'pending': 'bi-circle',
            'yes': 'bi-check-lg',
            'no': 'bi-x-lg'
        };
        return icons[status] || 'bi-circle';
    });
    
    // =====================================================
    // CATEGORY ICON HELPER
    // =====================================================
    
    hbs.registerHelper('categoryIcon', function(category) {
        const icons = {
            'Security': 'bi-shield-lock',
            'Performance': 'bi-speedometer2',
            'Integration': 'bi-plug',
            'Compliance': 'bi-clipboard-check',
            'UI/UX': 'bi-palette',
            'Data Management': 'bi-database',
            'Reporting': 'bi-bar-chart',
            'User Management': 'bi-people',
            'Notifications': 'bi-bell',
            'Document Management': 'bi-file-earmark-text',
            'General': 'bi-list-check'
        };
        return icons[category] || 'bi-list-check';
    });
    
    // =====================================================
    // SELECTED/ACTIVE HELPERS
    // =====================================================
    
    hbs.registerHelper('selected', function(a, b) {
        return a === b ? 'selected' : '';
    });
    
    hbs.registerHelper('active', function(a, b) {
        return a === b ? 'active' : '';
    });
    
    hbs.registerHelper('checked', function(value) {
        return value ? 'checked' : '';
    });
    
    hbs.registerHelper('disabled', function(value) {
        return value ? 'disabled' : '';
    });

};
