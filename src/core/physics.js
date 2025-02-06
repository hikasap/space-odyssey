import * as THREE from 'three';
import Ammo from 'ammojs3';

class Physics {
    constructor() {
        this.AmmoLib = null;
        this.collisionConfiguration = null;
        this.dispatcher = null;
        this.broadphase = null;
        this.solver = null;
        this.physicsWorld = null;

        this.rigidBodies = [];
        this.tmpTransformation = null;
    }

    async init() {
        // Fully initialize ammojs3 and store the result
        this.AmmoLib = await new Ammo();

        // Now use this.AmmoLib.* for all Ammo references
        this.collisionConfiguration = new this.AmmoLib.btDefaultCollisionConfiguration();
        this.dispatcher = new this.AmmoLib.btCollisionDispatcher(this.collisionConfiguration);
        this.broadphase = new this.AmmoLib.btDbvtBroadphase();
        this.solver = new this.AmmoLib.btSequentialImpulseConstraintSolver();

        this.physicsWorld = new this.AmmoLib.btDiscreteDynamicsWorld(
            this.dispatcher,
            this.broadphase,
            this.solver,
            this.collisionConfiguration
        );

        // Set zero gravity for a "space" environment
        this.physicsWorld.setGravity(new this.AmmoLib.btVector3(0, 0, 0));

        // Create a reusable transform
        this.tmpTransformation = new this.AmmoLib.btTransform();
    }

    addRigidBody(object3D, shape = null, margin = 0.05, mass = 1, linearDamping = 0.7, angularDamping = 0.9, isKinematic = false) {
        
        if (!shape) shape = this.createBoxShape(object3D);
        shape.setMargin(margin);

        const transform = new this.AmmoLib.btTransform();
        transform.setIdentity();
        transform.setOrigin(
            new this.AmmoLib.btVector3(
                object3D.position.x,
                object3D.position.y,
                object3D.position.z
            )
        );
        transform.setRotation(
            new this.AmmoLib.btQuaternion(
                object3D.quaternion.x,
                object3D.quaternion.y,
                object3D.quaternion.z,
                object3D.quaternion.w
            )
        );

        const motionState = new this.AmmoLib.btDefaultMotionState(transform);

        const localInertia = new this.AmmoLib.btVector3(0, 0, 0);
        if (mass > 0) {
            shape.calculateLocalInertia(mass, localInertia);
        }

        const rbInfo = new this.AmmoLib.btRigidBodyConstructionInfo(
            mass,
            motionState,
            shape,
            localInertia
        );
        const body = new this.AmmoLib.btRigidBody(rbInfo);
        body.setDamping(linearDamping, angularDamping);

        if (isKinematic){
            body.setCollisionFlags(body.getCollisionFlags() | 2);
            body.setActivationState(4);
        }

        this.physicsWorld.addRigidBody(body);

        object3D.userData.physicsBody = body;
        this.rigidBodies.push(object3D);
    }

    moveKinematicObject(rigidBody, x, y, z) {
        // Retrieve the current transform
        const transform = new this.AmmoLib.btTransform();
        rigidBody.getMotionState().getWorldTransform(transform);
      
        // Set the new position
        const newPosition = new this.AmmoLib.btVector3(x, y, z);
        transform.setOrigin(newPosition);
      
        // Apply the updated transform
        rigidBody.setWorldTransform(transform);
        rigidBody.getMotionState().setWorldTransform(transform);
    }

    rotateKinematicObject(rigidBody, x, y, z) {
        if (!rigidBody) return;
    
        // Retrieve the current transform
        rigidBody.getMotionState().getWorldTransform(this.tmpTransformation);
        const origin = this.tmpTransformation.getOrigin();
        const rotation = this.tmpTransformation.getRotation();
    
        // Convert Ammo quaternion to Three.js quaternion
        const threeQuat = new THREE.Quaternion(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        // Convert quaternion to Euler for easy manipulation
        const euler = new THREE.Euler().setFromQuaternion(threeQuat, 'XYZ');
    
        // Add rotation increments
        euler.x += x;
        euler.y += y;
        euler.z += z;
    
        // Convert back to quaternion
        threeQuat.setFromEuler(euler);
    
        // Update the transformation
        this.tmpTransformation.setOrigin(origin);
        this.tmpTransformation.setRotation(
            new this.AmmoLib.btQuaternion(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w)
        );
    
        // Apply the updated transform
        rigidBody.setWorldTransform(this.tmpTransformation);
        rigidBody.getMotionState().setWorldTransform(this.tmpTransformation);
    }

    createConvexHullShape(geometry) {
        const shape = new this.AmmoLib.btConvexHullShape();
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const vertex = new this.AmmoLib.btVector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            shape.addPoint(vertex, true);
            this.AmmoLib.destroy(vertex);
        }
        shape.recalcLocalAabb();
        return shape;
    }

    createBoxShape(object3D) {
        // Compute bounding box of the Three.js object
        const box = new THREE.Box3().setFromObject(object3D);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Use half-sizes for Ammo’s btBoxShape
        return new this.AmmoLib.btBoxShape(
            new this.AmmoLib.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
        );
    }

    update(deltaTime) {
        // Step the physics simulation
        this.physicsWorld.stepSimulation(deltaTime, 10);

        // Sync Three.js meshes with Ammo bodies
        for (const objThree of this.rigidBodies) {
            const body = objThree.userData.physicsBody;
            const ms = body.getMotionState();

            if (ms) {
                ms.getWorldTransform(this.tmpTransformation);
                const p = this.tmpTransformation.getOrigin();
                const q = this.tmpTransformation.getRotation();

                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
}

const PhysicsInstance = new Physics();
export default PhysicsInstance;