var nock = require('nock');

module.exports = mockServer;

function mockServer(){
  var server = nock('http://prixfixeapp.com/api');
  server
    .get('/things/1')
    .reply(200,{
      '_id' : 1,
      'name' : 'thing one'
    });
  server
    .get('/things')
    .reply(200,{
      'things' : [
        { '_id' : 1, 'name' : 'thing one' },
        { '_id' : 2, 'name' : 'thing two' },
        { '_id' : 3, 'name' : 'thing three' },
        { '_id' : 4, 'name' : 'thing four' },
      ]
    });
  server
    .post('/things')
    .reply(200,{
      '_id' : 10,
      'name' : 'new thing'
    });
  server
    .put('/things/10')
    .reply(200,{
      '_id' : 10,
      'name' : 'modified thing'
    });
  server
    .delete('/things/10')
    .reply(204);
};
