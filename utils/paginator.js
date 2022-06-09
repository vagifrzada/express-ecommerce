function paginate(params) {
    const { page, perPage, totalItems } = params
    const offset = (page - 1) * perPage

    return {
        options: {
            skip: offset,
            limit: perPage,
        },
        totalItems,
        hasPrevious: page > 1,
        hasNext: page * perPage < totalItems,
        lastPage: Math.ceil(totalItems / perPage),
    }
}

module.exports = {
    paginate,
}
