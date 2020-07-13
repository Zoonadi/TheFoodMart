/*
module.exports = function Cart(oldCart) {
    this.items = oldCart.items;
    this.totalQuantity = oldCart.totalQuantity;
    this.totalPrice = oldCart.totalPrice;

    this.add = function(item, id){
        const storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, quantity: 0, price: 0}
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQuantity++;
        this.totalPrice += storedItem.price;

    }

    this.generateArray = function() {
        const arr = [];
        for (const id in this.items){
            arr.push(this.items[id]);
        }
        return arr
    }

} */