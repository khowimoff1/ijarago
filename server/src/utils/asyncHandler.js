// Express 4 async xatolarni o'zi ushlamaydi — errorga aylantirib app.js'dagi handlerga uzatamiz
export const a = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
