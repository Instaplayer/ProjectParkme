class Game {
    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 10000  );
        this.camera.position.set(300,150,300)
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x0066ff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.light1 = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        this.light1.position.set( 0.2, 1, 0.4 )
        this.light1.castShadow = true
        this.scene.add( this.light1 );

        this.light2 = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        this.light2.position.set( -0.2, 1, -0.4 )
        this.light2.castShadow = true
        this.scene.add( this.light2 );

        let testCar = new Car(3)
        let testCar2 = new Car(3)

        this.scene.add(testCar.bbHelper)
        this.scene.add(testCar2.bbHelper)


        this.carList = [testCar, testCar2]

        testCar2.returnCarModel().position.z = 300
        testCar2.returnCarModel().rotation.y = Math.PI/2

        let cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

        // Kontrolery ruchu aut + kolizje
        // Lista Aut które MOŻNA przesuwać VVV
        let dragArray = this.carList
        {
            let dynamicDragArray = []
            this.draggableController = new THREE.DragControls(dynamicDragArray, this.camera, this.renderer.domElement)
            this.draggableController.transformGroup = true
            dragArray.forEach(object => {
                dynamicDragArray.push(object.returnCarModel())
            })

            this.draggableController.addEventListener( 'dragstart', function (event) {

                console.log("dragstart")

                cameraControls.enabled = false; 

                dragArray.forEach(car => {
                    if(car.object == event.object){
                        this.selectedCar = car
                    }
                });

                this.startingPoint = {
                    x: event.object.position.x,
                    y: event.object.position.y,
                    z: event.object.position.z
                }

                this.origin = {
                    x: event.object.position.x,
                    y: event.object.position.y,
                    z: event.object.position.z
                }
            })

            this.draggableController.addEventListener( 'dragend', function (event) {

                if(this.selectedCar)
                if(this.selectedCar.checkColisions(dragArray) || this.intersects1.length > 0 || this.intersects2.length > 0){
                    event.object.position.set(this.startingPoint.x,this.startingPoint.y, this.startingPoint.z)
                }

                if(this.selectedCar.opaque)
                this.selectedCar.toggleOpacity()

                cameraControls.enabled = true; 
            })

            this.draggableController.addEventListener( 'drag', function (event) {

                let difference = {
                    x: event.object.position.x - this.origin.x,
                    y: event.object.position.y - this.origin.y,
                    z: event.object.position.z - this.origin.z
                }

                event.object.translateY(difference.y * -1)
                event.object.translateZ(difference.x * -Math.sin(event.object.rotation.y))
                event.object.translateZ(difference.z * -Math.cos(event.object.rotation.y))

                this.endPoint = {
                    x: event.object.position.x,
                    y: event.object.position.y,
                    z: event.object.position.z
                }


                if(this.selectedCar){
                    if(this.selectedCar.checkColisions(dragArray)){
                        if(!this.selectedCar.opaque){
                            this.selectedCar.toggleOpacity()
                        }
                    }
                    else {

                        let ray1 = new THREE.Raycaster(new THREE.Vector3(this.endPoint.x + 49, this.endPoint.y, this.endPoint.z + 49), new THREE.Vector3(this.startingPoint.x + 49, this.startingPoint.y, this.startingPoint.z + 49).normalize())
                        let ray2 = new THREE.Raycaster(new THREE.Vector3(this.endPoint.x - 49, this.endPoint.y, this.endPoint.z - 49), new THREE.Vector3(this.startingPoint.x - 49, this.startingPoint.y, this.startingPoint.z - 49).normalize())

                        dragArray.forEach(car => {
                            if(car.object != event.object){
                                this.intersects1 = ray1.intersectObject(car.object)
                                this.intersects2 = ray2.intersectObject(car.object)
                            }

                        });

                        if(this.selectedCar.opaque && this.intersects1.length == 0 && this.intersects2.length == 0)
                        this.selectedCar.toggleOpacity()
                    }
                }

                this.origin = {
                    x: event.object.position.x,
                    y: event.object.position.y,
                    z: event.object.position.z
                }
            })

            this.draggableController.addEventListener('hoveron', function (event) {

                while(dynamicDragArray.length > 0){
                    dynamicDragArray.pop()
                }
                dynamicDragArray.push(event.object.parent)
            })

            this.draggableController.addEventListener( 'hoveroff', function (event) {

                while(dynamicDragArray.length > 0){
                    dynamicDragArray.pop()
                }

                dragArray.forEach(object => {
                    dynamicDragArray.push(object.returnCarModel())
                })
            })
        }


        this.scene.add(testCar.returnCarModel())
        this.scene.add(testCar2.returnCarModel())

        document.getElementById("root").append(this.renderer.domElement);

        this.render() // wywołanie metody render

        window.onresize = ()=>{
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        }
    }

    render = () => {

        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);

        this.carList.forEach(car => {
            car.updateBoundingBox()
            car.checkColisions(this.carList)
        })
        
        console.log("render leci")

    }



}