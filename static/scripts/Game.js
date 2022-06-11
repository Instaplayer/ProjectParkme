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
        testCar2.returnCarModel().position.z = 300
        testCar2.returnCarModel().rotation.y = Math.PI/2

        this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        testCar.enableDragControls(this.camera,this.renderer.domElement, this.cameraControls)
        testCar2.enableDragControls(this.camera,this.renderer.domElement, this.cameraControls)


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
        console.log("render leci")
    }
}