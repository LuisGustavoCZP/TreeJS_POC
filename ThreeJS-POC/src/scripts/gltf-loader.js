import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader();

/**
 * @param {string} path 
 * @returns {Promise<Group>}
 */
export async function load (path)
{
    return new Promise((resolve, reject) => 
    {
        gltfLoader.load(path, function ( gltf ) 
        {
            resolve(gltf);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}