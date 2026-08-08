export const getUniqueStrings = (strings) => {
    return Array.from(new Set(strings));
};

export const wrapError = (message, err) => {
    const wrapped = new Error(`${message} ${err.message}`);
    wrapped.stack = err.stack;
    return wrapped;
};
