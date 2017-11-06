Ext.define('Ext.overrides.scroll.Scroller', {
    override       : 'Ext.scroll.Scroller',
    statics: {
        /**
         * Creates and returns an appropriate Scroller instance for the current device.
         * @param {Object} config Configuration options for the Scroller
         * @return {Ext.scroll.Scroller}
         */
        create: function(config) {
            //return Ext.Factory.scroller(config, Ext.supports.Touch ? 'touch' : 'dom');
            return Ext.Factory.scroller(config, 'dom');
        },
        /**
         * Get the scrolling element for the document based on feature detection.
         * See: https://dev.opera.com/articles/fixing-the-scrolltop-bug/
         *
         * @return {HTMLElement}
         *
         * @private
         */
        getScrollingElement: function() {
            var doc = document,
                standard = this.$standardScrollElement,
                el = doc.scrollingElement,
                iframe, frameDoc;
            // Normalize the scrollElement we need to read/write from
            // First attempt to detect the newer standard for viewport
            // scrolling
            if (el) {
                return el;
            }
            // The newer standard doesn't exist, let the scroller
            // decide via feature detection.
            if (standard === undefined) {
                iframe = document.createElement('iframe');
                iframe.style.height = '1px';
                document.body.appendChild(iframe);
                frameDoc = iframe.contentWindow.document;
                frameDoc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
                frameDoc.close();
                standard = frameDoc.documentElement.scrollHeight > frameDoc.body.scrollHeight;
                iframe.parentNode.removeChild(iframe);
                this.$standardScrollElement = standard;
            }
            return standard ? doc.documentElement : doc.body;
        }
    }
});
