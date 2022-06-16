class Game {
    constructor() {
        // auta blokujące
        // [x, y, boolRotation]
        // jeśli boolRotation true
        // auta są obrócone o 90 stopni
        this.cars = [
            [-350, 450, true],
            // [-450, 425],
            // [-450, 375],
            // [-450, 325],
            // [-450, 275],
            // [-450, 225],
            // [-450, 175],
            // [-450, 125],
            // [-450, 75],
            [50, 450, true],
            // [50, 425],
            // [50, 375],
            // [50, 325],
            // [50, 275],
            [150, 475, false],
            // [150, 325]
        ]
        this.scene = new THREE.Scene();
        this.checkedCar = null;
        this.x = -500;
        this.x2 = -500;
        this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(1750, 750, 1750)
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x0066ff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.light1 = new THREE.DirectionalLight(0xffffff, 1, 100);
        this.light1.position.set(0.2, 1, 0.4)
        this.light1.castShadow = true
        this.scene.add(this.light1);

        this.light2 = new THREE.DirectionalLight(0xffffff, 1, 100);
        this.light2.position.set(-0.2, 1, -0.4)
        this.light2.castShadow = true
        this.scene.add( this.light2 );

        this.gameEnded = false

        this.carList = []

        // Auto Startowe
        this.startCar = new Car(2)
        console.log(this.startCar);
        this.carList.push(this.startCar)

        this.scene.add(this.startCar.bbHelper)
        this.scene.add(this.startCar.returnCarModel())

        for (let i = 0; i < this.cars.length; i++) {
            let car = new Car(2)
            this.carList.push(car)
            car.object.position.set(this.cars[i][0] * 2.22, 15, this.cars[i][1] * 2.22)
            if(this.cars[i][2])
            car.object.rotation.y = Math.PI/2
            this.scene.add(car.bbHelper)
            this.scene.add(car.returnCarModel())
        }
        this.startCar.object.position.set(1000, 15, 55.556)
        this.startCar.setAsPlayer()
        let cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.cameraControls = cameraControls
        // Ściany
        let wallBBArray = []
        let wallArray = []
        {
            this.wallGeometry = new THREE.BoxGeometry(2232.22, 160, 55.556);
            this.wallMaterial = new THREE.MeshPhongMaterial({
                // map: texture,
                specular: 0x525252,
                // specularMap: texture,
                shininess: 100,
                side: THREE.DoubleSide,
                color: 0x505050,
                transparent: false,
                opacity: 1
            })
            
            this.wall1 = new THREE.Mesh(this.wallGeometry, this.wallMaterial)
            this.wall2 = new THREE.Mesh(this.wallGeometry, this.wallMaterial)
            this.wall3 = new THREE.Mesh(this.wallGeometry, this.wallMaterial)
            this.wall4 = new THREE.Mesh(this.wallGeometry, this.wallMaterial)
            
            this.wall1.position.set(0, 0, -1141.11)
            this.wall2.position.set(0, 0, 1141.11)
            this.wall3.position.set(-1141.11, 0, 0)
            this.wall4.position.set(1141.11, 0, 0)
            this.wall3.rotation.y = Math.PI/2
            this.wall4.rotation.y = Math.PI/2

            this.wall1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            this.wall1BB.setFromObject(this.wall1)

            this.wall2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            this.wall2BB.setFromObject(this.wall2)

            this.wall3BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            this.wall3BB.setFromObject(this.wall3)

            this.wall4BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            this.wall4BB.setFromObject(this.wall4)

            wallArray.push(this.wall1)
            wallArray.push(this.wall2)
            wallArray.push(this.wall3)
            wallArray.push(this.wall4)

            wallBBArray.push(this.wall1BB)
            wallBBArray.push(this.wall2BB)
            wallBBArray.push(this.wall3BB)
            wallBBArray.push(this.wall4BB)

            this.scene.add(this.wall1)
            this.scene.add(this.wall2)
            this.scene.add(this.wall3)
            this.scene.add(this.wall4)
        }

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
                if(this.selectedCar.checkColisions(dragArray) || this.selectedCar.checkWallColisions(wallBBArray) || this.intersects1.length > 0 || this.intersects2.length > 0){
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

                    this.intersects1 = []
                    this.intersects2 = []

                    if(this.selectedCar.checkColisions(dragArray)){
                        if(!this.selectedCar.opaque){
                            this.selectedCar.toggleOpacity()
                        }
                    }
                    else if(this.selectedCar.checkWallColisions(wallBBArray)){
                        if(!this.selectedCar.opaque){
                            this.selectedCar.toggleOpacity()
                        }
                    }
                    else {

                        let ray1 = new THREE.Raycaster(
                            new THREE.Vector3(this.endPoint.x + 49, this.endPoint.y, this.endPoint.z + 49),
                            new THREE.Vector3( this.startingPoint.x - this.endPoint.x, this.startingPoint.y - this.endPoint.y, this.startingPoint.z - this.endPoint.z ).normalize(),
                            0,
                            new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z).distanceTo(new THREE.Vector3(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z))
                        )

                        let ray2 = new THREE.Raycaster(
                            new THREE.Vector3(this.endPoint.x - 49, this.endPoint.y, this.endPoint.z - 49),
                            new THREE.Vector3( this.startingPoint.x - this.endPoint.x, this.startingPoint.y - this.endPoint.y, this.startingPoint.z - this.endPoint.z ).normalize(),
                            0,
                            new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z).distanceTo(new THREE.Vector3(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z))
                        )

                        dragArray.forEach(car => {
                            if(car.object != event.object){

                                if(ray1.intersectObject(car.object).length > 0){
                                    this.intersects1 = ray1.intersectObject(car.object)
                                }
                                else if(ray2.intersectObject(car.object).length > 0){
                                    this.intersects2 = ray2.intersectObject(car.object)
                                }

                            }
                        });

                        wallArray.forEach(wall => {
                            if(wall != event.object){
                                if(ray1.intersectObject(wall).length > 0){
                                    this.intersects1 = ray1.intersectObject(wall)
                                }
                                else if(ray2.intersectObject(wall).length > 0){
                                    this.intersects2 = ray2.intersectObject(wall)
                                }

                                if(( this.intersects1.length > 0 || this.intersects2.length > 0) && this.selectedCar.opaque == false )
                                this.selectedCar.toggleOpacity()
                            }
                        });

                        if(!this.selectedCar.checkColisions(dragArray) && !this.selectedCar.checkWallColisions(wallBBArray) && this.selectedCar.opaque && this.intersects1.length == 0 && this.intersects2.length == 0)
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


        // this.scene.add(testCar.returnCarModel())
        // this.scene.add(testCar2.returnCarModel())
        // let testCar = new Car(2)

        // Plansza
        this.geometry = new THREE.BoxGeometry(2222.22, 20, 2222.22);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xf07630,
            side: THREE.DoubleSide
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.set(0, -44.44, 0)
        this.scene.add(this.cube);
        this.geometryLine = new THREE.BoxGeometry(2222.22, 1, 11.11);
        for (let i = 0; i < 20; i++) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            });
            this.cube = new THREE.Mesh(this.geometryLine, this.material);
            this.cube.position.set(0, -32.22, this.x * 2.22)
            this.scene.add(this.cube);
            if (i >= 18) {
                this.x += 45;
            }
            else {
                this.x += 50;
            }
        }
        this.geometryLine2 = new THREE.BoxGeometry(11.11, 1, 2222.22);
        for (let i = 0; i < 10; i++) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            });
            this.cube = new THREE.Mesh(this.geometryLine2, this.material);
            this.cube.position.set(this.x2 * 2.22, -32.22, 0)
            this.scene.add(this.cube);
            this.x2 += 100;
        }


        // kostka końca
        this.geometryFinish = new THREE.BoxGeometry(222.22, 1, 111.11);
        this.materialFinish = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x06aa06,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0x00aa00,
            transparent: false,
            opacity: 1
        })
        this.finishCube = new THREE.Mesh(this.geometryFinish, this.materialFinish);
        this.finishCube.position.set(-1000, -32.22, 55.556)
        this.finishCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.finishCubeBB.setFromObject(this.finishCube)
        this.finishCubeBB.max.y = 80
        this.finishCubeBB.min.y = -80


        this.finishCubeBBVis = new THREE.Box3Helper (this.finishCubeBB, 0xffff00)
        this.scene.add(this.finishCubeBBVis)

        this.scene.add(this.finishCube);


        // kostka spawnu
        this.materialStart = new THREE.MeshPhongMaterial({
            // map: texture,
            specular: 0x0a0aaa,
            // specularMap: texture,
            shininess: 100,
            side: THREE.DoubleSide,
            color: 0x0000ff,
            transparent: false,
            opacity: 1
        })
        this.startCube = new THREE.Mesh(this.geometryFinish, this.materialStart);
        this.startCube.position.set(1000, -32.22, 55.556)
        this.scene.add(this.startCube);






        // this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        //  testCar.enableDragControls(this.camera, this.renderer.domElement, this.cameraControls)

        // // Funkcja podświetlająca
        // const raycaster = new THREE.Raycaster();
        // const mouseVector = new THREE.Vector2();
        // document.getElementById("root").addEventListener("mousedown", () => {
        //     // console.log(event.clientX);
        //     // console.log(window.innerHeight);
        //     console.log(mouseVector)
        //     mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        //     mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //     raycaster.setFromCamera(mouseVector, this.camera);
        //     let intersects = raycaster.intersectObjects(this.scene.children);
        //     if (intersects.length > 0) {
        //         if (intersects[0].object.userData == "car") {
        //             console.log(intersects[0].object);
        //             if (this.checkedCar) {
        //                 this.checkedCar.material.color.b = 0;
        //             }
        //             intersects[0].object.material.color.b = 1;
        //             this.checkedCar = intersects[0].object;
        //         }
        //     }
        // }
        // );
        document.getElementById("root").append(this.renderer.domElement);

        this.render() // wywołanie metody render

        window.onresize = () => {
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
        
        if(this.startCar.detectWin(this.finishCubeBB) && !this.startCar.opaque && this.gameEnded == false){
            this.gameEnded = true
            let carRelease = document.getElementById("root").addEventListener('mouseup', ()=>{
                this.cameraControls.enabled = true
                document.getElementById("root").removeEventListener('mouseup', carRelease)
            })
            this.draggableController.deactivate()
            console.log("WIN")
        }
        
        console.log("render leci")

    }



}