Ext.define('Shopping.model.PromoCodeList', {
  extend: 'Ext.data.Model',
  fields: ['PAPRMCOD', 'PAPRMDSC'],
  type: 'memory',
  reader: {
    type: 'json'
  }
});