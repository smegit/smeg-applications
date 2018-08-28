Ext.define('Shopping.model.Category',{
    extend : 'Ext.data.Model',
    //fields : ['VVRRN','BECATID','BECDSC','VVCATSEQ','BANTEXT'],
	fields : [{name: 'text', type: 'string', mapping: 'CATDESC'},'CATID','CATDSC','BANTEXT','showProds'],

    proxy  : {
        type        : 'ajax',
        url         : '/valence/vvcall.pgm',
        extraParams : {
            pgm    : 'EC1010',
            action : 'getCats'
        },
        reader     : {
            type : 'json',
            rootProperty : 'cats'
        }
    }
});