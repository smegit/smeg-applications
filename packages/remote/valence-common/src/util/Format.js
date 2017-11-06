Ext.define('Valence.common.util.Format', {
    singleton             : true,
    durationTextSinceDate : function (v, format, returnedUnits, numbersOnly) {
        var me     = this,
            f      = format || 'Y-m-d-H.i.s.u',
            tsDate = Ext.Date.parse(v, f),
            now    = new Date(),
            minute = 60,
            hour   = 3600,
            day    = 86400,
            year   = 31536000, // 365 days
            diff   = Math.abs((tsDate.getTime() - now.getTime()) / 1000), // in seconds
            formatArgs, measure, t;

        if (Ext.isEmpty(tsDate) || Ext.util.Format.date(tsDate,'Y') === '0001') {
            return '';
        }
        if (Ext.isEmpty(returnedUnits)) {
            if (diff < minute) {
                return Valence.lang.lit.secondsAgo;
            } else if (diff < hour) {
                formatArgs = me.getDurationText(Valence.lang.lit.minutesAgo, diff, minute);
            } else if (diff < day) {
                formatArgs = me.getDurationText(Valence.lang.lit.hoursAgo, diff, hour);
            } else if (diff > year) {
                formatArgs = me.getDurationText(Valence.lang.lit.yearsAgo, diff, year);
            } else {
                formatArgs = me.getDurationText(Valence.lang.lit.daysAgo, diff, day);
            }
        } else {
            if (returnedUnits == 'minute') {
                measure = minute;
            } else if (returnedUnits == 'hour') {
                measure = hour;
            } else if (returnedUnits == 'day') {
                measure = day;
            } else if (returnedUnits == 'year') {
                measure = year;
            }
            formatArgs = me.getDurationText(numbersOnly ? '{0}' : '{0} ' + returnedUnits + '{1} ago', diff, measure, numbersOnly);
        }
        // t = Ext.bind(Ext.String.format, null, formatArgs)();
        return Ext.util.Format.format('<span data-qtip="{0}">{1}</span>',Ext.util.Format.date(tsDate,format),formatArgs);
        // if (Ext.isClassic){
        //     return Ext.util.Format.format('<span data-qtip="{0}">{1}</span>',Ext.util.Format.date(tsDate,format),formatArgs);
        // }
        // return Ext.util.Format.date(tsDate,format);
    },

    getDurationText : function (fStr, diffInSeconds, timeUnit, numbersOnly) {
        var val    = Math.floor(diffInSeconds / timeUnit),
            minute = 60,
            hour   = 3600,
            day    = 86400,
            year   = 31536000, // 365 days
            lit    = Valence.lang.lit,
            plural = val > 1 ? 's' : '',
            result = [fStr, val];

        if (val === 1){
            if (timeUnit === minute){
                return lit.minuteAgo;
            } else if (timeUnit === hour){
                return lit.hourAgo;
            } else if (timeUnit === day){
                return lit.dayAgo;
            } else if (timeUnit === year){
                return lit.yearAgo;
            }
        }

        if (fStr.indexOf('VAR1') !== -1){
            return fStr.replace('VAR1', val);
        }
        if (numbersOnly) {
            result.push(plural);
        }
        return result;
    },
    phone           : function (v) {
        if (Ext.isEmpty(v)) {
            return '';
        }
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 10) {
            return v.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (v.length === 11) {
            if (v[10] != 0) {
                return v.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, '$1-$2-$3-$4');
            } else {
                return v.substring(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        } else if (v.length === 1) {
            return '';
        }
        return v;
    },
    ssn             : function (v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 9) {
            return v.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
        }
        return v;
    },
    ssnmask         : function (v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 9) {
            return v.replace(/(\d{3})(\d{2})(\d{4})/, 'XXX-XX-$3');
        }
        return v;
    },
    zip             : function (v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        if (v.trim().length === 9) {
            return v.replace(/(\d{5})(\d{4})/, '$1-$2');
        }
        return v;
    }
});