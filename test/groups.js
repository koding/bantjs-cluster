var cluster = require('..');
var test = require('tape');

test('groups', function (t) {
  var groups = cluster([
    { name: 'x', deps: ['y', 'j'] },
    { name: 'j' },
    { name: 'y', deps: ['j'] }
  ]).groups;
  
  t.equal(groups.length, 1);
  t.equal(groups[0].name, 'x');
  t.deepEqual(groups[0]._deps, ['y', 'j']);

  groups = cluster([
    { name: 'x', deps: ['y', 'j'] },
    { name: 'j' },
    { name: 'y', deps: ['j'] },
    { name: 'k', deps: ['j'] }
  ]).groups;

  t.equal(groups.length, 3);
  t.equal(groups[0].name, 'x');
  t.equal(groups[2].name, 'j');
  t.equal(groups[1].name, 'k');
  t.deepEqual(groups[1]._deps, ['j']);

  groups = cluster([
    { name: 'x', deps: ['y', 'j'] },
    { name: 'y', deps: ['j'] },
    { name: 'k', deps: ['j', 'a'] },
    { name: 'j', deps: ['a'] },
    { name: 'w' },
    { name: 'a', deps: ['w'] }
  ]).groups;

  t.equal(groups.length, 4);
  t.equal(groups[3].name, 'a');
  t.equal(groups[0].name, 'x');
  t.equal(groups[1].name, 'k');
  t.equal(groups[2].name, 'j');
  t.deepEqual(groups[2]._deps, ['a']);
  t.deepEqual(groups[3]._deps, ['w']);

  t.end();
});
