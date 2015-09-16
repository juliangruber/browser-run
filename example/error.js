function foo(){ throw new Error('bar') }
console.log('about to call foo');
foo();
