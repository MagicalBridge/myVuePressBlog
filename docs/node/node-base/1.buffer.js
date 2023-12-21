const buf1 = Buffer.from('我爱你', 'utf-8');
console.log(buf1); // <Buffer e6 88 91 e7 88 b1 e4 bd a0>

const buf2 = Buffer.alloc(10);
console.log(buf2); // <Buffer 00 00 00 00 00 00 00 00 00 00>

const isBuffer = Buffer.isBuffer(buf1);
console.log(isBuffer);

const concatenatedBuffer = Buffer.concat([buf1, buf2]);
console.log(concatenatedBuffer); // <Buffer e6 88 91 e7 88 b1 e4 bd a0 00 00 00 00 00 00 00 00 00 00>

const length = Buffer.byteLength(buf1, 'utf-8');
console.log(length); // 9
