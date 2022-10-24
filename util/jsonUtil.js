Array.prototype.isEmpty = function () {
  return this.length === 0 ? true : false;
};

Array.prototype.immer = function () {
  return JSON.parse(JSON.stringify(this));
};

Object.prototype.immer = function () {
  return JSON.parse(JSON.stringify(this));
};
