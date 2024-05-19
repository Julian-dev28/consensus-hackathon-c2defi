#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, vec, Bytes, BytesN, Env, Vec};

// Define an enum to represent different data keys (state variable storage)
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Vec,
}

// Define the contract
#[contract]
pub struct ArrayAndBytesDemo;

#[contractimpl]
impl ArrayAndBytesDemo {
    // Function to demonstrate dynamic bytes creation
    pub fn dynamic_bytes_example(env: &Env) -> Bytes {
        // Bytes (Bytes and BytesN)
        let msg = "Hello, World!";
        Bytes::from_slice(env, msg.as_bytes())
    }

    // Function to demonstrate fixed bytes creation; Results in a 32-byte array
    pub fn fixed_bytes_example(env: &Env) -> BytesN<32> {
        // Bytes (Bytes and BytesN)
        let msg = "Hello, World!";
        let msg_to_array = msg.as_bytes();
        let mut msg_array = [0u8; 32];
        msg_array[..msg_to_array.len()].copy_from_slice(&msg_to_array);
        BytesN::from_array(env, &msg_array)
    }

    // Function to demonstrate creation of a Vec
    pub fn vec_example(env: &Env) -> Vec<u32> {
        // Vec
        let vec: Vec<u32> = vec![&env, 0, 1, 2, 3];
        vec
    }

    // Function to get a Vec from storage
    pub fn get_vec(env: &Env) -> Vec<u32> {
        // Vec
        env.storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0])
    }

    // Function to get an element from a Vec by index
    pub fn get_vec_index(env: &Env, index: u32) -> u32 {
        // Vec
        let vec: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0]);
        vec.get(index).unwrap_or(0)
    }

    // Function to get the length of a Vec
    pub fn get_vec_length(env: &Env) -> u32 {
        // Vec
        let vec: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0]);
        vec.len()
    }

    // Function to push an element into a Vec
    pub fn push(env: &Env, value: u32) -> Vec<u32> {
        // Vec
        let mut vec = env
            .storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0]);
        vec.push_back(value);
        env.storage().persistent().set(&DataKey::Vec, &vec);
        vec
    }

    // Function to remove the last element from a Vec
    pub fn pop(env: &Env) -> Vec<u32> {
        // Vec
        let mut vec = env
            .storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0]);
        vec.pop_back();
        env.storage().persistent().set(&DataKey::Vec, &vec);
        vec
    }

    // Function to remove an element from a Vec by index
    pub fn remove(env: &Env, index: u32) -> Vec<u32> {
        // Vec
        let mut vec = env
            .storage()
            .persistent()
            .get(&DataKey::Vec)
            .unwrap_or(vec![&env, 0]);
        vec.remove(index);
        env.storage().persistent().set(&DataKey::Vec, &vec);
        vec
    }
}
