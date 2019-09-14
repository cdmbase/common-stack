

/**
 * Converts the format of the object form 
 * original: [ { id: 1, name: 'a1',}, { id: 2, name: 'a2'}, {id: 1: name: 'b1'}]
 *
 * output: { 1: [{id: 1, name: 'a1'}, { id: 1, name: 'b1'}], 2: [{id: 2, name: 'a2'}]}
 */
export const arrayToObjectArray = (array, id) =>
    array.reduce((result, item) => {
        result[item[id]] = (result[item[id]] || []).concat(item);
        return result;
    }, {});

