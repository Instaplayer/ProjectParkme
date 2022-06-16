class Car {
    constructor(length) {

        this.object = new THREE.Object3D()

        this.storedPos = this.object.position

        this.length = length

        this.opaque = false

        this.carMaterial = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x550606,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0xff1111,
            transparent: false,
            opacity: 1
        })

        this.opaqueCarMaterial = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x550606,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0xff1111,
            transparent: true,
            opacity: 0.4
        })

        this.playerCarMaterial = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x06aa06,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0x005500,
            transparent: false,
            opacity: 1
        })

        this.opaquePlayerCarMaterial = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x06aa06,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0x005500,
            transparent: true,
            opacity: 0.4
        })

        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

        const cubeGeometry = new THREE.BoxGeometry(100 * length,100,100)

        this.carModel = new THREE.Mesh(cubeGeometry, this.carMaterial)
        this.carModel.userData = "car";
        this.object.add(this.carModel)

        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boundingBox.setFromObject(this.carModel)

        this.bbHelper = new THREE.Box3Helper (this.boundingBox, 0xffff00)

        console.log(this)
    }

    returnCarModel = () => {
        return this.object
    }

    checkColisions = (carArray) => {

        let colides = false

        carArray.forEach(car => {
            if(car.boundingBox != this.boundingBox){
                if(this.boundingBox.intersectsBox(car.boundingBox)){
                    colides = true
                }
            }
        });

        return colides
    }

    checkWallColisions = (wallArray) => {

        let colides = false

        wallArray.forEach(wall => {
            if(wall != this.boundingBox){
                if(this.boundingBox.intersectsBox(wall)){
                    colides = true
                }
            }
        });

        return colides
    }

    updateBoundingBox = () => {
        this.boundingBox.copy(this.carModel.geometry.boundingBox).applyMatrix4(this.object.matrixWorld)
    }

    toggleOpacity = () => {
        if(this.carModel.material == this.carMaterial){
            this.carModel.material = this.opaqueCarMaterial
            this.opaque = true
        }
        else{
            this.carModel.material = this.carMaterial
            this.opaque = false
        }
    }

    setAsPlayer = () => {
        this.carMaterial = this.playerCarMaterial
        this.opaqueCarMaterial = this.opaquePlayerCarMaterial

        this.carModel.material = this.carMaterial
        this.object.userData = "startCar";
    }

    detectWin = (winBlock) => {
        let colides = false
        
        if(winBlock.containsBox(this.boundingBox)){
            colides = true
        }
        return colides
    }

}