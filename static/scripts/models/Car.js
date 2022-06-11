class Car {
    constructor(length){

        this.object = new THREE.Object3D()

        this.length = length

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

        const cubeGeometry = new THREE.BoxGeometry(100 * length,100,100)

        this.carModel = new THREE.Mesh(cubeGeometry, this.carMaterial)
        this.object.add(this.carModel)
    }

    returnCarModel = () => {
        return this.object
    }

    enableDragControls(camera, rendererDom, cameraControls){
        this.objectControls = new THREE.DragControls([this.object], camera, rendererDom)
        this.objectControls.addEventListener( 'dragstart', function () { cameraControls.enabled = false; } );
		this.objectControls.addEventListener( 'dragend', function () { cameraControls.enabled = true; } );
    }

}