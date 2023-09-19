const cart = require("../models/cartmodel");


const getCartCount = (ID) => {

    return new Promise(async (resolve, reject) => {

        try {
            await cart.findOne({ userId: ID, active: true }, { totalQty: 1 }).then((data) => {
                if (data) {
                    resolve(data.totalQty);
                } else {
                    resolve(0);
                }
            });
        } catch (error) {
            throw new Error(error)
        }

    });
};

module.exports={
    getCartCount
}