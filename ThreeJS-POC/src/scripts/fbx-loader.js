import { Group } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const loader = new FBXLoader();

/**
 * @param {string} path 
 * @returns {Promise<Group>}
 */
export async function load (path)
{
    /**
     * @type {Group}
     */
    return new Promise((resolve, reject) => 
    {
        loader.load(path, function (fbx) 
        {
            resolve(fbx);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}