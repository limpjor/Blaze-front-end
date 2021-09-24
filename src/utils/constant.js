
export const CONSTANT = {
    PATH:'http://localhost:8080/',

    ORDERS : {
        GET:"api/orders/get",
        INSERT:"api/orders/insert",
        UPDATE:"api/orders/update",
        DELETE:"api/orders/delete"
    },

    PRODUCTS : {
        GET:"api/products/get",
        INSERT:"api/products/insert",
        UPDATE:"api/products/update",
        DELETE:"api/products/delete",
        ORDER:{
            GET:"api/products/order/get",
            INSERT:"api/products/order/insert"
        }
    }
}