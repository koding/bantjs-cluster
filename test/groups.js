var cluster = require('..');
var test = require('tape');

test('groups', function (t) {
  var groups = cluster([
    { name: 'x', locals: ['y', 'j'] },
    { name: 'j' },
    { name: 'y', locals: ['j'] }
  ]);

  t.equal(groups.length, 1);
  t.equal(groups[0].name, 'x');
  t.deepEqual(groups[0].locals, ['y', 'j']);

  groups = cluster([
    { name: 'x', locals: ['y', 'j'] },
    { name: 'j' },
    { name: 'y', locals: ['j'] },
    { name: 'k', locals: ['j'] }
  ]);

  t.equal(groups.length, 3);
  t.equal(groups[0].name, 'x');
  t.equal(groups[2].name, 'j');
  t.equal(groups[1].name, 'k');
  t.deepEqual(groups[1].locals, ['j']);

  groups = cluster([
    { name: 'x', locals: ['y', 'j'] },
    { name: 'y', locals: ['j'] },
    { name: 'k', locals: ['j', 'a'] },
    { name: 'j', locals: ['a'] },
    { name: 'w' },
    { name: 'a', locals: ['w'] }
  ]);

  t.equal(groups.length, 4);
  t.equal(groups[3].name, 'a');
  t.equal(groups[0].name, 'x');
  t.equal(groups[1].name, 'k');
  t.equal(groups[2].name, 'j');
  t.deepEqual(groups[2].locals, ['a']);
  t.deepEqual(groups[3].locals, ['w']);

  t.end();
});
