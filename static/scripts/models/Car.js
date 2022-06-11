class Car {
    constructor(length){

        this.object = new THREE.Object3D()

        this.dragIntersect = [1]

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
        this.carModel2 = new THREE.Mesh(cubeGeometry, this.carMaterial)
        this.carModel2.position.z = 110 
        this.object.add(this.carModel)
        this.object.add(this.carModel2)
    }

    returnCarModel = () => {
        return this.object
    }

    enableDragControls(camera, rendererDom, cameraControls){

        console.log(this.object.children)

        this.objectControls = new THREE.DragControls([this.object], camera, rendererDom)

        this.objectControls.addEventListener( 'dragstart', function (event) {

            cameraControls.enabled = false; 
            this.origin = {
                x: event.object.position.x,
                y: event.object.position.y,
                z: event.object.position.z
            }

        });
		this.objectControls.addEventListener( 'dragend', function (event) {
            cameraControls.enabled = true; 
            
        });
        this.objectControls.addEventListener( 'drag', function (event) { 
            let parent = event.object.parent

            let difference = {
                x: event.object.position.x - this.origin.x,
                y: event.object.position.y - this.origin.y,
                z: event.object.position.z - this.origin.z
            }

            parent.children.forEach(element => {
                if(element != event.object){
                    element.translateX(difference.x)
                }
                else{
                    element.translateY(difference.y * -1)
                    element.translateZ(difference.z * -1)
                }
            })
            
            this.origin = {
                x: event.object.position.x,
                y: event.object.position.y,
                z: event.object.position.z
            }
        } );
    }

}