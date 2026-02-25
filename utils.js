export const wrapError = (message, err) => {
    const wrapped = new Error(`${message} ${err.message}`);
    wrapped.stack = err.stack;
    return wrapped;
};
