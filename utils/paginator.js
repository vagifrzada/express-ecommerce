function paginate(params) {
    const page = parseInt(params.page) || 1
    const { perPage, totalItems } = params
    const offset = (page - 1) * perPage

    return {
        options: {
            skip: offset,
            limit: perPage,
        },
        totalItems,
        currentPage: page,
        hasPrevious: page > 1,
        hasNext: page * perPage < totalItems,
        previousPage: page - 1,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / perPage),
    }
}

module.exports = {
    paginate,
}
