const  canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1
class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150
        this.image = createImage('/images/spriteStandRight.png')
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage('/images/spriteStandRight.png'),
                left: createImage('/images/spriteStandLeft.png'),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage('/images/spriteRunRight.png'),
                left: createImage('/images/spriteRunLeft.png'),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
    }

    draw() {
        c.drawImage(this.currentSprite, this.currentCropWidth * this.frames,
             0, this.currentCropWidth, 400, this.position.x,
            this.position.y, this.width, this.height)
    }

    update() {
        this.frames++
        if(this.frames > 59 && (this.currentSprite == 
            player.sprites.stand.right || this.currentSprite == 
            player.sprites.stand.left)
        ) this.frames=0
        else if (this.frames > 29 && (this.currentSprite == 
            player.sprites.run.right || this.currentSprite == 
            player.sprites.run.left)
        ) this.frames=0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    
        if(this.position.y + this.height +
            this.velocity.y <= canvas.height){
                this.velocity.y += gravity
            }
    }
}

class Platform {
    constructor({x,y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw(){
        c.drawImage(this.image, this.position.x,
            this.position.y)
    }
}

class GenericObject{
    constructor({x,y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw(){
        c.drawImage(this.image, this.position.x,
            this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}


let platformImg = createImage('./images/platform.png')
let platformSmallTallImg = createImage('./images/platformSmallTall.png')
let player = new Player()
let platforms = []
let genericObjects = []
let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scrollOffset = 0

function init() {
    platformImg = createImage('./images/platform.png')
    player = new Player()
    platforms = [
                new Platform({x: platformImg.width *4 + 300 - 2 + platformImg.width - platformSmallTallImg.width,
                     y: 270, image: platformSmallTallImg}),
                new Platform({x:-1, y:470, image: platformImg}),
                new Platform({x: platformImg.width - 3, y: 470, image: platformImg }),
                new Platform({x: platformImg.width *2 + 100, y: 470, image: platformImg }),
                new Platform({x: platformImg.width *3 + 300, y: 470, image: platformImg }),
                new Platform({x: platformImg.width *4 + 300 - 2, y: 470, image: platformImg }),
                new Platform({x: platformImg.width *5 + 700 - 2, y: 470, image: platformImg })
            ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./images/background.png')
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./images/hills.png')
        }),
    ]
    scrollOffset = 0
}

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    //move right and left
    if (keys.right.pressed == true &&
        player.position.x < 400
    ){
        player.velocity.x = player.speed
    } else if((keys.left.pressed == true && 
        player.position.x > 100) || 
        keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
    {
        player.velocity.x = -player.speed
    }else{
        player.velocity.x = 0

        if (keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            }
        )
        genericObjects.forEach(genericObject => {
            genericObject.position.x -= player.speed * .66
        })
        } else if (keys.left.pressed && scrollOffset>0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            }
        )
        genericObjects.forEach(genericObject => {
            genericObject.position.x += player.speed * .66
        })
        }
    }

    //console.log(scrollOffset)

    //platform collision detection
    platforms.forEach(platform => {
        if (
            player.position.y + player.height <= 
            platform.position.y && 
            player.position.y + player.height + 
            player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0
        }
    })


    // sprite switching
    if( keys.right.pressed && 
        lastKey === 'right' && player.currentSprite != 
        player.sprites.run.right){
            player.frames = 1
            player.currentSprite = player.sprites.run.right
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
        } 
    else if(keys.left.pressed && 
        lastKey === 'left' && player.currentSprite != 
        player.sprites.run.left){
            player.currentSprite = player.sprites.run.left
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
        }
    else if(!keys.left.pressed && 
        lastKey === 'left' && player.currentSprite != 
        player.sprites.stand.left){
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        }
    else if(!keys.right.pressed && 
        lastKey === 'right' && player.currentSprite != 
        player.sprites.stand.right){
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        }

    //win condition
    if (scrollOffset > platformImg.width *5 + 300 - 2) {
        console.log('You win')
    }

    //lose condition
    if (player.position.y > canvas.height) {
        init()
    }
}

init()
animate()

addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break;
        case 83:
            console.log('down')
            break;

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break;

        case 87:
            console.log('up')
            player.velocity.y -= 25
            break;
    }
    }
)

addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        case 65:
            console.log('left')
            keys.left.pressed = false
            break;
        case 83:
            console.log('down')
            break;

        case 68:
            console.log('right')
            keys.right.pressed = false
            break;

        case 87:
            console.log('up')
            break;
    }
    }
)