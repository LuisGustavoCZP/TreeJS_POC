import { useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { createScene } from './scripts/scene';
import { load } from './scripts/gltf-loader';
import map from './assets/test1.json';

function App() 
{
	async function init ()
	{
		const {scene, camera, render} = await createScene();
		const textures = [
			new THREE.TextureLoader().load('./src/assets/Grass_01_512.png'),
			new THREE.TextureLoader().load('./src/assets/Dirt_01_512.png'),
		];
		const materials = [
			new THREE.MeshBasicMaterial({map:textures[0]}),
			new THREE.MeshBasicMaterial({map:textures[1]}),
		];
		
		map.tiles.forEach((tile, index) => 
		{
			const mat = materials[index%2]
			const x = tile[0] % 11, y = (tile[0] - x) / 11;
			const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
			mesh.rotation.x = - Math.PI / 2;
			mesh.position.x = x*5;
			mesh.position.z = y*5;
			mesh.receiveShadow = true;
			scene.add(mesh);
		});

		let clock = new THREE.Clock();
		const mixers = [];

		const bearModel = await load('./src/assets/character_bear_animated.glb');

		const animations = Object.fromEntries(bearModel.animations.filter(anim => !anim.name.includes("_")).map(anim => [anim.name, anim]));

		console.log(Object.keys(animations));
		bearModel.scene.traverse(function (object) 
		{
			if (object.isMesh) 
			{
				object.castShadow = true;
			}
		});

		const childs = bearModel.scene.children;
		childs.forEach(object => {
			object.rotateY(1*Math.PI);

			const model = SkeletonUtils.clone(object);
			scene.add(model);

			const mixer = new THREE.AnimationMixer(model);
			mixer.clipAction(animations["Idle"]).play();
			mixers.push(mixer);
		});

		const animate = () => 
		{
			window.requestAnimationFrame(animate);
			
			const delta = clock.getDelta();
			for ( const mixer of mixers ) mixer.update( delta );

			render();
		}

		animate();
	}

	useEffect(() => 
	{
		init ();
	})

	return (
		<div>
			<canvas id='canvas_screen'></canvas>
		</div>
	);
}

export default App
