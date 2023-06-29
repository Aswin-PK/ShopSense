function addToCart(productId){
    $.ajax({
        url: '/add-to-cart/'+productId,
        method: 'get',
        success: (response)=>{
            if(response.status){
                let count = $('#cartCounter').html()
                count = parseInt(count) + 1
                $('#cartCounter').html(count)
            }
        }
    })
}

// To change the quantity - increment or decrement. .....................

function changeQuantity(cartId, prodId, count){
    let quantity = parseInt(document.getElementById(prodId).value)
    console.log("pressed");
    count = parseInt(count)
    $.ajax({
        url: '/change-product-quantity',
        method: 'post',
        data: {
            cartId: cartId,
            productId: prodId,
            count: count,
            quantity: quantity
        },
        success: (response)=>{
            if(response)
                document.getElementById(prodId).value = quantity + count 
        }
    })
}


// direc remove items from cart

function removeCartItem(cartId, prodId){
    $.ajax({
        url: '/remove-cart-item',
        method: 'post',
        data: {
            cartId: cartId,
            productId: prodId
        },
        success: (response)=>{
            if(response.itemRemoved){
                alert("Remove item from cart ? ")
                location.reload()
            }
        }
    })
}