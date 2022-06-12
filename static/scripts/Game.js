class Game {
    constructor() {
        this.cars = [[-450, 475], [-450, 425], [-450, 375], [-450, 325], [-450, 275], [-450, 225], [-450, 175], [-450, 125], [-450, 75], [50, 475], [50, 425], [50, 375], [50, 325], [50, 275], [150, 475], [150, 325]]
        this.scene = new THREE.Scene();
        this.checkedCar = null;
        this.x = -500;
        this.x2 = -500;
        this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(300, 150, 300)
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
        this.scene.add(this.light2);

        // let testCar = new Car(2)
        let startCar = new Car(2)
        console.log(startCar);
        this.scene.add(startCar.returnCarModel())
        for (let i = 0; i < this.cars.length; i++) {
            let car = new Car(2)
            car.object.position.set(this.cars[i][0], 15, this.cars[i][1])
            this.scene.add(car.returnCarModel())
        }
        startCar.object.position.set(450, 15, 25)
        startCar.carMaterial.color.b = 0;
        startCar.carMaterial.color.r = 0;
        startCar.object.userData = "startCar";
        this.geometry = new THREE.BoxGeometry(1000, 20, 1000);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xf07630,
            side: THREE.DoubleSide
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.set(0, -20, 0)
        this.scene.add(this.cube);
        this.geometryLine = new THREE.BoxGeometry(1000, 1, 5);
        for (let i = 0; i < 20; i++) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            });
            this.cube = new THREE.Mesh(this.geometryLine, this.material);
            this.cube.position.set(0, -10, this.x)
            this.scene.add(this.cube);
            if (i >= 18) {
                this.x += 45;
            }
            else {
                this.x += 50;
            }
        }
        this.geometryLine2 = new THREE.BoxGeometry(5, 1, 1000);
        for (let i = 0; i < 10; i++) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            });
            this.cube = new THREE.Mesh(this.geometryLine2, this.material);
            this.cube.position.set(this.x2, -10, 0)
            this.scene.add(this.cube);
            this.x2 += 100;
        }
        this.geometryFinish = new THREE.BoxGeometry(100, 1, 50);
        this.materialFinish = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        this.finishCube = new THREE.Mesh(this.geometryFinish, this.materialFinish);
        this.finishCube.position.set(-450, -10, 25)
        this.scene.add(this.finishCube);
        this.materialStart = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide
        });
        this.startCube = new THREE.Mesh(this.geometryFinish, this.materialStart);
        this.startCube.position.set(450, -10, 25)
        this.scene.add(this.startCube);
        this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        //  testCar.enableDragControls(this.camera, this.renderer.domElement, this.cameraControls)
        startCar.enableDragControls(this.camera, this.renderer.domElement, this.cameraControls)
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        document.getElementById("root").addEventListener("mousedown", () => {
            // console.log(event.clientX);
            // console.log(window.innerHeight);
            console.log(mouseVector)
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            let intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                if (intersects[0].object.userData == "car") {
                    console.log(intersects[0].object);
                    if (this.checkedCar) {
                        this.checkedCar.material.color.b = 0;
                    }
                    intersects[0].object.material.color.b = 1;
                    this.checkedCar = intersects[0].object;
                }
            }
        }
        );
        //  this.scene.add(testCar.returnCarModel())
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

        console.log("render leci")
    }
}