const cache = {};

export const saveFile = (id, file) => {
  cache[id] = file;
};

export const getFile = id => cache[id];

export const clearCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
};
