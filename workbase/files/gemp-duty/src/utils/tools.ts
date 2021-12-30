/**
 * Dedupes array based on criterion returned from iteratee function
 * Ex: uniqueBy([{id: 1}, {id: 1}, {id: 2}],
 *     val => val.id
 * ) = [{id: 1}, {id: 2}]
 */
function uniqueBy(arr, fun) {
    const valHas = {}
    return arr.filter(ele => {
      const val = fun(ele)
      return !(val in valHas) && (valHas[val] = 1);
    })
}

export { uniqueBy }