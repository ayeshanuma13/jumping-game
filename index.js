let gameStarted = false
let gameWon = false
let gameOver = false

document.addEventListener('keydown', (event) => {
  if (!gameStarted && event.code === 'Space') {
    document.getElementById('startScreen').style.display = 'none'
    gameStarted = true
  }
})

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
        this.image = createImage('./images/spriteStandRight.png')
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage('./images/spriteStandRight.png'),
                left: createImage('./images/spriteStandLeft.png'),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage('./images/spriteRunRight.png'),
                left: createImage('./images/spriteRunLeft.png'),
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

class Enemy {
    constructor({x,y,speed}) {
        this.position = {
            x,
            y
        }
        this.velocity = {
            x: -speed,
            y: 0
        }
        this.width = 100
        this.height = 100
        this.image = createImage('./images/enemy.png')
        this.markedForDeletion = false
    }

    draw() {
        c.drawImage(this.image, this.position.x,
            this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
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
let enemies = []
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
let scrollScore = 0
let killScore = 0

function init() {
    platformImg = createImage('./images/platform.png')
    player = new Player()
    platforms = [
        new Platform({ x: 0, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width - 2, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 2 + 100, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 3 + 400, y: 470, image: platformImg }),
        new Platform({ 
            x: platformImg.width * 4 + 700, 
            y: 270, 
            image: platformSmallTallImg 
        }),
        new Platform({ 
            x: platformImg.width * 5 + 1000, 
            y: 470, 
            image: platformImg 
        }),
        new Platform({ x: platformImg.width * 6 + 1400, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 7 + 1800, y: 470, image: platformImg }),
        new Platform({ 
            x: platformImg.width * 8 + 2100 - 50, 
            y: 270, 
            image: platformSmallTallImg 
        }),
        new Platform({ x: platformImg.width * 9 + 2400, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 10 + 2700, y: 430, image: platformSmallTallImg }),
        new Platform({ x: platformImg.width * 11 + 3000, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 12 + 3300, y: 470, image: platformImg }),
        new Platform({ 
            x: platformImg.width * 13 + 3600 - 20, 
            y: 250, 
            image: platformSmallTallImg 
        }),
        new Platform({ x: platformImg.width * 14 + 3900, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 15 + 4200, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 16 + 4500, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 17 + 4800, y: 470, image: platformImg }),
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

    enemies = [
        new Enemy({x: 800, y: 370, speed:2}),
        new Enemy({x: 1600, y: 370, speed:2}),
        new Enemy({x: 2500, y: 370, speed:2}),
    ]

    gameStarted = false
    gameWon = false
    gameOver = false
    scrollOffset = 0
    scrollScore = 0
    killScore = 0
    document.getElementById('startScreen').style.display = 'flex'
    document.getElementById('winScreen').style.display = 'none'
    document.getElementById('loseScreen').style.display = 'none'
}

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0, canvas.width, canvas.height)

    if (!gameStarted) {
        return 
    }

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
            scrollScore = Math.floor(scrollOffset/100)
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            }
        )
        genericObjects.forEach(genericObject => {
            genericObject.position.x -= player.speed * .66
        })
        enemies.forEach(enemy => {
            enemy.position.x -= player.speed 
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
        enemies.forEach(enemy => {
            enemy.position.x += player.speed 
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

    enemies.forEach(enemy => {
        if (enemy.position.x + enemy.width > 0 && enemy.position.x < canvas.width) {
        enemy.update()
    }
    })

    enemies.forEach(enemy => {
        if (
            player.position.y + player.height >= enemy.position.y && 
            player.position.y + player.height <= enemy.position.y + enemy.height / 2 && 
            player.position.x + player.width >= enemy.position.x &&
            player.position.x <= enemy.position.x + enemy.width
        ) {
            enemy.markedForDeletion = true
            player.velocity.y = -15 
            killScore += 100
        }
    })
    enemies.forEach(enemy => {
        const collision =
            player.position.x < enemy.position.x + enemy.width &&
            player.position.x + player.width > enemy.position.x &&
            player.position.y < enemy.position.y + enemy.height &&
            player.position.y + player.height > enemy.position.y

        if (collision && !enemy.markedForDeletion) {
            gameOver = true
            gameStarted = false
            document.getElementById('loseScreen').style.display = 'flex'
            document.getElementById('finalLoseScore').innerText = 'Score: ' + (scrollScore + killScore)
            return
        }
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)

    //win condition
    const lastPlatform = platforms[platforms.length - 1]
    if (scrollOffset>14500) {
        gameWon = true
        gameStarted = false
        document.getElementById('winScreen').style.display = 'flex'
        document.getElementById('finalWinScore').innerText = 'Score: ' + (scrollScore + killScore)
        return
    }

    //lose condition
    if (player.position.y > canvas.height) {
        gameOver = true
        gameStarted = false
        document.getElementById('loseScreen').style.display = 'flex'
        document.getElementById('finalLoseScore').innerText = 'Score: ' + (scrollScore + killScore)
        return
    }

    // Display score
    c.font = '24px Arial'
    c.fillStyle = 'white'
    c.fillText('Score: ' + (scrollScore + killScore), canvas.width - 150, 40)
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