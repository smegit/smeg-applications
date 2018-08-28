describe('Ext.tab.Panel', function() {
    var panel;
    
    function makePanel(config, items) {
        items = items || [{
            xtype: 'panel',
            itemId: 'foo',
            title: 'foo',
            html: 'lorem ipsum foo baroo'
        }, {
            xtype: 'panel',
            itemId: 'bar',
            title: 'bar',
            html: 'blergo zumbo shmorem gypsum'
        }];
        
        config = Ext.apply({
            renderTo: document.body,
            items: items
        }, config);
        
        panel = new Ext.tab.Panel(config);
        
        return panel;
    }
    
    afterEach(function() {
        panel = Ext.destroy(panel);
    });
    
    describe("active item", function() {
        it("should default the active item to the first item", function() {
            makePanel();

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[0]);
        });

        it("should be able to set the active item initially", function() {
            makePanel({
                activeItem: 1
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should set the last item as active if the active item is out of bounds", function() {
            makePanel({
                activeItem: 3
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should not change the active item if we add a new item", function() {
            makePanel({
                activeItem: 1
            });

            panel.add({
                xtype: 'panel',
                itemId: 'hello',
                title: 'hello',
                html: 'lorem ipsum foo baroo'
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });
    });
});
