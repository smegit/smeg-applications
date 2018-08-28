describe("Ext.Panel", function () {
    var panel;

    function createPanel (config) {
        panel = new Ext.Panel(config);
    }

    afterEach(function () {
        panel = Ext.destroy(panel);
    });

    describe("binding", function() {
        it("should be able to bind items inside the header", function() {
            createPanel({
                viewModel: {
                    data: {
                        foo: 'aTitle'
                    }
                },
                header: {
                    items: {
                        xtype: 'component',
                        bind: '{foo}',
                        itemId: 'foo'
                    }
                }
            });
            panel.getViewModel().notify();
            expect(panel.down('#foo').getHtml()).toBe('aTitle');
        });
    });

    describe("configuration", function () {
        describe("title", function () {
            it("should not create a header no title is provided", function () {
                createPanel();
                expect(panel.getHeader()).toBeNull();
            });

            it("should create a header if title is provided", function () {
                createPanel({
                    title: 'Foo'
                });
                expect(panel.getHeader().getTitle().getText()).toBe('Foo');
            });

            it("should not create header if title is provided, but header:false", function () {
                createPanel({
                    title: 'Foo',
                    header: false
                });
                expect(panel.getHeader()).toBeNull();
            });
        });
    });

    describe("methods", function () {
        describe("setTitle", function () {
            it("should update title when a header exists", function () {
                createPanel({
                    title: 'Foo'
                });

                panel.setTitle('Bar');  
                expect(panel.getHeader().getTitle().getText()).toBe('Bar');
            });

            it("should not create a header when header:false", function () {
                createPanel({
                    title: 'Foo',
                    header: false
                });

                panel.setTitle('Bar');

                expect(panel.getHeader()).toBeNull();
            });
        });

        describe('showBy', function() {
            var byCmp;

            beforeEach(function() {
                byCmp = new Ext.Button({
                    width: 100,
                    text: 'Button',
                    renderTo: document.body
                });

                createPanel({
                    title: 'The title',
                    html: 'The content'
                });
            });

            afterEach(function() {
                byCmp = Ext.destroy(byCmp);
            });

            it('should be able to show a floated menu after hiding it', function() {
                panel.showBy(byCmp);
                panel.hide();
                panel.showBy(byCmp);

                expect(panel.isFloated()).toBe(true);
                expect(panel.isVisible()).toBe(true);
            });
        });
    });
});
