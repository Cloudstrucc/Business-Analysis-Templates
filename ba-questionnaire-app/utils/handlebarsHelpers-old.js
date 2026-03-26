// utils/handlebarsHelpers.js
// Handlebars helpers for the BA Forms application
// Add these helpers to your app.js or wherever you configure Handlebars

const Handlebars = require('handlebars');

/**
 * Register all custom Handlebars helpers
 * @param {object} hbs - The express-handlebars instance
 */
function registerHelpers(hbs) {
    const helpers = {
        // Check if string starts with a prefix
        startsWith: function(str, prefix) {
            if (typeof str !== 'string') return false;
            return str.startsWith(prefix);
        },

        // Check equality
        eq: function(a, b) {
            return a === b;
        },

        // Check not equal
        neq: function(a, b) {
            return a !== b;
        },

        // Check if value is boolean
        isBoolean: function(value) {
            return typeof value === 'boolean' || 
                   value === 'true' || 
                   value === 'false' ||
                   value === 'yes' ||
                   value === 'no' ||
                   value === 'Yes' ||
                   value === 'No';
        },

        // Check if value is an object
        isObject: function(value) {
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        },

        // Check if value is an array
        isArray: function(value) {
            return Array.isArray(value);
        },

        // Convert object to JSON string
        json: function(value) {
            try {
                return JSON.stringify(value, null, 2);
            } catch (e) {
                return String(value);
            }
        },

        // Format date
        formatDate: function(date) {
            if (!date) return 'N/A';
            try {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                return String(date);
            }
        },

        // Format field label (convert field_name to Field Name)
        formatFieldLabel: function(key) {
            if (!key) return '';
            return key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace(/\s+/g, ' ')
                .trim();
        },

        // Lookup helper for nested object access
        lookup: function(obj, key) {
            if (!obj || !key) return undefined;
            return obj[key];
        },

        // Conditional helper - if greater than
        ifGt: function(a, b, options) {
            if (a > b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },

        // Conditional helper - if less than
        ifLt: function(a, b, options) {
            if (a < b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },

        // Truncate string
        truncate: function(str, length) {
            if (!str) return '';
            if (str.length <= length) return str;
            return str.substring(0, length) + '...';
        },

        // Pluralize
        pluralize: function(count, singular, plural) {
            return count === 1 ? singular : (plural || singular + 's');
        },

        // Safe string (for HTML content)
        safeString: function(str) {
            return new Handlebars.SafeString(str || '');
        },

        // Increment value
        inc: function(value) {
            return parseInt(value) + 1;
        },

        // Decrement value
        dec: function(value) {
            return parseInt(value) - 1;
        },

        // Check if array contains value
        contains: function(array, value) {
            if (!Array.isArray(array)) return false;
            return array.includes(value);
        },

        // Get array length
        length: function(array) {
            if (!array) return 0;
            if (Array.isArray(array)) return array.length;
            if (typeof array === 'object') return Object.keys(array).length;
            return 0;
        },

        // Logical AND
        and: function() {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            return args.every(Boolean);
        },

        // Logical OR
        or: function() {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            return args.some(Boolean);
        },

        // Logical NOT
        not: function(value) {
            return !value;
        },

        // Conditional class helper
        classIf: function(condition, trueClass, falseClass) {
            return condition ? trueClass : (falseClass || '');
        },

        // Times helper (repeat n times)
        times: function(n, options) {
            let result = '';
            for (let i = 0; i < n; i++) {
                result += options.fn({ index: i, num: i + 1 });
            }
            return result;
        },

        // Percentage calculation
        percentage: function(value, total) {
            if (!total || total === 0) return 0;
            return Math.round((value / total) * 100);
        },

        // URL encode
        encodeURI: function(str) {
            return encodeURIComponent(str || '');
        },

        // Default value
        default: function(value, defaultValue) {
            return value || defaultValue;
        },

        // Join array
        join: function(array, separator) {
            if (!Array.isArray(array)) return '';
            return array.join(separator || ', ');
        },

        // Object keys
        keys: function(obj) {
            if (!obj || typeof obj !== 'object') return [];
            return Object.keys(obj);
        },

        // Object values
        values: function(obj) {
            if (!obj || typeof obj !== 'object') return [];
            return Object.values(obj);
        },

        // Each with index
        eachWithIndex: function(array, options) {
            let result = '';
            if (Array.isArray(array)) {
                for (let i = 0; i < array.length; i++) {
                    result += options.fn({
                        item: array[i],
                        index: i,
                        first: i === 0,
                        last: i === array.length - 1
                    });
                }
            }
            return result;
        },

        // Convert to lowercase
        lowercase: function(str) {
            return (str || '').toLowerCase();
        },

        // Convert to uppercase
        uppercase: function(str) {
            return (str || '').toUpperCase();
        },

        // Capitalize first letter
        capitalize: function(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        // Math operations
        math: function(a, operator, b) {
            a = parseFloat(a);
            b = parseFloat(b);
            switch (operator) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return a / b;
                case '%': return a % b;
                default: return a;
            }
        },

        // Format number with commas
        formatNumber: function(num) {
            if (num === null || num === undefined) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        // Check if value is empty
        isEmpty: function(value) {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string' && value.trim() === '') return true;
            if (Array.isArray(value) && value.length === 0) return true;
            if (typeof value === 'object' && Object.keys(value).length === 0) return true;
            return false;
        },

        // Debug helper
        debug: function(value) {
            console.log('Handlebars Debug:', value);
            return '';
        }
    };

    // Register each helper
    for (const [name, fn] of Object.entries(helpers)) {
        if (hbs.handlebars) {
            hbs.handlebars.registerHelper(name, fn);
        } else {
            Handlebars.registerHelper(name, fn);
        }
    }

    return helpers;
}

module.exports = { registerHelpers };
