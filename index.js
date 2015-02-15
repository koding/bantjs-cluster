var toposort = require('toposort');
var xtend = require('xtend');
var intersect = require('intersect');

module.exports = function (arr) {
  var nodes = arr.map(function (n) {
    return n.name;
  });

  var edges = [], index = {};
  arr.forEach(function (obj) {
    index[obj.name] = obj;
    [].concat(obj.locals).filter(Boolean).forEach(function (name) {
      edges.push([obj.name, name]);
    });
  });

  nodes = toposort.array(nodes, edges).map(function (name) {
    var obj = index[name];
    return xtend(index[name], { _locals: obj.locals || [] });
  });

  var groups = nodes.reduce(function (acc, dependency) {
    var dependents = acc.filter(function (obj) {
      if (~obj._locals.indexOf(dependency.name))
        return obj;
    });
    
    if (dependents.length == 1) {
      var dependent = dependents[0];
      var dups = intersect(dependent._locals, dependency._locals);
      dependent._locals = dependent._locals.filter(function (name) {
        if (~dups.indexOf(name)) return;
        return true;
      });
      dependent._locals = dependent._locals.concat(dependency._locals);
      return acc;
    }

    return acc.concat(dependency);
  }, []);

  return groups.map(function (group) {
    return {
      name: group.name,
      locals: group._locals
    };
  });
}