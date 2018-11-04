var promisify = (fn, ctx, ...args) => {
    if (!ctx) {
        ctx = fn;
    }

    return new Promise((resolve, reject) => {
        args.push((err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });

        fn.apply(ctx, args)
    });
};


module.exports = {
    promisify
};